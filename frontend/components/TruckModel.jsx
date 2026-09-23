import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

function TruckModel() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(3, 1.8, 4);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting — flat, soft, matches the card-based UI rather than a dramatic render
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(3, 5, 2);
    scene.add(ambient, dirLight);

    let model;
    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load('/models/truck.glb', (gltf) => {
      model = gltf.scene;

      // Auto-fit and center the model regardless of its original scale/origin
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2.2 / maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));

      scene.add(model);
    });

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (model) model.rotation.y += 0.006; // slow idle spin
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup — Three.js scenes leak GPU memory if you don't dispose explicitly
    return () => {
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => {
            Object.values(m).forEach((v) => v?.isTexture && v.dispose());
            m.dispose();
          });
        }
      });
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="w-32 h-32" />;
}

export default TruckModel;