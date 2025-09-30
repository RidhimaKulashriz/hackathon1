import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { gsap } from 'gsap';

export async function initHeroScene(container: HTMLElement) {
  // Check if WebGL is supported
  if (!isWebGLAvailable()) {
    console.warn('WebGL not supported, skipping 3D scene');
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  
  // Create WebGL renderer with antialiasing
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);
  
  // Set color management
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  // Post-processing
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5, // strength
    0.4, // radius
    0.85 // threshold
  );
  
  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // Camera position
  camera.position.z = 15;
  camera.position.y = 2;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x00ff88, 1, 50);
  pointLight1.position.set(10, 10, 10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x00a1ff, 1, 50);
  pointLight2.position.set(-10, -10, -10);
  scene.add(pointLight2);

  // Create floating particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 5000;
  
  const posArray = new Float32Array(particleCount * 3);
  const scaleArray = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
    if (i % 3 === 0) {
      scaleArray[i / 3] = Math.random() * 0.5 + 0.1;
    }
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

  const particlesMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uSize: { value: 1 }
    },
    vertexShader: `
      uniform float uTime;
      uniform float uPixelRatio;
      uniform float uSize;
      attribute float aScale;
      
      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Create floating animation
        modelPosition.y += sin(uTime * 0.3 + modelPosition.x * 0.5) * 0.2;
        modelPosition.x += cos(uTime * 0.2 + modelPosition.y * 0.5) * 0.2;
        
        vec4 viewPosition = viewMatrix * modelPosition;
        gl_Position = projectionMatrix * viewPosition;
        
        // Size attenuation
        gl_PointSize = uSize * aScale * uPixelRatio * 100.0;
        gl_PointSize *= (1.0 / - viewPosition.z);
      }
    `,
    fragmentShader: `
      void main() {
        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
        float strength = 0.05 / distanceToCenter - 0.1;
        
        // Glow effect
        vec3 color1 = vec3(0.0, 1.0, 0.5);
        vec3 color2 = vec3(0.0, 0.6, 1.0);
        float mixValue = (sin(gl_PointCoord.x * 10.0) + 1.0) * 0.5;
        vec3 finalColor = mix(color1, color2, mixValue);
        
        gl_FragColor = vec4(finalColor, strength * 1.5);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Create floating shapes
  const shapes: THREE.Mesh[] = [];
  const shapeGeometry = new THREE.IcosahedronGeometry(1, 0);
  
  for (let i = 0; i < 5; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x00ff88 : 0x00a1ff,
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8
    });
    
    const shape = new THREE.Mesh(shapeGeometry, material);
    
    // Position shapes in a sphere
    const radius = 5 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    shape.position.x = radius * Math.sin(phi) * Math.cos(theta);
    shape.position.y = radius * Math.sin(phi) * Math.sin(theta);
    shape.position.z = radius * Math.cos(phi);
    
    shape.scale.setScalar(0.5 + Math.random() * 1.5);
    
    // Random rotation
    shape.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    
    // Add animation
    gsap.to(shape.rotation, {
      x: shape.rotation.x + Math.PI * 2,
      y: shape.rotation.y + Math.PI * 2,
      duration: 20 + Math.random() * 20,
      repeat: -1,
      ease: 'none'
    });
    
    scene.add(shape);
    shapes.push(shape);
  }

  // Mouse move interaction
  const mouse = new THREE.Vector2();
  const target = new THREE.Vector2();
  const windowHalf = new THREE.Vector2(
    window.innerWidth / 2,
    window.innerHeight / 2
  );

  // Handle window resize
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    composer.setSize(container.clientWidth, container.clientHeight);
  }

  // Handle mouse move
  function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // Animation loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    
    const elapsedTime = clock.getElapsedTime();
    
    // Update particles
    particles.rotation.y = elapsedTime * 0.1;
    (particles.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsedTime;
    
    // Smooth mouse movement
    target.x = mouse.x * 5;
    target.y = -mouse.y * 5;
    
    camera.position.x += (target.x - camera.position.x) * 0.05;
    camera.position.y += (target.y - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Update shapes
    shapes.forEach((shape, i) => {
      shape.position.y += Math.sin(elapsedTime * 0.5 + i) * 0.002;
      shape.position.x += Math.cos(elapsedTime * 0.3 + i) * 0.002;
    });
    
    // Render with post-processing
    composer.render();
  }

  // Add event listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  
  // Start animation
  animate();

  // Cleanup function
  return () => {
    window.removeEventListener('resize', onWindowResize);
    window.removeEventListener('mousemove', onMouseMove);
    container.removeChild(renderer.domElement);
    renderer.dispose();
  };
}

// Check WebGL support
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}
