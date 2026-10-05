import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getRiskColor, getRiskLevel } from '../../services/riskCalculator';

interface RiskGauge3DProps {
  score: number;
}

export const RiskGauge3D: React.FC<RiskGauge3DProps> = ({ score }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const level = getRiskLevel(score);
  const colorHex = getRiskColor(level);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const riskLight = new THREE.PointLight(new THREE.Color(colorHex), 5.5, 12);
    riskLight.position.set(0, 0, 3);
    scene.add(riskLight);

    const backRimLight = new THREE.DirectionalLight(0x06b6d4, 1.8);
    backRimLight.position.set(0, 4, -3);
    scene.add(backRimLight);

    // 3D Ring Gauge Group
    const ringGroup = new THREE.Group();

    // 1. Outer Inactive Rail
    const totalAngle = Math.PI * 1.5;
    const railGeom = new THREE.TorusGeometry(1.65, 0.07, 24, 80, totalAngle);
    railGeom.rotateZ(-Math.PI * 1.25);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.4,
    });
    const railMesh = new THREE.Mesh(railGeom, railMat);
    ringGroup.add(railMesh);

    // 2. Inner Track
    const innerTrackGeom = new THREE.TorusGeometry(1.48, 0.02, 16, 80, totalAngle);
    innerTrackGeom.rotateZ(-Math.PI * 1.25);
    const innerTrackMat = new THREE.MeshBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.4,
    });
    const innerTrack = new THREE.Mesh(innerTrackGeom, innerTrackMat);
    ringGroup.add(innerTrack);

    // 3. Active Glowing Gauge Arc
    const activeAngle = Math.max(0.05, (score / 100) * totalAngle);
    const activeGeom = new THREE.TorusGeometry(1.65, 0.11, 24, 80, activeAngle);
    activeGeom.rotateZ(-Math.PI * 1.25);
    const activeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colorHex),
      emissive: new THREE.Color(colorHex),
      emissiveIntensity: level === 'CRITICAL' ? 2.2 : 1.2,
      roughness: 0.2,
      metalness: 0.8,
    });
    const activeMesh = new THREE.Mesh(activeGeom, activeMat);
    ringGroup.add(activeMesh);

    // 4. Subtle atmospheric star dust / particles
    const particleCount = 70;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 5.0;
      particlePos[i + 1] = (Math.random() - 0.5) * 5.0;
      particlePos[i + 2] = (Math.random() - 0.5) * 2.5;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(colorHex),
      size: 0.04,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    scene.add(ringGroup);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle breathing rotation
      ringGroup.rotation.y = Math.sin(elapsedTime * 0.7) * 0.12;
      ringGroup.rotation.x = Math.cos(elapsedTime * 0.5) * 0.08;
      particles.rotation.z = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      railGeom.dispose();
      railMat.dispose();
      innerTrackGeom.dispose();
      innerTrackMat.dispose();
      activeGeom.dispose();
      activeMat.dispose();
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [score, colorHex, level]);

  return (
    <div className="relative w-full h-72 flex items-center justify-center select-none">
      <div ref={mountRef} className="absolute inset-0" />
      <div className="relative z-10 text-center pointer-events-none -mt-4">
        <div
          className="text-7xl font-black font-mono tracking-tight drop-shadow-[0_0_24px_rgba(239,68,68,0.6)]"
          style={{ color: colorHex }}
        >
          {score}
        </div>
        <div
          className="text-sm font-black font-heading uppercase tracking-widest mt-1"
          style={{ color: colorHex }}
        >
          {level} RISK
        </div>
        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
          SCALE: 0 – 100 HAZARD THRESHOLD
        </div>
      </div>
    </div>
  );
};

export default RiskGauge3D;
