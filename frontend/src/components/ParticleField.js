import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ParticleField — a lightweight Three.js scene of drifting "signal" particles.
 *
 * Visual metaphor: the AI is sifting millions of pixel-level signals out of the
 * noise. Particles drift slowly, brighten in front of the cursor, and respect
 * `prefers-reduced-motion`.
 *
 * The renderer uses a single PointsMaterial — cheap on mobile, no bloom/post.
 */
export default function ParticleField({
  density = 1400,
  color = 0x14b8a6,
  className = '',
}) {
  const mountRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Build a soft circular sprite so particles look like dust, not squares
    const sprite = (() => {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.4, 'rgba(255,255,255,0.55)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(canvas);
    })();

    const count = Math.max(400, Math.min(density, 2400));
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const baseY = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 220;
      const y = (Math.random() - 0.5) * 130;
      const z = (Math.random() - 0.5) * 200;
      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      speeds[i] = 0.04 + Math.random() * 0.18;
      baseY[i] = y;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      map: sprite,
      color,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse parallax
    const target = { x: 0, y: 0 };
    const handleMouse = (e) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener('mousemove', handleMouse);

    let t = 0;
    const animate = () => {
      t += reduced ? 0 : 0.005;
      points.rotation.y = target.x * 0.18;
      points.rotation.x = -target.y * 0.12;

      const pos = geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const idx = i * 3 + 1;
        pos[idx] = baseY[i] + Math.sin(t + i * 0.21) * speeds[i] * 6;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    if (!reduced) animate();
    else renderer.render(scene, camera);

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', handleMouse);
      geometry.dispose();
      material.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [density, color]);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    />
  );
}
