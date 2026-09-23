import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

function TripHero({ tripData }) {
  const containerRef = useRef(null);

  useEffect(() => {
  const container = containerRef.current;
  const width = container.clientWidth;
  const height = container.clientHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
  camera.position.set(3.2, 1.4, 4.2);   // closer + lower = bigger, more "hero shot" angle
  camera.lookAt(0, 0.4, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;   // photographic contrast
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Three-point lighting instead of flat ambient+one light
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 3);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);

  const fill = new THREE.DirectionalLight(0xd4f22e, 0.5);   // accent-tinted fill
  fill.position.set(-4, 2, -2);

  const rim = new THREE.DirectionalLight(0xffffff, 0.8);    // rim light for edge definition
  rim.position.set(-2, 3, -5);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x888888, 0.6); // soft sky/ground fill
  scene.add(key, fill, rim, hemi);

  // Fake contact shadow: a soft radial-gradient circle under the truck
  const shadowTexture = new THREE.CanvasTexture(createShadowGradient());
  const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.01;
  scene.add(shadowMesh);

  let model;
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load('/models/truck.glb', (gltf) => {
    model = gltf.scene;
    model.traverse((node) => {
      if (node.isMesh) node.castShadow = true;
    });
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 3.8 / Math.max(size.x, size.y, size.z);  // slightly bigger than before
    model.scale.setScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    model.position.y = 0;
    model.rotation.y = 0.55;
    scene.add(model);
  });

  let animationId, t = 0;
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    t += 0.01;
    if (model) model.position.y = 0.02 + Math.sin(t) * 0.03;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    cancelAnimationFrame(animationId);
    renderer.dispose();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          Object.values(m).forEach((v) => v?.isTexture && v.dispose());
          m.dispose();
        });
      }
    });
    container.removeChild(renderer.domElement);
  };
}, []);

// Generates a soft radial gradient (dark center -> transparent edge) for the ground shadow
function createShadowGradient() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(0,0,0,0.35)');
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  return canvas;
}

  const distanceMi = tripData
    ? Math.round((tripData.leg1.distance_m + tripData.leg2.distance_m) / 1609.34)
    : null;
  const driveHrs = tripData
    ? ((tripData.leg1.duration_s + tripData.leg2.duration_s) / 3600).toFixed(1)
    : null;

  return (
    <div className="relative rounded-xl2 shadow-sm border border-line overflow-hidden h-[280px]"
     style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f0f0f2 100%)' }}>
      <div ref={containerRef} className="w-full h-full" />

      {tripData && (
        <>
          <StatCard className="top-5 left-5" label="Total distance" value={`${distanceMi} mi`} />
          <StatCard className="top-5 right-5" label="Drive time" value={`${driveHrs} hrs`} />
          <StatCard className="bottom-5 left-5" label="Cycle used" value={`${tripData.cycle_hours_used} hrs`} />
          <StatCard className="bottom-5 right-5" label="Total trip" value={`${tripData.total_trip_hours} hrs`} />
        </>
      )}
    </div>
  );
}

function StatCard({ className, label, value }) {
  return (
    <div className={`absolute bg-card/90 backdrop-blur-sm rounded-xl shadow-sm border border-line px-3 py-2 ${className}`}>
      <p className="text-[10px] text-muted uppercase tracking-wide">{label}</p>
      <p className="text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

export default TripHero;