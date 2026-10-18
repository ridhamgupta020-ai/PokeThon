import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface AboutHeroSceneProps {
  className?: string;
}

export const AboutHeroScene: React.FC<AboutHeroSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebGLFailed(true);
      return;
    }

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    try {
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x06152b, 0.035);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 0, 7.5);

      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;

      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      container.appendChild(canvas);

      // Lighting Rig
      const ambientLight = new THREE.AmbientLight(0x0b2342, 1.5);
      scene.add(ambientLight);

      const blueKey = new THREE.DirectionalLight(0x168bff, 3.5);
      blueKey.position.set(5, 4, 4);
      scene.add(blueKey);

      const yellowRim = new THREE.DirectionalLight(0xffd83d, 3.0);
      yellowRim.position.set(-5, -3, -4);
      scene.add(yellowRim);

      const overheadCyan = new THREE.PointLight(0x168bff, 2.5, 12);
      overheadCyan.position.set(0, 3, 2);
      scene.add(overheadCyan);

      // Main Innovation Symbol Group
      const innovationGroup = new THREE.Group();
      if (!isMobile) {
        innovationGroup.position.set(1.9, 0, 0);
      } else {
        innovationGroup.position.set(0, -0.3, 0);
      }
      scene.add(innovationGroup);

      // Dual Interlocking Energy Torus (Mobius-inspired innovation infinity loop)
      const torus1Geo = new THREE.TorusGeometry(1.6, 0.05, 16, 64);
      const torus1Mat = new THREE.MeshStandardMaterial({
        color: 0x168bff,
        emissive: 0x0c4b8e,
        roughness: 0.15,
        metalness: 0.9,
      });
      const torus1 = new THREE.Mesh(torus1Geo, torus1Mat);
      innovationGroup.add(torus1);

      const torus2Geo = new THREE.TorusGeometry(1.6, 0.05, 16, 64);
      const torus2Mat = new THREE.MeshStandardMaterial({
        color: 0xffd83d,
        emissive: 0x6e5200,
        roughness: 0.2,
        metalness: 0.85,
      });
      const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
      torus2.rotation.y = Math.PI / 2.2;
      innovationGroup.add(torus2);

      // Geodesic Wireframe Lattice Sphere
      const latticeGeo = new THREE.IcosahedronGeometry(1.1, 1);
      const latticeMat = new THREE.MeshBasicMaterial({
        color: 0x168bff,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const lattice = new THREE.Mesh(latticeGeo, latticeMat);
      innovationGroup.add(lattice);

      // Radiant Core Octahedron
      const coreGeo = new THREE.OctahedronGeometry(0.55, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffd83d,
        emissive: 0xffd83d,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.95,
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      innovationGroup.add(core);

      // Satellite Floating Geometric Objects (Tetrahedrons, Dodecahedrons, Prisms)
      const satellites: THREE.Mesh[] = [];
      const satCount = 5;
      const satGeos = [
        new THREE.TetrahedronGeometry(0.22),
        new THREE.OctahedronGeometry(0.2),
        new THREE.DodecahedronGeometry(0.2),
      ];

      for (let i = 0; i < satCount; i++) {
        const geo = satGeos[i % satGeos.length];
        const isYellow = i % 2 === 0;
        const mat = new THREE.MeshStandardMaterial({
          color: isYellow ? 0xffd83d : 0x168bff,
          emissive: isYellow ? 0x6e5200 : 0x0c4b8e,
          roughness: 0.25,
          metalness: 0.85,
          wireframe: i === 2,
        });
        const sat = new THREE.Mesh(geo, mat);
        const angle = (i / satCount) * Math.PI * 2;
        sat.position.set(Math.cos(angle) * 2.5, Math.sin(angle * 1.5) * 1.2, Math.sin(angle) * 1.8);
        innovationGroup.add(sat);
        satellites.push(sat);
      }

      // Background Energy Particles
      const particleCount = isMobile ? 50 : 120;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      const blueColor = new THREE.Color(0x168bff);
      const yellowColor = new THREE.Color(0xffd83d);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 12;
        positions[i3 + 1] = (Math.random() - 0.5) * 8;
        positions[i3 + 2] = (Math.random() - 0.5) * 8;

        velocities[i3] = (Math.random() - 0.5) * 0.005;
        velocities[i3 + 1] = Math.random() * 0.01 + 0.003;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.005;

        const c = Math.random() > 0.4 ? blueColor : yellowColor;
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particleMat = new THREE.PointsMaterial({
        size: isMobile ? 0.08 : 0.1,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      // Mouse Parallax
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const handlePointerMove = (e: MouseEvent) => {
        if (prefersReducedMotion) return;
        const rect = container.getBoundingClientRect();
        mouse.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouse.targetY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 4, delta);
        mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 4, delta);

        if (!prefersReducedMotion) {
          // Rotate interlocking tori
          torus1.rotation.x += delta * 0.4;
          torus1.rotation.y += delta * 0.3;

          torus2.rotation.y -= delta * 0.45;
          torus2.rotation.z += delta * 0.25;

          lattice.rotation.y += delta * 0.15;
          core.rotation.x += delta * 0.6;
          core.rotation.y += delta * 0.5;

          // Bobbing motion
          innovationGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.07;

          // Satellites orbiting
          satellites.forEach((sat, i) => {
            const angle = (i / satCount) * Math.PI * 2 + elapsedTime * 0.4;
            sat.position.x = Math.cos(angle) * (2.2 + (i % 2) * 0.4);
            sat.position.y = Math.sin(angle * 1.4) * 1.1;
            sat.position.z = Math.sin(angle) * (1.8 + (i % 2) * 0.3);
            sat.rotation.x += delta * 0.8;
            sat.rotation.y += delta * 0.6;
          });

          // Parallax tilt
          innovationGroup.rotation.y = mouse.x * 0.22;
          innovationGroup.rotation.x = -mouse.y * 0.16;

          // Particles rising
          const pos = particleGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            pos[i3] += velocities[i3];
            pos[i3 + 1] += velocities[i3 + 1];
            pos[i3 + 2] += velocities[i3 + 2];
            if (pos[i3 + 1] > 4.5) {
              pos[i3 + 1] = -3.5;
              pos[i3] = (Math.random() - 0.5) * 12;
            }
          }
          particleGeo.attributes.position.needsUpdate = true;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));

        if (window.innerWidth < 768) {
          innovationGroup.position.set(0, -0.3, 0);
          camera.position.z = 8.5;
        } else {
          innovationGroup.position.set(1.9, 0, 0);
          camera.position.z = 7.5;
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);

        if (renderer) {
          renderer.dispose();
          if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
          }
        }

        torus1Geo.dispose();
        torus1Mat.dispose();
        torus2Geo.dispose();
        torus2Mat.dispose();
        latticeGeo.dispose();
        latticeMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        satGeos.forEach((g) => g.dispose());
        particleGeo.dispose();
        particleMat.dispose();
      };
    } catch (err) {
      console.warn('AboutHeroScene WebGL error:', err);
      setWebGLFailed(true);
    }
  }, []);

  if (webGLFailed) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[#06152B] bg-radial-glow pointer-events-none" />
        <div className="relative p-6 max-w-sm mx-auto text-center">
          <div className="w-36 h-36 mx-auto mb-4 rounded-full border-2 border-[#168BFF]/40 bg-[#0B2342] flex items-center justify-center shadow-[0_0_30px_rgba(22,139,255,0.3)]">
            <div className="w-20 h-20 rounded-full border-2 border-[#FFD83D] flex items-center justify-center text-[#FFD83D] text-3xl font-black">
              ⚡
            </div>
          </div>
          <div className="text-xs font-mono text-[#168BFF] uppercase tracking-wider">
            Abstract Innovation Nexus
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto ${className}`}
      aria-label="Abstract 3D Innovation Scene"
      role="img"
    />
  );
};
