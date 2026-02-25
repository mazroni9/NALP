# NALP Design Concept Generator (Stub)

Python service for generating 3D concepts from land + zone inputs.

## Current (Stub)
- FastAPI endpoints: `/health`, `POST /api/generate`
- Returns placeholder GLB + PNG files
- Output directory configurable via `GENERATOR_OUTPUT_DIR`

## Future
- Blender integration for real 3D generation
- PDF Concept Summary
- Integration with AI models for layout suggestions

## Run locally
```bash
pip install -r requirements.txt
export GENERATOR_OUTPUT_DIR=./output
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Docker
See `/infra/docker-compose.yml` - runs as `generator` service.
