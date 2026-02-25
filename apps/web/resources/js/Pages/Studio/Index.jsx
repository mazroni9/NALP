import { Head, Link } from '@inertiajs/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Grid } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import axios from 'axios';

const TARGET_AREA = 33000;
const LEGAL_BANNER = 'All AI-generated outputs are conceptual drafts and are not for construction. Final engineering drawings require licensed professional approval.';

function Model({ url }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

function PlaceholderModel() {
    return (
        <mesh>
            <boxGeometry args={[50, 20, 80]} />
            <meshStandardMaterial color="#6366f1" />
        </mesh>
    );
}

export default function StudioIndex() {
    const [landType, setLandType] = useState('rectangle');
    const [length, setLength] = useState(200);
    const [width, setWidth] = useState(165);
    const [zoneAPercent, setZoneAPercent] = useState(50);
    const [zoneBPercent, setZoneBPercent] = useState(50);
    const [runs, setRuns] = useState([]);
    const [selectedRun, setSelectedRun] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [glbUrl, setGlbUrl] = useState(null);

    const area = landType === 'rectangle' ? length * width : 0;
    const perimeter = landType === 'rectangle' ? 2 * (length + width) : 0;
    const zoneAArea = area * (zoneAPercent / 100);
    const zoneBArea = area * (zoneBPercent / 100);
    const areaDiff = Math.abs(area - TARGET_AREA);
    const areaWarning = areaDiff > 5000;

    const fetchRuns = () => {
        axios.get('/api/studio/runs', { withCredentials: true }).then(res => {
            setRuns(res.data.runs || []);
        });
    };

    useEffect(() => { fetchRuns(); }, []);

    useEffect(() => {
        if (selectedRun?.files?.length) {
            const glb = selectedRun.files.find(f => f.type === 'glb');
            if (glb && glb.url) setGlbUrl(glb.url);
            else setGlbUrl(null);
        } else {
            setGlbUrl(null);
        }
    }, [selectedRun]);

    useEffect(() => {
        if (!selectedRun || selectedRun.status !== 'pending') return;
        const id = setInterval(() => {
            axios.get(`/api/studio/runs/${selectedRun.id}`, { withCredentials: true })
                .then(res => {
                    const r = res.data.run;
                    setSelectedRun(r);
                    setRuns(prev => prev.map(x => x.id === r.id ? r : x));
                    if (r.status !== 'pending') clearInterval(id);
                });
        }, 2000);
        return () => clearInterval(id);
    }, [selectedRun?.id, selectedRun?.status]);

    const handleGenerate = () => {
        setGenerating(true);
        axios.post('/api/studio/generate', {
            land: {
                type: landType,
                length: landType === 'rectangle' ? length : null,
                width: landType === 'rectangle' ? width : null,
            },
            zone_a_percent: zoneAPercent,
            zone_b_percent: zoneBPercent,
        }, { withCredentials: true })
            .then(res => {
                const run = res.data.run;
                setRuns(r => [run, ...r]);
                setSelectedRun(run);
            })
            .catch(() => {})
            .finally(() => setGenerating(false));
    };

    return (
        <>
            <Head title="Design Studio - NALP" />
            <div className="min-h-screen bg-slate-100">
                <div className="fixed top-0 left-0 right-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-medium text-amber-900">
                    {LEGAL_BANNER}
                </div>
                <nav className="border-b border-slate-200 bg-white pt-12">
                    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                        <Link href="/" className="font-bold text-indigo-600">NALP Studio</Link>
                        <Link href={route('portal.dashboard')} className="text-slate-600 hover:text-indigo-600">Portal</Link>
                    </div>
                </nav>
                <div className="flex gap-6 p-6 pt-24">
                    <aside className="w-80 shrink-0 space-y-6">
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <h2 className="font-semibold">Land Input</h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm">Type</label>
                                    <select value={landType} onChange={e => setLandType(e.target.value)} className="mt-1 w-full rounded border-slate-300">
                                        <option value="rectangle">Rectangle</option>
                                        <option value="polygon">Polygon (coming soon)</option>
                                    </select>
                                </div>
                                {landType === 'rectangle' && (
                                    <>
                                        <div>
                                            <label className="block text-sm">Length (m)</label>
                                            <input type="number" value={length} onChange={e => setLength(Number(e.target.value))} className="mt-1 w-full rounded border-slate-300" min={1} />
                                        </div>
                                        <div>
                                            <label className="block text-sm">Width (m)</label>
                                            <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="mt-1 w-full rounded border-slate-300" min={1} />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <p className="text-sm text-slate-600">Area: {area.toLocaleString()} m²</p>
                                    <p className="text-sm text-slate-600">Perimeter: {perimeter.toLocaleString()} m</p>
                                    {areaWarning && <p className="mt-1 text-sm text-amber-600">⚠ Far from target 33,000 m²</p>}
                                </div>
                            </div>
                        </section>
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <h2 className="font-semibold">Zones</h2>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-sm">Zone A %</label>
                                    <input type="range" min="0" max="100" value={zoneAPercent} onChange={e => setZoneAPercent(Number(e.target.value))} className="w-full" />
                                    <span>{zoneAPercent}% — {zoneAArea.toLocaleString()} m²</span>
                                </div>
                                <div>
                                    <label className="block text-sm">Zone B %</label>
                                    <input type="range" min="0" max="100" value={zoneBPercent} onChange={e => setZoneBPercent(Number(e.target.value))} className="w-full" />
                                    <span>{zoneBPercent}% — {zoneBArea.toLocaleString()} m²</span>
                                </div>
                            </div>
                        </section>
                        <button onClick={handleGenerate} disabled={generating || landType !== 'rectangle'} className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                            {generating ? 'Generating...' : 'Generate Concept'}
                        </button>
                        <section className="rounded-xl border border-slate-200 bg-white p-4">
                            <h2 className="font-semibold">Runs</h2>
                            <div className="mt-2 max-h-48 space-y-1 overflow-y-auto">
                                {runs.map(r => (
                                    <button key={r.id} onClick={() => setSelectedRun(r)} className={`block w-full rounded px-2 py-1 text-left text-sm ${selectedRun?.id === r.id ? 'bg-indigo-100' : 'hover:bg-slate-100'}`}>
                                        Run #{r.id} — {r.status}
                                    </button>
                                ))}
                                {runs.length === 0 && <p className="text-sm text-slate-500">No runs yet</p>}
                            </div>
                        </section>
                    </aside>
                    <main className="min-h-[600px] flex-1 rounded-xl border border-slate-200 bg-white">
                        <div className="h-[600px] w-full">
                            <Canvas camera={{ position: [120, 80, 120], fov: 45 }}>
                                <ambientLight intensity={0.8} />
                                <directionalLight position={[50, 100, 50]} intensity={1} />
                                <OrbitControls />
                                <Grid args={[200, 200]} cellSize={10} cellThickness={0.5} sectionSize={50} sectionThickness={1} fadeDistance={200} fadeStrength={0.5} infiniteGrid />
                                <Suspense fallback={null}>
                                    {glbUrl ? <Model url={glbUrl} /> : <PlaceholderModel />}
                                </Suspense>
                            </Canvas>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
