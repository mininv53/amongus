"""
TruthLens Multi-Model POC
Test: configured OpenAI, Anthropic, and Gemini models in parallel
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

from litellm import acompletion

if not any(os.environ.get(key) for key in ("OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GEMINI_API_KEY", "GOOGLE_API_KEY")):
    print("ERROR: set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY")
    sys.exit(1)

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
        response = await acompletion(
            model=model_name,
            messages=[
                {
                    "role": "system",
                    "content": "You are a deepfake detection expert. Respond with valid JSON only.",
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": PROMPT},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                        },
                    ],
                },
            ],
            temperature=0.2,
        )
        result = parse_json(response.choices[0].message.content or "")
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
    
    models = []
    if os.environ.get("OPENAI_API_KEY"):
        models.append(("openai", "gpt-4o-mini"))
    if os.environ.get("ANTHROPIC_API_KEY"):
        models.append(("anthropic", "anthropic/claude-3-5-sonnet-latest"))
    if os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY"):
        models.append(("gemini", "gemini/gemini-1.5-flash"))
    
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
    return len(successful) >= 1

if __name__ == "__main__":
    ok = asyncio.run(main())
    sys.exit(0 if ok else 1)
