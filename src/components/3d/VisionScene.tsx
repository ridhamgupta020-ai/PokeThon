import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface VisionSceneProps {
  className?: string;
}

export const VisionScene: React.FC<VisionSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const scene = new THREE.Scene();
      const width = container.clientWidth || 600;
      const height = container.clientHeight || 450;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
      camera.position.set(0, 0, 5.5);

      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      container.appendChild(canvas);

      // Lights
      const ambientLight = new THREE.AmbientLight(0x0b2342, 2.0);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0x168bff, 3.2);
      keyLight.position.set(3, 4, 3);
      scene.add(keyLight);

      const yellowRim = new THREE.DirectionalLight(0xffd83d, 2.8);
      yellowRim.position.set(-3, -2, -3);
      scene.add(yellowRim);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Central Diamond Prism
      const prismGeo = new THREE.OctahedronGeometry(0.85, 0);
      const prismMat = new THREE.MeshStandardMaterial({
        color: 0xffd83d,
        emissive: 0x473800,
        roughness: 0.1,
        metalness: 0.9,
      });
      const prism = new THREE.Mesh(prismGeo, prismMat);
      rootGroup.add(prism);

      // Outer Wireframe Crystal Lattice
      const outerLatticeGeo = new THREE.IcosahedronGeometry(1.2, 0);
      const outerLatticeMat = new THREE.MeshBasicMaterial({
        color: 0x168bff,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      const outerLattice = new THREE.Mesh(outerLatticeGeo, outerLatticeMat);
      rootGroup.add(outerLattice);

      // 4 Orbital Rings representing Innovation, Collaboration, Technology, and Problem-Solving
      const rings: THREE.Mesh[] = [];
      const ringGeos: THREE.TorusGeometry[] = [];
      const ringAngles = [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4];
      const ringColors = [0x168bff, 0xffd83d, 0x168bff, 0xffd83d];

      for (let i = 0; i < 4; i++) {
        const rGeo = new THREE.TorusGeometry(1.55 + i * 0.12, 0.025, 12, 48);
        ringGeos.push(rGeo);
        const rMat = new THREE.MeshStandardMaterial({
          color: ringColors[i],
          emissive: ringColors[i],
          emissiveIntensity: 0.35,
          roughness: 0.2,
          metalness: 0.8,
        });
        const ring = new THREE.Mesh(rGeo, rMat);
        ring.rotation.x = ringAngles[i];
        ring.rotation.y = (i * Math.PI) / 3;
        rootGroup.add(ring);
        rings.push(ring);
      }

      // Parallax Mouse tracking
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const handlePointerMove = (e: MouseEvent) => {
        if (prefersReducedMotion) return;
        const rect = container.getBoundingClientRect();
        mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });

      let animationFrameId: number;
      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 4, delta);
        mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 4, delta);

        if (!prefersReducedMotion) {
          prism.rotation.y += delta * 0.5;
          prism.rotation.z += delta * 0.3;
          outerLattice.rotation.y -= delta * 0.25;
          outerLattice.rotation.x += delta * 0.2;

          rings.forEach((ring, idx) => {
            const dir = idx % 2 === 0 ? 1 : -1;
            ring.rotation.z += delta * 0.4 * dir;
            ring.rotation.y += delta * 0.3 * dir;
          });

          rootGroup.rotation.y = mouse.x * 0.25;
          rootGroup.rotation.x = -mouse.y * 0.2;
          rootGroup.position.y = Math.sin(elapsed * 1.8) * 0.05;
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);

        prismGeo.dispose();
        prismMat.dispose();
        outerLatticeGeo.dispose();
        outerLatticeMat.dispose();
        ringGeos.forEach((g) => g.dispose());
      };
    } catch {
      setWebGLFailed(true);
    }
  }, []);

  if (webGLFailed) {
    return (
      <div className={`flex items-center justify-center p-8 bg-[#0B2342]/60 rounded-2xl border border-[#168BFF]/30 ${className}`}>
        <div className="w-24 h-24 rounded-full border-2 border-[#168BFF] flex items-center justify-center text-[#FFD83D] font-mono text-2xl font-black">
          ⚡
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[350px] overflow-hidden select-none ${className}`}
      aria-label="3D Vision Sculpture"
      role="img"
    />
  );
};
