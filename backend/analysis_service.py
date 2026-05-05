import os
import json
import re
import base64
import asyncio
import aiohttp
from bs4 import BeautifulSoup
from litellm import acompletion
from dotenv import load_dotenv

load_dotenv()

if not os.environ.get("GEMINI_API_KEY") and os.environ.get("GOOGLE_API_KEY"):
    os.environ["GEMINI_API_KEY"] = os.environ["GOOGLE_API_KEY"]

MODEL_CATALOG = [
    {
        "provider": "openai",
        "model": "gpt-4o-mini",
        "label": "OpenAI vision model",
        "env_keys": ["OPENAI_API_KEY"],
    },
    {
        "provider": "anthropic",
        "model": "anthropic/claude-3-5-sonnet-latest",
        "label": "Claude review model",
        "env_keys": ["ANTHROPIC_API_KEY"],
    },
    {
        "provider": "gemini",
        "model": "gemini/gemini-1.5-flash",
        "label": "Gemini review model",
        "env_keys": ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
    },
]


def configured_models():
    return [
        model
        for model in MODEL_CATALOG
        if any(os.environ.get(env_key) for env_key in model["env_keys"])
    ]


def parse_json_response(response_text):
    """Parse JSON from LLM response, handling various formats"""
    text = response_text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    start = text.find("{")
    end = text.rfind("}")  + 1
    if start >= 0 and end > start:
        text = text[start:end]
    return json.loads(text)


def get_lang_instruction(language):
    if language == 'ru':
        return "IMPORTANT: All text fields in your response (summary, signal details, recommendations) MUST be in Russian language."
    return "All text fields in your response should be in English."


def build_image_prompt(language):
    lang_instruction = get_lang_instruction(language)
    return f"""You are an expert deepfake detection AI analyst. Analyze this image for signs of AI generation or manipulation.

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


def build_audio_prompt(filename, file_size_kb, language):
    lang_instruction = get_lang_instruction(language)
    return f"""You are an expert deepfake detection AI analyst specializing in audio. Analyze the following audio file for signs of AI generation or manipulation.

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


def build_url_prompt(url, title, content, image_count, language):
    lang_instruction = get_lang_instruction(language)
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


async def run_single_model(provider, model_name, label, prompt, image_base64=None):
    """Run analysis on a single model"""
    try:
        content = prompt
        if image_base64:
            content = [
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                },
            ]

        response = await acompletion(
            model=model_name,
            messages=[
                {
                    "role": "system",
                    "content": "You are a deepfake detection expert. Respond with valid JSON only.",
                },
                {"role": "user", "content": content},
            ],
            temperature=0.2,
        )
        response_text = response.choices[0].message.content or ""
        result = parse_json_response(response_text)
        return {
            "provider": provider,
            "model": model_name,
            "label": label,
            "trust_score": result.get("trust_score", 50),
            "verdict": result.get("verdict", "UNCERTAIN"),
            "confidence": result.get("confidence", 0.5),
            "top_signals": result.get("top_signals", []),
            "summary": result.get("summary", ""),
            "recommendations": result.get("recommendations", []),
            "success": True
        }
    except Exception as e:
        return {
            "provider": provider,
            "model": model_name,
            "label": label,
            "error": str(e),
            "success": False
        }


def demo_analysis(analysis_type, language='en', url_title=None, url_images=0):
    is_ru = language == 'ru'
    is_ro = language == 'ro'
    if is_ru:
        summary = "Демо-отчёт: backend не подключён к рабочему LLM-ключу, поэтому показан пример результата. Для реальной проверки добавьте один из ключей: OPENAI_API_KEY, ANTHROPIC_API_KEY или GEMINI_API_KEY."
        recommendations = [
            "Подключите backend URL и LLM API key для реального анализа.",
            "Проверяйте важные материалы по оригинальному источнику.",
        ]
        signals = [
            {"signal": "Демо-режим", "impact": "neutral", "detail": "Результат показывает формат отчёта, а не реальную экспертизу файла."},
            {"signal": "Backend/API key", "impact": "neutral", "detail": "Нужен запущенный FastAPI backend с одним из поддерживаемых ключей."},
        ]
    elif is_ro:
        summary = "Raport demo: backend-ul nu are o cheie LLM activă, așa că este afișat un exemplu de rezultat. Pentru analiză reală, adaugă OPENAI_API_KEY, ANTHROPIC_API_KEY sau GEMINI_API_KEY."
        recommendations = [
            "Conectează backend URL și un LLM API key pentru analiză reală.",
            "Verifică materialele importante cu sursa originală.",
        ]
        signals = [
            {"signal": "Mod demo", "impact": "neutral", "detail": "Rezultatul arată formatul raportului, nu o expertiză reală."},
            {"signal": "Backend/API key", "impact": "neutral", "detail": "Este necesar un backend FastAPI pornit cu una dintre cheile acceptate."},
        ]
    else:
        summary = "Demo report: the backend has no active LLM key, so this is a sample result. For real checks, add OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY."
        recommendations = [
            "Connect a backend URL and LLM API key for real analysis.",
            "Confirm high-stakes media with the original source.",
        ]
        signals = [
            {"signal": "Demo mode", "impact": "neutral", "detail": "This shows the report format, not a real forensic read."},
            {"signal": "Backend/API key", "impact": "neutral", "detail": "A running FastAPI backend with a supported key is required for live analysis."},
        ]

    return {
        "trust_score": 50,
        "verdict": "UNCERTAIN",
        "confidence": 0.35,
        "top_signals": signals,
        "summary": summary,
        "recommendations": recommendations,
        "model_results": [
            {
                "provider": "demo",
                "model": "local-demo",
                "label": "Demo report",
                "trust_score": 50,
                "verdict": "UNCERTAIN",
                "confidence": 0.35,
                "top_signals": signals,
                "summary": summary,
                "recommendations": recommendations,
                "success": True,
            }
        ],
        "models_used": 0,
        "models_total": 0,
        "consensus_strength": "demo",
        "analysis_type": analysis_type,
        "url_title": url_title,
        "url_images": url_images,
    }


def aggregate_results(model_results):
    """Aggregate results from multiple models into consensus"""
    successful = [r for r in model_results if r.get("success")]
    
    if not successful:
        return {
            "trust_score": 0,
            "verdict": "UNCERTAIN",
            "confidence": 0,
            "top_signals": [],
            "summary": "All models failed to analyze.",
            "recommendations": ["Try again later."],
            "model_results": model_results,
            "models_used": 0,
            "consensus_strength": "none"
        }
    
    # Average scores
    avg_score = round(sum(r["trust_score"] for r in successful) / len(successful))
    avg_confidence = round(sum(r["confidence"] for r in successful) / len(successful), 2)
    
    # Consensus verdict - majority vote
    verdicts = [r["verdict"] for r in successful]
    verdict_counts = {}
    for v in verdicts:
        verdict_counts[v] = verdict_counts.get(v, 0) + 1
    consensus_verdict = max(verdict_counts, key=verdict_counts.get)
    
    # Check agreement level
    max_count = max(verdict_counts.values())
    if max_count == len(successful):
        consensus_strength = "unanimous"
    elif max_count > len(successful) / 2:
        consensus_strength = "majority"
    else:
        consensus_strength = "split"
    
    # Merge top signals - deduplicate by signal name, keep unique ones
    all_signals = []
    seen_signals = set()
    for r in successful:
        for sig in r.get("top_signals", []):
            sig_key = sig.get("signal", "").lower().strip()
            if sig_key and sig_key not in seen_signals:
                seen_signals.add(sig_key)
                all_signals.append(sig)
    
    # Take top 6 signals
    top_signals = all_signals[:6]
    
    # Best summary (from highest confidence model)
    best_model = max(successful, key=lambda r: r.get("confidence", 0))
    summary = best_model.get("summary", "")
    
    # Merge recommendations (unique)
    all_recs = []
    seen_recs = set()
    for r in successful:
        for rec in r.get("recommendations", []):
            rec_lower = rec.lower().strip()
            if rec_lower not in seen_recs:
                seen_recs.add(rec_lower)
                all_recs.append(rec)
    
    return {
        "trust_score": avg_score,
        "verdict": consensus_verdict,
        "confidence": avg_confidence,
        "top_signals": top_signals,
        "summary": summary,
        "recommendations": all_recs[:5],
        "model_results": model_results,
        "models_used": len(successful),
        "models_total": len(model_results),
        "consensus_strength": consensus_strength
    }


async def analyze_image(image_bytes: bytes, language: str = 'en') -> dict:
    """Multi-model image deepfake analysis"""
    models = configured_models()
    if not models:
        return demo_analysis('image', language)

    image_base64 = base64.b64encode(image_bytes).decode('utf-8')
    prompt = build_image_prompt(language)

    # Run all models in parallel
    tasks = [
        run_single_model(m["provider"], m["model"], m["label"], prompt, image_base64)
        for m in models
    ]
    model_results = await asyncio.gather(*tasks)
    
    result = aggregate_results(list(model_results))
    result['analysis_type'] = 'image'
    return result


async def analyze_audio(audio_bytes: bytes, filename: str, language: str = 'en') -> dict:
    """Multi-model audio deepfake analysis"""
    models = configured_models()
    if not models:
        return demo_analysis('audio', language)

    file_size_kb = len(audio_bytes) / 1024
    prompt = build_audio_prompt(filename, file_size_kb, language)

    tasks = [
        run_single_model(m["provider"], m["model"], m["label"], prompt)
        for m in models
    ]
    model_results = await asyncio.gather(*tasks)
    
    result = aggregate_results(list(model_results))
    result['analysis_type'] = 'audio'
    return result


async def analyze_url(url: str, language: str = 'en') -> dict:
    """Multi-model URL/content analysis"""
    models = configured_models()
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

    if not models:
        return demo_analysis('url', language, title, image_count)

    prompt = build_url_prompt(url, title, text_content[:1500], image_count, language)

    tasks = [
        run_single_model(m["provider"], m["model"], m["label"], prompt)
        for m in models
    ]
    model_results = await asyncio.gather(*tasks)
    
    result = aggregate_results(list(model_results))
    result['analysis_type'] = 'url'
    result['url_title'] = title
    result['url_images'] = image_count
    return result
