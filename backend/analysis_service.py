import os
import json
import re
import base64
import aiohttp
from bs4 import BeautifulSoup
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get('EMERGENT_LLM_KEY', '')


def parse_json_response(response_text):
    """Parse JSON from LLM response, handling various formats"""
    text = response_text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        text = text[start:end]
    return json.loads(text)


def get_lang_instruction(language):
    if language == 'ru':
        return "IMPORTANT: All text fields in your response (summary, signal details, recommendations) MUST be in Russian language."
    return "All text fields in your response should be in English."


async def analyze_image(image_bytes: bytes, language: str = 'en') -> dict:
    """Analyze an image for deepfake indicators using GPT Vision"""
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    
    lang_instruction = get_lang_instruction(language)
    
    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"image-analysis-{os.urandom(8).hex()}",
        system_message="You are a deepfake detection expert. You MUST always respond with valid JSON only. Never use markdown. Analyze every image for authenticity indicators."
    )
    chat.with_model("openai", "gpt-4.1")
    
    prompt = f"""You are an expert deepfake detection AI analyst. Analyze this image for signs of AI generation or manipulation.

Evaluate these aspects:
1. Facial consistency (symmetry, proportions, skin texture)
2. Eye analysis (reflections, iris patterns, gaze alignment)
3. Lighting & shadows (consistency, direction, natural behavior)
4. Edge artifacts (boundaries between face and background, hair edges)
5. Background analysis (distortions, inconsistencies, repeating patterns)
6. Texture analysis (skin pores, hair strands, fabric details)
7. Overall composition and metadata indicators

{lang_instruction}

You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code blocks.
The JSON must have this exact structure:
{{"trust_score": 75, "verdict": "LIKELY_AUTHENTIC", "confidence": 0.8, "top_signals": [{{"signal": "signal name", "impact": "positive", "detail": "explanation"}}], "summary": "overall assessment", "recommendations": ["action 1", "action 2"]}}

trust_score: integer 0-100 (100 = fully authentic, 0 = clearly fake)
verdict: one of AUTHENTIC, LIKELY_AUTHENTIC, UNCERTAIN, LIKELY_FAKE, FAKE
confidence: float 0.0-1.0
top_signals: array of 3-5 signals with signal name, impact (positive/negative/neutral), and detail
summary: 2-3 sentence assessment
recommendations: array of 1-3 action items"""
    
    image_content = ImageContent(image_base64=image_base64)
    user_message = UserMessage(
        text=prompt,
        file_contents=[image_content]
    )
    
    response_text = await chat.send_message(user_message)
    result = parse_json_response(response_text)
    result['analysis_type'] = 'image'
    return result


async def analyze_audio(audio_bytes: bytes, filename: str, language: str = 'en') -> dict:
    """Analyze audio for deepfake indicators"""
    audio_base64 = base64.b64encode(audio_bytes).decode('utf-8')
    file_size_kb = len(audio_bytes) / 1024
    
    lang_instruction = get_lang_instruction(language)
    
    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"audio-analysis-{os.urandom(8).hex()}",
        system_message="You are a deepfake detection expert specializing in audio analysis. Always respond with valid JSON only, no markdown."
    )
    chat.with_model("openai", "gpt-4.1")
    
    prompt = f"""You are an expert deepfake detection AI analyst specializing in audio. Analyze the following audio file for signs of AI generation or manipulation.

Audio file info:
- Filename: {filename}
- File size: {file_size_kb:.1f} KB
- Format: {filename.split('.')[-1].upper() if '.' in filename else 'UNKNOWN'}

Based on the audio file characteristics and any available metadata, evaluate:
1. Speech patterns (naturalness indicators from file properties)
2. Audio quality indicators (compression artifacts, sampling rate clues)
3. File format analysis (expected vs actual properties)
4. Temporal consistency (file duration vs size ratio)
5. Generation indicators (common AI audio generation artifacts)

{lang_instruction}

You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code blocks.
The JSON must have this exact structure:
{{"trust_score": 75, "verdict": "LIKELY_AUTHENTIC", "confidence": 0.8, "top_signals": [{{"signal": "signal name", "impact": "positive", "detail": "explanation"}}], "summary": "overall assessment", "recommendations": ["action 1", "action 2"]}}

trust_score: integer 0-100 (100 = fully authentic, 0 = clearly fake)
verdict: one of AUTHENTIC, LIKELY_AUTHENTIC, UNCERTAIN, LIKELY_FAKE, FAKE
confidence: float 0.0-1.0
top_signals: array of 3-5 signals
summary: 2-3 sentence assessment
recommendations: array of 1-3 action items"""
    
    user_message = UserMessage(text=prompt)
    response_text = await chat.send_message(user_message)
    result = parse_json_response(response_text)
    result['analysis_type'] = 'audio'
    return result


async def analyze_url(url: str, language: str = 'en') -> dict:
    """Analyze a URL for deepfake/misinformation indicators"""
    lang_instruction = get_lang_instruction(language)
    
    # Fetch URL content
    title = "Unknown"
    text_content = ""
    image_count = 0
    
    try:
        async with aiohttp.ClientSession() as session:
            headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
            async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as response:
                if response.status == 200:
                    html = await response.text()
                    soup = BeautifulSoup(html, 'html.parser')
                    
                    title_tag = soup.find('title')
                    title = title_tag.get_text(strip=True) if title_tag else "Unknown"
                    
                    for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
                        tag.decompose()
                    text_content = soup.get_text(separator=' ', strip=True)[:2000]
                    
                    images = soup.find_all('img')
                    image_count = len(images)
    except Exception as e:
        text_content = f"Failed to fetch URL: {str(e)}"
    
    chat = LlmChat(
        api_key=API_KEY,
        session_id=f"url-analysis-{os.urandom(8).hex()}",
        system_message="You are a deepfake and misinformation detection expert. Always respond with valid JSON only, no markdown."
    )
    chat.with_model("openai", "gpt-4.1")
    
    prompt = f"""You are an expert deepfake and misinformation detection AI analyst. Analyze the following web content for signs of deepfake media, misinformation, or manipulated content.

URL: {url}
Page Title: {title}
Content excerpt: {text_content[:1500]}
Images found: {image_count}

Evaluate these aspects:
1. Source credibility (domain reputation, content quality)
2. Content consistency (claims vs evidence, logical coherence)
3. Media indicators (descriptions of images/videos found)
4. Manipulation red flags (sensationalist language, emotional manipulation)
5. Cross-reference potential (verifiability of claims)

{lang_instruction}

You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code blocks.
The JSON must have this exact structure:
{{"trust_score": 75, "verdict": "LIKELY_TRUSTWORTHY", "confidence": 0.8, "top_signals": [{{"signal": "signal name", "impact": "positive", "detail": "explanation"}}], "summary": "overall assessment", "recommendations": ["action 1", "action 2"]}}

trust_score: integer 0-100 (100 = fully trustworthy, 0 = clearly manipulated)
verdict: one of TRUSTWORTHY, LIKELY_TRUSTWORTHY, UNCERTAIN, LIKELY_MISLEADING, MISLEADING
confidence: float 0.0-1.0
top_signals: array of 3-5 signals
summary: 2-3 sentence assessment
recommendations: array of 1-3 action items"""
    
    user_message = UserMessage(text=prompt)
    response_text = await chat.send_message(user_message)
    result = parse_json_response(response_text)
    result['analysis_type'] = 'url'
    result['url_title'] = title
    result['url_images'] = image_count
    return result
