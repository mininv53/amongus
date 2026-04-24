from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

app = FastAPI(title="DeepGuard API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'deepguard')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
analyses_collection = db['analyses']
contact_collection = db['contacts']


def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    result = {}
    for key, value in doc.items():
        if key == '_id':
            result['id'] = str(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [serialize_doc(item) if isinstance(item, dict) else item for item in value]
        elif isinstance(value, dict):
            result[key] = serialize_doc(value)
        else:
            result[key] = value
    return result


class URLAnalysisRequest(BaseModel):
    url: str
    language: Optional[str] = 'en'


class ContactRequest(BaseModel):
    name: str
    email: str
    company: Optional[str] = ''
    message: str


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "DeepGuard API", "version": "1.0.0"}


@app.post("/api/analyze/image")
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    language: str = Form('en')
):
    """Analyze an uploaded image for deepfake indicators"""
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if file.content_type and file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, WEBP")
    
    # Read file
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")
    
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    
    try:
        from analysis_service import analyze_image
        result = await analyze_image(contents, language)
        
        # Save to MongoDB
        analysis_doc = {
            "public_id": str(uuid.uuid4())[:8],
            "analysis_type": "image",
            "filename": file.filename,
            "file_size": len(contents),
            "trust_score": result.get('trust_score', 0),
            "verdict": result.get('verdict', 'UNCERTAIN'),
            "confidence": result.get('confidence', 0),
            "top_signals": result.get('top_signals', []),
            "summary": result.get('summary', ''),
            "recommendations": result.get('recommendations', []),
            "model_results": result.get('model_results', []),
            "models_used": result.get('models_used', 0),
            "models_total": result.get('models_total', 0),
            "consensus_strength": result.get('consensus_strength', ''),
            "language": language,
            "created_at": datetime.now(timezone.utc)
        }
        await analyses_collection.insert_one(analysis_doc)
        
        return serialize_doc(analysis_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/analyze/audio")
async def analyze_audio_endpoint(
    file: UploadFile = File(...),
    language: str = Form('en')
):
    """Analyze an uploaded audio file for deepfake indicators"""
    allowed_types = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/mp3', 'audio/x-wav', 'audio/wave']
    if file.content_type and file.content_type not in allowed_types and not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file.content_type}. Allowed: MP3, WAV, OGG, FLAC")
    
    contents = await file.read()
    if len(contents) > 25 * 1024 * 1024:  # 25MB limit
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 25MB.")
    
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
    
    try:
        from analysis_service import analyze_audio
        result = await analyze_audio(contents, file.filename or "audio.mp3", language)
        
        analysis_doc = {
            "public_id": str(uuid.uuid4())[:8],
            "analysis_type": "audio",
            "filename": file.filename,
            "file_size": len(contents),
            "trust_score": result.get('trust_score', 0),
            "verdict": result.get('verdict', 'UNCERTAIN'),
            "confidence": result.get('confidence', 0),
            "top_signals": result.get('top_signals', []),
            "summary": result.get('summary', ''),
            "recommendations": result.get('recommendations', []),
            "model_results": result.get('model_results', []),
            "models_used": result.get('models_used', 0),
            "models_total": result.get('models_total', 0),
            "consensus_strength": result.get('consensus_strength', ''),
            "language": language,
            "created_at": datetime.now(timezone.utc)
        }
        await analyses_collection.insert_one(analysis_doc)
        
        return serialize_doc(analysis_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/analyze/url")
async def analyze_url_endpoint(request: URLAnalysisRequest):
    """Analyze a URL for deepfake/misinformation indicators"""
    if not request.url.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="URL must start with http:// or https://")
    
    try:
        from analysis_service import analyze_url
        result = await analyze_url(request.url, request.language or 'en')
        
        analysis_doc = {
            "public_id": str(uuid.uuid4())[:8],
            "analysis_type": "url",
            "url": request.url,
            "url_title": result.get('url_title', ''),
            "url_images": result.get('url_images', 0),
            "trust_score": result.get('trust_score', 0),
            "verdict": result.get('verdict', 'UNCERTAIN'),
            "confidence": result.get('confidence', 0),
            "top_signals": result.get('top_signals', []),
            "summary": result.get('summary', ''),
            "recommendations": result.get('recommendations', []),
            "model_results": result.get('model_results', []),
            "models_used": result.get('models_used', 0),
            "models_total": result.get('models_total', 0),
            "consensus_strength": result.get('consensus_strength', ''),
            "language": request.language or 'en',
            "created_at": datetime.now(timezone.utc)
        }
        await analyses_collection.insert_one(analysis_doc)
        
        return serialize_doc(analysis_doc)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/api/analyses/recent")
async def get_recent_analyses(limit: int = 50, analysis_type: Optional[str] = None):
    """Get recent analyses"""
    query = {}
    if analysis_type and analysis_type != 'all':
        query['analysis_type'] = analysis_type
    
    cursor = analyses_collection.find(query).sort('created_at', -1).limit(limit)
    analyses = []
    async for doc in cursor:
        analyses.append(serialize_doc(doc))
    
    return {"analyses": analyses}


@app.get("/api/analyses/{public_id}")
async def get_analysis(public_id: str):
    """Get a specific analysis by public ID"""
    doc = await analyses_collection.find_one({"public_id": public_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return serialize_doc(doc)


@app.get("/api/stats")
async def get_stats():
    """Get analysis statistics"""
    total = await analyses_collection.count_documents({})
    
    # Average trust score
    pipeline = [
        {"$group": {
            "_id": None,
            "avg_score": {"$avg": "$trust_score"},
            "flagged": {"$sum": {"$cond": [{"$lt": ["$trust_score", 50]}, 1, 0]}}
        }}
    ]
    stats_result = await analyses_collection.aggregate(pipeline).to_list(1)
    
    avg_score = 0
    flagged = 0
    if stats_result:
        avg_score = round(stats_result[0].get('avg_score', 0) or 0, 1)
        flagged = stats_result[0].get('flagged', 0)
    
    # Type distribution
    type_pipeline = [
        {"$group": {"_id": "$analysis_type", "count": {"$sum": 1}}}
    ]
    type_result = await analyses_collection.aggregate(type_pipeline).to_list(10)
    type_dist = {item['_id']: item['count'] for item in type_result if item['_id']}
    
    # Verdict distribution
    verdict_pipeline = [
        {"$group": {"_id": "$verdict", "count": {"$sum": 1}}}
    ]
    verdict_result = await analyses_collection.aggregate(verdict_pipeline).to_list(10)
    verdict_dist = {item['_id']: item['count'] for item in verdict_result if item['_id']}
    
    # Recent scores for chart
    recent_cursor = analyses_collection.find({}, {"trust_score": 1, "created_at": 1, "analysis_type": 1}).sort('created_at', -1).limit(20)
    recent_scores = []
    async for doc in recent_cursor:
        recent_scores.append({
            "score": doc.get('trust_score', 0),
            "date": doc.get('created_at', datetime.now(timezone.utc)).isoformat() if isinstance(doc.get('created_at'), datetime) else str(doc.get('created_at', '')),
            "type": doc.get('analysis_type', '')
        })
    
    return {
        "total": total,
        "avg_score": avg_score,
        "flagged": flagged,
        "type_distribution": type_dist,
        "verdict_distribution": verdict_dist,
        "recent_scores": list(reversed(recent_scores))
    }


@app.post("/api/contact")
async def submit_contact(request: ContactRequest):
    """Submit enterprise contact form"""
    doc = {
        "name": request.name,
        "email": request.email,
        "company": request.company,
        "message": request.message,
        "created_at": datetime.now(timezone.utc)
    }
    await contact_collection.insert_one(doc)
    return {"status": "ok", "message": "Contact form submitted successfully"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
