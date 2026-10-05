import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getRiskColor } from '../../services/riskCalculator';
import { Layers, Compass, AlertTriangle } from 'lucide-react';

export interface Hotspot3D {
  id: string;
  name: string;
  state: string;
  score: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  x: number;
  y: number;
  z: number;
  rainfall: number;
  moisture: number;
  slope: number;
  trend: number;
  why: string[];
}

export const hotspots: Hotspot3D[] = [
  {
    id: 'east-khasi-hills',
    name: 'East Khasi Hills',
    state: 'Meghalaya',
    score: 87,
    level: 'CRITICAL',
    x: 0,
    y: 1.45,
    z: 0.6,
    rainfall: 168,
    moisture: 91,
    slope: 38,
    trend: 24,
    why: ['Extreme rainfall (168mm)', 'High soil saturation (91%)', 'Steep terrain (38°)'],
  },
  {
    id: 'cherrapunji',
    name: 'Cherrapunji',
    state: 'Meghalaya',
    score: 79,
    level: 'CRITICAL',
    x: -1.2,
    y: 1.2,
    z: 1.4,
    rainfall: 145,
    moisture: 84,
    slope: 35,
    trend: 18,
    why: ['Heavy cloudburst accumulation', 'Pore pressure overload', 'Historical scarp instability'],
  },
  {
    id: 'tawang',
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    score: 72,
    level: 'HIGH',
    x: 2.2,
    y: 2.6,
    z: -1.8,
    rainfall: 132,
    moisture: 76,
    slope: 34,
    trend: 12,
    why: ['High altitude shear stress', 'Slope angle > 30°', 'Debris flow corridor'],
  },
  {
    id: 'gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    score: 58,
    level: 'HIGH',
    x: -2.8,
    y: 2.1,
    z: -1.2,
    rainfall: 95,
    moisture: 63,
    slope: 29,
    trend: 9,
    why: ['Teesta valley moisture corridor', 'Highway corridor exposure', 'Moderate saturation'],
  },
  {
    id: 'itanagar',
    name: 'Itanagar',
    state: 'Arunachal Pradesh',
    score: 55,
    level: 'HIGH',
    x: 3.1,
    y: 1.1,
    z: -0.6,
    rainfall: 89,
    moisture: 67,
    slope: 28,
    trend: 8,
    why: ['Foothill drainage runoff', 'Active cut slopes', 'Elevated soil moisture'],
  },
  {
    id: 'shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    score: 43,
    level: 'MODERATE',
    x: 0.5,
    y: 1.5,
    z: 0.1,
    rainfall: 74,
    moisture: 55,
    slope: 24,
    trend: 5,
    why: ['Urban fringe slope construction', 'Moderate runoff accumulation'],
  },
  {
    id: 'kohima',
    name: 'Kohima',
    state: 'Nagaland',
    score: 38,
    level: 'MODERATE',
    x: 3.6,
    y: 1.3,
    z: 1.1,
    rainfall: 62,
    moisture: 49,
    slope: 26,
    trend: 3,
    why: ['Barail ridge weathering', 'Nominal antecedent rain'],
  },
  {
    id: 'aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    score: 31,
    level: 'MODERATE',
    x: 1.4,
    y: 0.8,
    z: 2.5,
    rainfall: 48,
    moisture: 41,
    slope: 22,
    trend: -2,
    why: ['Linear ridge terrain', 'Dry antecedent conditions'],
  },
];

interface Terrain3DProps {
  onSelectHotspot?: (id: string) => void;
  selectedLocationId?: string | null;
}

export const Terrain3D: React.FC<Terrain3DProps> = ({ onSelectHotspot, selectedLocationId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot3D>(
    hotspots.find(h => h.id === selectedLocationId) || hotspots[0]
  );
  const [showHint, setShowHint] = useState(true);
  const [showWireframe, setShowWireframe] = useState(true);
  const cameraTargetRef = useRef<{ x: number; y: number; z: number } | null>(null);

  // Sync external selection
  useEffect(() => {
    if (selectedLocationId) {
      const found = hotspots.find(h => h.id === selectedLocationId);
      if (found) {
        setSelectedHotspot(found);
        cameraTargetRef.current = { x: found.x, y: found.y + 0.8, z: found.z + 3.2 };
      }
    }
  }, [selectedLocationId]);

  // Auto-hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene with dark atmospheric fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.055);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 7.5, 11.5);
    let cameraLookAt = new THREE.Vector3(0, 0.5, 0);
    camera.lookAt(cameraLookAt);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x0b1728, 2.2);
    scene.add(ambientLight);

    // Cyan directional light (North-East terrain illumination)
    const directionalLight = new THREE.DirectionalLight(0x06b6d4, 2.8);
    directionalLight.position.set(6, 12, 6);
    scene.add(directionalLight);

    // Deep Indigo rim light from opposite side
    const rimLight = new THREE.DirectionalLight(0x6366f1, 2.0);
    rimLight.position.set(-8, 6, -8);
    scene.add(rimLight);

    // Point light over Meghalaya plateau
    const accentPointLight = new THREE.PointLight(0x38bdf8, 3.5, 16);
    accentPointLight.position.set(0, 3.5, 0.5);
    scene.add(accentPointLight);

    // 3D Terrain Geometry: stylized North-East India terrain (ridge, plateau & valleys)
    const terrainSize = 12;
    const segments = 80;
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);

      // Multi-octave topographical elevation
      // 1. High Himalayas in North (negative Z)
      const himalayanRise = Math.max(0, -vz * 0.45);
      // 2. Shillong / Khasi Hills plateau (central uplift around x: 0, z: 0.5)
      const distKhasi = Math.sqrt(vx * vx + (vz - 0.5) * (vz - 0.5));
      const khasiPlateau = Math.max(0, 1.4 - distKhasi * 0.45) * 1.1;
      // 3. Brahmaputra valley depression between Himalayas and Khasi plateau (around z: -0.6)
      const valleyDip = Math.exp(-Math.pow(vz + 0.6, 2) / 0.8) * 0.6;
      // 4. Rugged mountain ridges noise
      const ridgeNoise =
        Math.sin(vx * 1.1 + vz * 0.9) * 0.45 +
        Math.sin(vx * 2.2 - vz * 1.8) * 0.25 +
        Math.cos(vx * 3.5 + vz * 2.8) * 0.12;

      let elevation = himalayanRise + khasiPlateau + ridgeNoise - valleyDip;
      // Plateau step terrace effect
      if (elevation > 1.2 && distKhasi < 2.0) {
        elevation = 1.2 + Math.pow(elevation - 1.2, 0.7) * 0.5;
      }
      pos.setY(i, Math.max(0.05, elevation));
    }
    geometry.computeVertexNormals();

    // Dark terrain surface material
    const terrainMaterial = new THREE.MeshStandardMaterial({
      color: 0x07111f,
      roughness: 0.7,
      metalness: 0.35,
      flatShading: true,
    });
    const terrainMesh = new THREE.Mesh(geometry, terrainMaterial);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // Topographic Wireframe / Contour Overlay
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.position.y += 0.015;
    scene.add(wireframeMesh);

    // Base boundary plate / pedestal
    const pedestalGeom = new THREE.BoxGeometry(terrainSize + 0.2, 0.4, terrainSize + 0.2);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.9,
      metalness: 0.1,
    });
    const pedestal = new THREE.Mesh(pedestalGeom, pedestalMat);
    pedestal.position.y = -0.2;
    scene.add(pedestal);

    // Hotspot Markers Group
    const markerGroup = new THREE.Group();
    const pinGeom = new THREE.SphereGeometry(0.16, 24, 24);

    hotspots.forEach(h => {
      const colorHex = getRiskColor(h.level);
      const isCritical = h.level === 'CRITICAL';

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colorHex),
        emissive: new THREE.Color(colorHex),
        emissiveIntensity: isCritical ? 1.8 : 0.8,
        roughness: 0.2,
      });

      const pin = new THREE.Mesh(pinGeom, mat);
      pin.position.set(h.x, h.y + 0.1, h.z);
      pin.userData = { id: h.id, hotspot: h };

      // Stem / Pillar connecting pin to terrain
      const stemGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8);
      const stemMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colorHex), transparent: true, opacity: 0.6 });
      const stem = new THREE.Mesh(stemGeom, stemMat);
      stem.position.set(h.x, h.y - 0.1, h.z);

      // Outer Pulsing Ring
      const ringGeom = new THREE.RingGeometry(0.22, 0.38, 32);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(colorHex),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isCritical ? 0.75 : 0.4,
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(h.x, h.y - 0.08, h.z);
      ring.userData = { isRing: true, isCritical, initialY: h.y - 0.08 };

      markerGroup.add(pin);
      markerGroup.add(stem);
      markerGroup.add(ring);
    });
    scene.add(markerGroup);

    // Mouse Interaction: Orbit Drag & Zoom
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotY = 0;
    let rotX = 0.55;
    let cameraDistance = 12.5;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setShowHint(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;

      rotY += deltaX * 0.005;
      rotX += deltaY * 0.005;
      rotX = Math.max(0.15, Math.min(1.2, rotX)); // clamp pitch angle

      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      cameraTargetRef.current = null; // stop auto-camera fly on manual interaction
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance += e.deltaY * 0.01;
      cameraDistance = Math.max(6, Math.min(20, cameraDistance));
      cameraTargetRef.current = null;
    };

    const container = mountRef.current;
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Raycaster for 3D Marker Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          if (hit.object.userData && hit.object.userData.hotspot) {
            const h = hit.object.userData.hotspot;
            setSelectedHotspot(h);
            cameraTargetRef.current = { x: h.x, y: h.y + 0.8, z: h.z + 3.2 };
            if (onSelectHotspot) onSelectHotspot(h.id);
            break;
          }
        }
      }
    };

    container.addEventListener('click', onClick);

    // Double-click to reset camera
    const onDoubleClick = () => {
      cameraTargetRef.current = { x: 0, y: 7.5, z: 11.5 };
    };
    container.addEventListener('dblclick', onDoubleClick);

    // Resize Handler
    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation if flying to target
      if (cameraTargetRef.current) {
        camera.position.x += (cameraTargetRef.current.x - camera.position.x) * 0.05;
        camera.position.y += (cameraTargetRef.current.y - camera.position.y) * 0.05;
        camera.position.z += (cameraTargetRef.current.z - camera.position.z) * 0.05;
        camera.lookAt(0, 0.5, 0);
      } else {
        // Orbit rotation calculation
        const cx = Math.sin(rotY) * Math.cos(rotX) * cameraDistance;
        const cz = Math.cos(rotY) * Math.cos(rotX) * cameraDistance;
        const cy = Math.sin(rotX) * cameraDistance;

        camera.position.x += (cx - camera.position.x) * 0.08;
        camera.position.y += (cy - camera.position.y) * 0.08;
        camera.position.z += (cz - camera.position.z) * 0.08;
        camera.lookAt(cameraLookAt);
      }

      // Marker Pulses & Ambient movement
      markerGroup.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh && child.userData && child.userData.hotspot) {
          const h: Hotspot3D = child.userData.hotspot;
          if (h.level === 'CRITICAL') {
            const scale = 1 + Math.sin(elapsedTime * 4.5 + i) * 0.18;
            child.scale.set(scale, scale, scale);
          } else if (h.level === 'HIGH') {
            const scale = 1 + Math.sin(elapsedTime * 3.0 + i) * 0.12;
            child.scale.set(scale, scale, scale);
          }
        }
        // Pulse outer rings
        if (child instanceof THREE.Mesh && child.userData && child.userData.isRing) {
          const isCrit = child.userData.isCritical;
          const ringScale = isCrit
            ? 1 + Math.sin(elapsedTime * 3.5 + i) * 0.25
            : 1 + Math.sin(elapsedTime * 2.0 + i) * 0.15;
          child.scale.set(ringScale, ringScale, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      container.removeEventListener('dblclick', onDoubleClick);
      window.removeEventListener('resize', onResize);

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      terrainMaterial.dispose();
      wireframeMat.dispose();
      pedestalGeom.dispose();
      pedestalMat.dispose();
      pinGeom.dispose();
      renderer.dispose();
    };
  }, [onSelectHotspot]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#030712] border border-white/[0.08] shadow-2xl select-none group">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Title & Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="glass-panel px-3 py-1.5 flex items-center gap-2 bg-[#07111F]/85 border-white/[0.08]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-black text-white font-heading tracking-tight">
            3D DIGITAL TERRAIN MODEL
          </span>
          <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-1.5 py-0.5 rounded">
            NER 60FPS
          </span>
        </div>
      </div>

      {/* Floating Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowWireframe(!showWireframe)}
          className={`p-2 rounded-xl text-xs font-bold transition-all glass-panel ${
            showWireframe
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-[#07111F]/80 text-slate-400 border-white/[0.08] hover:text-white'
          }`}
          title="Toggle Topographic Contours"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            cameraTargetRef.current = { x: 0, y: 7.5, z: 11.5 };
          }}
          className="p-2 rounded-xl text-xs font-bold glass-panel bg-[#07111F]/80 text-slate-400 border-white/[0.08] hover:text-white transition-all"
          title="Reset Camera View"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auto-fading drag hint */}
      {showHint && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#07111F]/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-[10px] font-bold font-mono px-3.5 py-1.5 rounded-full shadow-xl pointer-events-none animate-pulse">
          ❖ DRAG TO EXPLORE TERRAIN • SCROLL TO ZOOM • CLICK HOTSPOTS
        </div>
      )}

      {/* Selected 3D Location Floating Glass Detail Panel (Requested in Section 5) */}
      {selectedHotspot && (
        <div className="absolute bottom-4 left-4 z-20 w-72 sm:w-80 glass-panel-elevated p-4 border-cyan-500/40 shadow-2xl backdrop-blur-2xl bg-[#0B1728]/95 animate-slide-up space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                {selectedHotspot.state}
              </p>
              <h4 className="text-base font-black text-white font-heading leading-tight">
                {selectedHotspot.name}
              </h4>
            </div>
            <div className="text-right">
              <span
                className="text-xs font-black font-mono px-2.5 py-0.5 rounded-full border shadow-sm inline-block"
                style={{
                  color: getRiskColor(selectedHotspot.level),
                  backgroundColor: `${getRiskColor(selectedHotspot.level)}18`,
                  borderColor: `${getRiskColor(selectedHotspot.level)}40`,
                }}
              >
                {selectedHotspot.score} / 100
              </span>
              <p
                className="text-[9px] font-black uppercase tracking-wider mt-0.5"
                style={{ color: getRiskColor(selectedHotspot.level) }}
              >
                {selectedHotspot.level}
              </p>
            </div>
          </div>

          {/* Environmental metrics grid */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
            <div className="bg-[#07111F] border border-white/[0.06] rounded-xl p-2">
              <p className="text-slate-400 text-[8px] font-bold">RAIN</p>
              <p className="text-white font-black mt-0.5">{selectedHotspot.rainfall}mm</p>
            </div>
            <div className="bg-[#07111F] border border-white/[0.06] rounded-xl p-2">
              <p className="text-slate-400 text-[8px] font-bold">MOIST</p>
              <p className="text-white font-black mt-0.5">{selectedHotspot.moisture}%</p>
            </div>
            <div className="bg-[#07111F] border border-white/[0.06] rounded-xl p-2">
              <p className="text-slate-400 text-[8px] font-bold">SLOPE</p>
              <p className="text-white font-black mt-0.5">{selectedHotspot.slope}°</p>
            </div>
            <div className="bg-[#07111F] border border-white/[0.06] rounded-xl p-2">
              <p className="text-slate-400 text-[8px] font-bold">TREND</p>
              <p className="text-rose-400 font-black mt-0.5">+{selectedHotspot.trend}%</p>
            </div>
          </div>

          {/* WHY Section (Requested in Section 5) */}
          <div className="bg-[#07111F]/90 border border-white/[0.06] p-2.5 rounded-xl text-[11px] text-slate-300">
            <p className="font-bold text-cyan-400 font-mono text-[10px] tracking-wider mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-cyan-400" /> WHY IS IT HIGH?
            </p>
            <ul className="space-y-0.5 text-slate-300 text-[10px]">
              {selectedHotspot.why.map((reason, idx) => (
                <li key={idx} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-cyan-400" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terrain3D;
