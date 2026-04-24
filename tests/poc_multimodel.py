"""
TruthLens Multi-Model POC
Test: GPT-5.1 + Claude Sonnet 4.5 + Gemini 2.5 Pro in parallel
"""
import asyncio
import os
import sys
import json
import base64
import requests

sys.path.insert(0, '/app/backend')
from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

API_KEY = os.environ.get('EMERGENT_LLM_KEY')
print(f"API Key: {API_KEY[:20]}...")

PROMPT = """You are an expert deepfake detection AI. Analyze this image for signs of AI generation or manipulation.

Evaluate: facial consistency, eye analysis, lighting/shadows, edge artifacts, background, texture quality.

You MUST respond with ONLY a raw JSON object. No markdown, no code blocks.
Structure: {"trust_score": 75, "verdict": "LIKELY_AUTHENTIC", "confidence": 0.8, "top_signals": [{"signal": "name", "impact": "positive", "detail": "explanation"}], "summary": "assessment", "recommendations": ["action"]}
trust_score: integer 0-100, verdict: AUTHENTIC/LIKELY_AUTHENTIC/UNCERTAIN/LIKELY_FAKE/FAKE, confidence: 0.0-1.0"""

def parse_json(text):
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    start = text.find("{")
    end = text.rfind("}") + 1
    if start >= 0 and end > start:
        text = text[start:end]
    return json.loads(text)

async def test_model(provider, model_name, image_base64):
    print(f"\n--- Testing {provider}/{model_name} ---")
    try:
        chat = LlmChat(
            api_key=API_KEY,
            session_id=f"multi-poc-{provider}",
            system_message="You are a deepfake detection expert. Respond with valid JSON only."
        )
        chat.with_model(provider, model_name)
        
        image_content = ImageContent(image_base64=image_base64)
        msg = UserMessage(text=PROMPT, file_contents=[image_content])
        
        response = await chat.send_message(msg)
        result = parse_json(response)
        print(f"  Score: {result['trust_score']}, Verdict: {result['verdict']}, Confidence: {result['confidence']}")
        print(f"  Summary: {result['summary'][:100]}...")
        return {"provider": provider, "model": model_name, "result": result, "success": True}
    except Exception as e:
        print(f"  FAILED: {e}")
        return {"provider": provider, "model": model_name, "error": str(e), "success": False}

async def main():
    print("Downloading test image...")
    img = requests.get("https://images.unsplash.com/photo-1652549752120-d9beb4c86bd4?w=400&q=80", timeout=15)
    b64 = base64.b64encode(img.content).decode('utf-8')
    print(f"Image: {len(img.content)} bytes")
    
    models = [
        ("openai", "gpt-5.1"),
        ("anthropic", "claude-sonnet-4-5-20250929"),
        ("gemini", "gemini-2.5-pro"),
    ]
    
    # Run all 3 in parallel
    tasks = [test_model(p, m, b64) for p, m in models]
    results = await asyncio.gather(*tasks)
    
    print("\n" + "="*60)
    print("MULTI-MODEL RESULTS")
    print("="*60)
    
    successful = [r for r in results if r['success']]
    failed = [r for r in results if not r['success']]
    
    for r in successful:
        res = r['result']
        print(f"  {r['provider']}/{r['model']}: Score={res['trust_score']}, Verdict={res['verdict']}")
    
    for r in failed:
        print(f"  {r['provider']}/{r['model']}: FAILED - {r['error']}")
    
    if successful:
        scores = [r['result']['trust_score'] for r in successful]
        avg = sum(scores) / len(scores)
        print(f"\n  Consensus Score: {avg:.0f} (from {len(successful)} models)")
    
    print(f"\n  Passed: {len(successful)}/3, Failed: {len(failed)}/3")
    return len(successful) >= 2  # At least 2 models must work

if __name__ == "__main__":
    ok = asyncio.run(main())
    sys.exit(0 if ok else 1)
