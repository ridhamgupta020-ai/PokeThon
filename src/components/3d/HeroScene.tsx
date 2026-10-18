import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface HeroSceneProps {
  className?: string;
}

export const HeroScene: React.FC<HeroSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
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

    // Respect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    try {
      // 1. Scene & Fog Setup
      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x06152b, 0.035);

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 2. Camera Setup
      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
      camera.position.set(0, 0.3, 7.2);

      // 3. Renderer Setup
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
      renderer.setSize(width, height);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      // Ensure canvas is properly styled
      const canvas = renderer.domElement;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      container.appendChild(canvas);

      // 4. Lighting Rig
      const ambientLight = new THREE.AmbientLight(0x0b2342, 1.4);
      scene.add(ambientLight);

      // Electric Blue Key Light
      const blueLight = new THREE.DirectionalLight(0x168bff, 3.2);
      blueLight.position.set(4, 5, 4);
      scene.add(blueLight);

      // Pikachu Yellow Rim Light
      const yellowLight = new THREE.DirectionalLight(0xffd83d, 2.8);
      yellowLight.position.set(-4, -2, -3);
      scene.add(yellowLight);

      // Subtle overhead spotlight on the centerpiece
      const spotLight = new THREE.SpotLight(0x168bff, 4.0, 15, Math.PI / 4, 0.4);
      spotLight.position.set(1.5, 6, 3);
      scene.add(spotLight);

      // 5. Main Hero 3D Centerpiece Group
      const heroGroup = new THREE.Group();
      // Position slightly right of center on desktop to complement left-side typography
      if (!isMobile) {
        heroGroup.position.set(1.8, -0.1, 0);
      } else {
        heroGroup.position.set(0, -0.4, 0);
      }
      scene.add(heroGroup);

      // A. Ground Illuminated Platform
      const platformGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.25, 8);
      const platformMat = new THREE.MeshStandardMaterial({
        color: 0x0b2342,
        roughness: 0.3,
        metalness: 0.85,
        wireframe: false,
      });
      const platform = new THREE.Mesh(platformGeo, platformMat);
      platform.position.y = -1.8;
      heroGroup.add(platform);

      // Platform Glowing Hex Rim
      const rimGeo = new THREE.RingGeometry(2.35, 2.45, 8);
      const rimMat = new THREE.MeshBasicMaterial({
        color: 0x168bff,
        side: THREE.DoubleSide,
      });
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.rotation.x = -Math.PI / 2;
      rim.position.y = -1.67;
      heroGroup.add(rim);

      // Inner Platform Energy Accent Ring
      const innerRingGeo = new THREE.RingGeometry(1.4, 1.48, 8);
      const innerRingMat = new THREE.MeshBasicMaterial({
        color: 0xffd83d,
        side: THREE.DoubleSide,
      });
      const innerRim = new THREE.Mesh(innerRingGeo, innerRingMat);
      innerRim.rotation.x = -Math.PI / 2;
      innerRim.position.y = -1.66;
      heroGroup.add(innerRim);

      // B. Floating Energy Nexus (Centerpiece)
      const nexusGroup = new THREE.Group();
      nexusGroup.position.y = 0.2;
      heroGroup.add(nexusGroup);

      // Outer Gimbal Ring 1 (Electric Blue)
      const ring1Geo = new THREE.TorusGeometry(1.9, 0.035, 16, 64);
      const ring1Mat = new THREE.MeshStandardMaterial({
        color: 0x168bff,
        emissive: 0x094182,
        roughness: 0.2,
        metalness: 0.9,
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      nexusGroup.add(ring1);

      // Mid Gimbal Ring 2 (Pikachu Yellow)
      const ring2Geo = new THREE.TorusGeometry(1.6, 0.04, 16, 64);
      const ring2Mat = new THREE.MeshStandardMaterial({
        color: 0xffd83d,
        emissive: 0x544302,
        roughness: 0.25,
        metalness: 0.85,
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI / 3;
      nexusGroup.add(ring2);

      // Inner Gimbal Ring 3 (Deep Midnight & Blue accents)
      const ring3Geo = new THREE.TorusGeometry(1.3, 0.03, 16, 48);
      const ring3Mat = new THREE.MeshStandardMaterial({
        color: 0x168bff,
        emissive: 0x168bff,
        emissiveIntensity: 0.3,
        roughness: 0.4,
        metalness: 0.7,
      });
      const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
      ring3.rotation.y = Math.PI / 4;
      nexusGroup.add(ring3);

      // Geometric Icosahedron Frame (Cyber Cage)
      const cageGeo = new THREE.IcosahedronGeometry(1.05, 1);
      const cageMat = new THREE.MeshBasicMaterial({
        color: 0x168bff,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      });
      const cage = new THREE.Mesh(cageGeo, cageMat);
      nexusGroup.add(cage);

      // Glowing Center Sphere
      const coreGeo = new THREE.SphereGeometry(0.5, 32, 32);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xffd83d,
        emissive: 0xffd83d,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.9,
      });
      const coreSphere = new THREE.Mesh(coreGeo, coreMat);
      nexusGroup.add(coreSphere);

      // C. Central Holographic Emblem with Authentic PokeThon Rai-Volt Artwork
      // Load texture with correct aspect ratio and SRGB space
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        '/src/assets/images/pokethon_mascot_artwork_1792351096843.jpg',
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.generateMipmaps = true;

          // Circular hologram disc
          const discGeo = new THREE.CircleGeometry(0.82, 32);
          const discMat = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95,
          });
          const hologramDisc = new THREE.Mesh(discGeo, discMat);
          hologramDisc.position.z = 0.05;
          nexusGroup.add(hologramDisc);

          // Golden border ring around mascot emblem
          const borderGeo = new THREE.RingGeometry(0.81, 0.86, 32);
          const borderMat = new THREE.MeshBasicMaterial({
            color: 0xffd83d,
            side: THREE.DoubleSide,
          });
          const borderRing = new THREE.Mesh(borderGeo, borderMat);
          borderRing.position.z = 0.06;
          nexusGroup.add(borderRing);
        },
        undefined,
        () => {
          // Fallback if texture fails: core sphere remains gorgeous
        }
      );

      // 6. Floating Ambient Particles (Yellow and Blue glowing energy sparks)
      const particleCount = isMobile ? 60 : 150;
      const particleGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const velocities = new Float32Array(particleCount * 3);

      const colorBlue = new THREE.Color(0x168bff);
      const colorYellow = new THREE.Color(0xffd83d);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Spread particles around the scene
        positions[i3] = (Math.random() - 0.5) * 12;
        positions[i3 + 1] = (Math.random() - 0.5) * 8;
        positions[i3 + 2] = (Math.random() - 0.5) * 8;

        // Velocities for gentle upward/orbital drift
        velocities[i3] = (Math.random() - 0.5) * 0.006;
        velocities[i3 + 1] = Math.random() * 0.012 + 0.004;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.006;

        // Randomly assign Electric Blue or Pikachu Yellow
        const chosenColor = Math.random() > 0.4 ? colorBlue : colorYellow;
        colors[i3] = chosenColor.r;
        colors[i3 + 1] = chosenColor.g;
        colors[i3 + 2] = chosenColor.b;
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Create a soft glowing circular particle texture procedurally
      const particleCanvas = document.createElement('canvas');
      particleCanvas.width = 32;
      particleCanvas.height = 32;
      const ctx = particleCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      const particleTexture = new THREE.CanvasTexture(particleCanvas);

      const particleMat = new THREE.PointsMaterial({
        size: isMobile ? 0.08 : 0.12,
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // 7. Mouse Pointer Parallax with Exponential Damping
      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
      const handlePointerMove = (e: MouseEvent) => {
        if (prefersReducedMotion) return;
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;
        mouse.targetX = (clientX / rect.width - 0.5) * 2;
        mouse.targetY = -(clientY / rect.height - 0.5) * 2;
      };

      window.addEventListener('mousemove', handlePointerMove, { passive: true });

      // 8. Animation & Render Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse damping
        mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 4, delta);
        mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 4, delta);

        if (!prefersReducedMotion) {
          // Centerpiece energy ring rotations
          ring1.rotation.x += delta * 0.45;
          ring1.rotation.y += delta * 0.3;

          ring2.rotation.y -= delta * 0.55;
          ring2.rotation.z += delta * 0.35;

          ring3.rotation.x -= delta * 0.35;
          ring3.rotation.z -= delta * 0.45;

          cage.rotation.y += delta * 0.2;
          cage.rotation.x += delta * 0.1;

          // Floating bobbing motion on nexus
          nexusGroup.position.y = 0.2 + Math.sin(elapsedTime * 1.6) * 0.08;

          // Core energy pulse
          const pulse = 0.5 + Math.sin(elapsedTime * 3.5) * 0.15;
          coreSphere.scale.set(1 + pulse * 0.1, 1 + pulse * 0.1, 1 + pulse * 0.1);

          // Subtle parallax response on hero group
          heroGroup.rotation.y = mouse.x * 0.25;
          heroGroup.rotation.x = -mouse.y * 0.18;

          // Particle animation
          const posAttr = particleGeo.attributes.position;
          const posArray = posAttr.array as Float32Array;

          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            posArray[i3] += velocities[i3];
            posArray[i3 + 1] += velocities[i3 + 1];
            posArray[i3 + 2] += velocities[i3 + 2];

            // Wrap particles smoothly if they rise too high
            if (posArray[i3 + 1] > 4.5) {
              posArray[i3 + 1] = -3.5;
              posArray[i3] = (Math.random() - 0.5) * 12;
            }
          }
          posAttr.needsUpdate = true;
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera);
        }
      };

      animate();

      // 9. Resize Handling
      const handleResize = () => {
        if (!container || !renderer || !camera) return;
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;

        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(newWidth, newHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));

        // Adjust hero position on resize
        if (window.innerWidth < 768) {
          heroGroup.position.set(0, -0.4, 0);
          camera.position.z = 8.5;
        } else {
          heroGroup.position.set(1.8, -0.1, 0);
          camera.position.z = 7.2;
        }
      };

      window.addEventListener('resize', handleResize);

      // 10. Clean Cleanup on Unmount
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

        // Dispose geometries and materials
        platformGeo.dispose();
        platformMat.dispose();
        rimGeo.dispose();
        rimMat.dispose();
        innerRingGeo.dispose();
        innerRingMat.dispose();
        ring1Geo.dispose();
        ring1Mat.dispose();
        ring2Geo.dispose();
        ring2Mat.dispose();
        ring3Geo.dispose();
        ring3Mat.dispose();
        cageGeo.dispose();
        cageMat.dispose();
        coreGeo.dispose();
        coreMat.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        particleTexture.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization caught error, switching to high-fidelity fallback:', err);
      setWebGLFailed(true);
    }
  }, []);

  // WebGL Fallback View (Safe, resilient, aesthetically matched)
  if (webGLFailed) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-[#06152B] bg-radial-glow pointer-events-none" />
        <div className="relative p-6 max-w-sm mx-auto text-center">
          <div className="relative w-48 h-48 mx-auto mb-4 rounded-2xl p-1 bg-gradient-to-tr from-[#168BFF] via-[#FFD83D] to-[#168BFF] shadow-[0_0_35px_rgba(22,139,255,0.4)]">
            <img
              src="/src/assets/images/pokethon_mascot_artwork_1792351096843.jpg"
              alt="PokeThon Mascot Emblem"
              className="w-full h-full object-cover rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-xs font-mono text-[#FFD83D] tracking-wider uppercase">
            PokeThon 2026 Centerpiece
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none pointer-events-auto ${className}`}
      aria-label="Interactive 3D PokeThon Innovation Centerpiece"
      role="img"
    />
  );
};
