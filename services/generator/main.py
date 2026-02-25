"""
NALP Design Concept Generator Service (Stub)
Receives land + zone params, produces placeholder GLB + PNG.
Ready for Blender integration later.
"""
import json
import os
import uuid
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="NALP Generator", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])

OUTPUT_DIR = Path(os.environ.get("GENERATOR_OUTPUT_DIR", "/output"))


class LandInput(BaseModel):
    type: str = "rectangle"
    length: float | None = None
    width: float | None = None
    points: list[list[float]] | None = None  # [[x,y], [x,y], ...] for polygon


class GenerateRequest(BaseModel):
    run_id: str | None = None  # Design run ID from Laravel
    land: LandInput
    zone_a_percent: float = 50
    zone_b_percent: float = 50


def create_placeholder_glb(run_id: str) -> str:
    """Create a minimal GLB placeholder. Real impl would use Blender/trimesh."""
    out_dir = OUTPUT_DIR / f"run-{run_id}"
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / "model.glb"
    # Minimal GLB (empty scene) - 116 bytes
    glb = bytes([
        0x67, 0x6C, 0x54, 0x46, 0x02, 0x00, 0x00, 0x00,
        0x74, 0x00, 0x00, 0x00, 0x4A, 0x53, 0x4F, 0x4E,
        0x7B, 0x22, 0x61, 0x73, 0x73, 0x65, 0x74, 0x22,
        0x3A, 0x7B, 0x22, 0x76, 0x65, 0x72, 0x73, 0x69,
        0x6F, 0x6E, 0x22, 0x3A, 0x22, 0x32, 0x2E, 0x30,
        0x22, 0x7D, 0x2C, 0x22, 0x73, 0x63, 0x65, 0x6E,
        0x65, 0x22, 0x3A, 0x30, 0x2C, 0x22, 0x73, 0x63,
        0x65, 0x6E, 0x65, 0x73, 0x22, 0x3A, 0x5B, 0x5D,
        0x2C, 0x22, 0x6E, 0x6F, 0x64, 0x65, 0x73, 0x22,
        0x3A, 0x5B, 0x5D, 0x2C, 0x22, 0x62, 0x75, 0x66,
        0x66, 0x65, 0x72, 0x73, 0x22, 0x3A, 0x5B, 0x5D,
        0x2C, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72,
        0x56, 0x69, 0x65, 0x77, 0x73, 0x22, 0x3A, 0x5B,
        0x5D, 0x2C, 0x22, 0x61, 0x63, 0x63, 0x65, 0x73,
        0x73, 0x6F, 0x72, 0x73, 0x22, 0x3A, 0x5B, 0x5D,
        0x2C, 0x22, 0x6D, 0x65, 0x73, 0x68, 0x65, 0x73,
        0x22, 0x3A, 0x5B, 0x5D, 0x7D,
    ])
    path.write_bytes(glb)
    return f"design-outputs/run-{run_id}/model.glb"


def create_placeholder_png(run_id: str, idx: int) -> str:
    """Create a placeholder PNG (1x1 pixel). Real impl would render via Blender."""
    out_dir = OUTPUT_DIR / f"run-{run_id}"
    out_dir.mkdir(parents=True, exist_ok=True)
    path = out_dir / f"render_{idx}.png"
    # Minimal valid 1x1 PNG
    png = bytes([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
        0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
        0x54, 0x08, 0xD7, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,
        0x00, 0x05, 0xFE, 0x02, 0xFE, 0xDC, 0xCC, 0x59,
        0xE7, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E,
        0x44, 0xAE, 0x42, 0x60, 0x82,
    ])
    path.write_bytes(png)
    return f"design-outputs/run-{run_id}/render_{idx}.png"


@app.get("/health")
def health():
    return {"status": "ok"}


def _generate_response(req: GenerateRequest):
    run_id = req.run_id or str(uuid.uuid4())[:8]
    files = []
    glb_path = create_placeholder_glb(run_id)
    files.append({"type": "glb", "path": glb_path})
    for i in range(2):
        png_path = create_placeholder_png(run_id, i)
        files.append({"type": "png", "path": png_path})
    pdf_summary = f"Concept summary for run {run_id}. Zone A: {req.zone_a_percent}%, Zone B: {req.zone_b_percent}%. Land type: {req.land.type}."
    return {
        "outputs": {
            "files": files,
            "run_id": run_id,
            "pdf_summary": pdf_summary,
        },
    }


@app.post("/api/generate")
def generate(req: GenerateRequest):
    return _generate_response(req)


@app.post("/generate-concept")
def generate_concept(req: GenerateRequest):
    return _generate_response(req)
