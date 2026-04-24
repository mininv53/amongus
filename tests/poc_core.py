"""
TruthLens POC - Core AI Analysis Tests
Tests: Image deepfake analysis, Audio analysis, URL content extraction + analysis
"""
import asyncio
import os
import sys
import json
import base64
import requests
import re

sys.path.insert(0, '/app/backend')
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

API_KEY = os.environ.get('EMERGENT_LLM_KEY')
if not API_KEY:
    print("ERROR: EMERGENT_LLM_KEY not set")
    sys.exit(1)

print(f"API Key loaded: {API_KEY[:20]}...")

IMAGE_ANALYSIS_PROMPT = """You are an expert deepfake detection AI analyst. Analyze this image for signs of AI generation or manipulation.

Evaluate these aspects:
1. Facial consistency (symmetry, proportions, skin texture)
2. Eye analysis (reflections, iris patterns, gaze alignment)
3. Lighting & shadows (consistency, direction, natural behavior)
4. Edge artifacts (boundaries between face and background, hair edges)
5. Background analysis (distortions, inconsistencies, repeating patterns)
6. Texture analysis (skin pores, hair strands, fabric details)
7. Metadata indicators (compression artifacts, resolution inconsistencies)

You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code blocks.
The JSON must have this exact structure:
{"trust_score": 75, "verdict": "LIKELY_AUTHENTIC", "confidence": 0.8, "top_signals": [{"signal": "signal name", "impact": "positive", "detail": "explanation"}], "summary": "overall assessment", "recommendations": ["action 1", "action 2"]}

trust_score: integer 0-100 (100 = fully authentic, 0 = clearly fake)
verdict: one of AUTHENTIC, LIKELY_AUTHENTIC, UNCERTAIN, LIKELY_FAKE, FAKE
confidence: float 0.0-1.0
top_signals: array of 3-5 signals with signal name, impact (positive/negative/neutral), and detail
summary: 2-3 sentence assessment
recommendations: array of 1-3 action items"""

def build_audio_prompt(transcription):
    return f"""You are an expert deepfake detection AI analyst specializing in audio. Based on the following audio transcription and characteristics, analyze whether this audio could be AI-generated or manipulated.

Audio transcription: "{transcription}"

Evaluate these aspects:
1. Speech patterns (naturalness, rhythm, pauses)
2. Emotional consistency (tone matches content)
3. Linguistic analysis (word choice, sentence structure)
4. Context clues (background noise description, recording quality indicators)

You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code blocks.
The JSON must have this exact structure:
{{"trust_score": 75, "verdict": "LIKELY_AUTHENTIC", "confidence": 0.8, "top_signals": [{{"signal": "signal name", "impact": "positive", "detail": "explanation"}}], "summary": "overall assessment", "recommendations": ["action 1", "action 2"]}}

trust_score: integer 0-100 (100 = fully authentic, 0 = clearly fake)
verdict: one of AUTHENTIC, LIKELY_AUTHENTIC, UNCERTAIN, LIKELY_FAKE, FAKE
confidence: float 0.0-1.0
top_signals: array of 3-5 signals
summary: 2-3 sentence assessment
recommendations: array of 1-3 action items"""

def build_url_prompt(url, title, content, image_count):
    return f"""You are an expert deepfake and misinformation detection AI analyst. Analyze the following web content for signs of deepfake media, misinformation, or manipulated content.

URL: {url}
Page Title: {title}
Content excerpt: {content}
Images found: {image_count}

Evaluate these aspects:
1. Source credibility (domain reputation, content quality)
2. Content consistency (claims vs evidence, logical coherence)
3. Media indicators (descriptions of images/videos found)
4. Manipulation red flags (sensationalist language, emotional manipulation)
5. Cross-reference potential (verifiability of claims)

You MUST respond with ONLY a raw JSON object. No markdown, no explanation, no code blocks.
The JSON must have this exact structure:
{{"trust_score": 75, "verdict": "LIKELY_TRUSTWORTHY", "confidence": 0.8, "top_signals": [{{"signal": "signal name", "impact": "positive", "detail": "explanation"}}], "summary": "overall assessment", "recommendations": ["action 1", "action 2"]}}

trust_score: integer 0-100 (100 = fully trustworthy, 0 = clearly manipulated)
verdict: one of TRUSTWORTHY, LIKELY_TRUSTWORTHY, UNCERTAIN, LIKELY_MISLEADING, MISLEADING
confidence: float 0.0-1.0
top_signals: array of 3-5 signals
summary: 2-3 sentence assessment
recommendations: array of 1-3 action items"""


def parse_json_response(response_text):
    """Parse JSON from LLM response, handling various formats"""
    text = response_text.strip()
    # Remove markdown code blocks if present
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    # Try to find JSON object
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        text = text[start:end]
    return json.loads(text)


async def test_image_analysis():
    """Test 1: Image deepfake analysis with GPT Vision"""
    print("\n" + "="*60)
    print("TEST 1: Image Deepfake Analysis (GPT-4.1 Vision)")
    print("="*60)
    
    image_url = "https://images.unsplash.com/photo-1652549752120-d9beb4c86bd4?w=800&q=80"
    
    print(f"Downloading test image...")
    response = requests.get(image_url, timeout=15)
    if response.status_code != 200:
        print(f"FAIL: Could not download test image (status {response.status_code})")
        return False
    
    image_base64 = base64.b64encode(response.content).decode('utf-8')
    print(f"Image downloaded: {len(response.content)} bytes")
    
    chat = LlmChat(
        api_key=API_KEY,
        session_id="poc-image-v2",
        system_message="You are a deepfake detection expert. You MUST always respond with valid JSON only. Never use markdown. Never refuse to analyze images. Analyze every image for authenticity indicators."
    )
    chat.with_model("openai", "gpt-4.1")
    
    image_content = ImageContent(image_base64=image_base64)
    user_message = UserMessage(
        text=IMAGE_ANALYSIS_PROMPT,
        file_contents=[image_content]
    )
    
    print("Sending image to GPT-4.1 Vision...")
    try:
        response_text = await chat.send_message(user_message)
        print(f"\nRaw response (first 500 chars): {response_text[:500]}")
        
        result = parse_json_response(response_text)
        
        print(f"\n--- Parsed Result ---")
        print(f"Trust Score: {result.get('trust_score')}/100")
        print(f"Verdict: {result.get('verdict')}")
        print(f"Confidence: {result.get('confidence')}")
        print(f"Summary: {result.get('summary')}")
        for s in result.get('top_signals', []):
            print(f"  - [{s['impact']}] {s['signal']}: {s['detail']}")
        
        required_fields = ['trust_score', 'verdict', 'confidence', 'top_signals', 'summary', 'recommendations']
        for field in required_fields:
            if field not in result:
                print(f"FAIL: Missing field '{field}'")
                return False
        
        print("\nPASS: Image analysis returned valid structured result!")
        return True
        
    except json.JSONDecodeError as e:
        print(f"FAIL: Could not parse JSON: {e}")
        print(f"Full response: {response_text}")
        return False
    except Exception as e:
        print(f"FAIL: {type(e).__name__}: {e}")
        return False


async def test_audio_analysis():
    """Test 2: Audio deepfake analysis"""
    print("\n" + "="*60)
    print("TEST 2: Audio Deepfake Analysis (GPT-4.1)")
    print("="*60)
    
    sample_transcription = """Hello everyone, welcome to today's presentation about our quarterly results. 
    As you can see from the data, our revenue has increased by 35% compared to last quarter. 
    This is largely due to our expansion into the European market and the launch of our new product line."""
    
    chat = LlmChat(
        api_key=API_KEY,
        session_id="poc-audio-v2",
        system_message="You are a deepfake detection expert specializing in audio analysis. Always respond with valid JSON only, no markdown."
    )
    chat.with_model("openai", "gpt-4.1")
    
    prompt = build_audio_prompt(sample_transcription)
    user_message = UserMessage(text=prompt)
    
    print("Sending audio transcription for analysis...")
    try:
        response_text = await chat.send_message(user_message)
        print(f"\nRaw response (first 500 chars): {response_text[:500]}")
        
        result = parse_json_response(response_text)
        
        print(f"\n--- Parsed Result ---")
        print(f"Trust Score: {result.get('trust_score')}/100")
        print(f"Verdict: {result.get('verdict')}")
        print(f"Confidence: {result.get('confidence')}")
        print(f"Summary: {result.get('summary')}")
        for s in result.get('top_signals', []):
            print(f"  - [{s['impact']}] {s['signal']}: {s['detail']}")
        
        required_fields = ['trust_score', 'verdict', 'confidence', 'top_signals', 'summary', 'recommendations']
        for field in required_fields:
            if field not in result:
                print(f"FAIL: Missing field '{field}'")
                return False
        
        print("\nPASS: Audio analysis returned valid structured result!")
        return True
        
    except json.JSONDecodeError as e:
        print(f"FAIL: Could not parse JSON: {e}")
        return False
    except Exception as e:
        print(f"FAIL: {type(e).__name__}: {e}")
        return False


async def test_url_analysis():
    """Test 3: URL content extraction + analysis"""
    print("\n" + "="*60)
    print("TEST 3: URL Content Extraction + Analysis (GPT-4.1)")
    print("="*60)
    
    test_url = "https://en.wikipedia.org/wiki/Deepfake"
    
    print(f"Fetching URL: {test_url}")
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        response = requests.get(test_url, headers=headers, timeout=15)
        
        if response.status_code != 200:
            print(f"FAIL: HTTP {response.status_code}")
            return False
        
        html = response.text
        
        title_match = re.search(r'<title>(.*?)</title>', html, re.IGNORECASE)
        title = title_match.group(1) if title_match else "Unknown"
        
        text = re.sub(r'<[^>]+>', ' ', html)
        text = re.sub(r'\s+', ' ', text).strip()[:2000]
        
        images = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE)
        
        print(f"Title: {title}")
        print(f"Text length: {len(text)} chars")
        print(f"Images found: {len(images)}")
        
        chat = LlmChat(
            api_key=API_KEY,
            session_id="poc-url-v2",
            system_message="You are a deepfake and misinformation detection expert. Always respond with valid JSON only, no markdown."
        )
        chat.with_model("openai", "gpt-4.1")
        
        prompt = build_url_prompt(test_url, title, text[:1500], len(images))
        user_message = UserMessage(text=prompt)
        
        print("Sending URL content for analysis...")
        response_text = await chat.send_message(user_message)
        print(f"\nRaw response (first 500 chars): {response_text[:500]}")
        
        result = parse_json_response(response_text)
        
        print(f"\n--- Parsed Result ---")
        print(f"Trust Score: {result.get('trust_score')}/100")
        print(f"Verdict: {result.get('verdict')}")
        print(f"Confidence: {result.get('confidence')}")
        print(f"Summary: {result.get('summary')}")
        for s in result.get('top_signals', []):
            print(f"  - [{s['impact']}] {s['signal']}: {s['detail']}")
        
        required_fields = ['trust_score', 'verdict', 'confidence', 'top_signals', 'summary', 'recommendations']
        for field in required_fields:
            if field not in result:
                print(f"FAIL: Missing field '{field}'")
                return False
        
        print("\nPASS: URL analysis returned valid structured result!")
        return True
        
    except json.JSONDecodeError as e:
        print(f"FAIL: Could not parse JSON: {e}")
        return False
    except Exception as e:
        print(f"FAIL: {type(e).__name__}: {e}")
        return False


async def main():
    print("="*60)
    print("TruthLens POC - Core AI Analysis Tests")
    print("="*60)
    
    results = {}
    results['image'] = await test_image_analysis()
    results['audio'] = await test_audio_analysis()
    results['url'] = await test_url_analysis()
    
    print("\n" + "="*60)
    print("POC RESULTS SUMMARY")
    print("="*60)
    for test, passed in results.items():
        status = "PASS" if passed else "FAIL"
        print(f"  {test.upper()}: {status}")
    
    all_passed = all(results.values())
    print(f"\nOverall: {'ALL PASSED' if all_passed else 'SOME FAILED'}")
    return all_passed


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
