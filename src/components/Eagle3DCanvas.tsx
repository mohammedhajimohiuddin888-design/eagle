/**
 * Eagle3DCanvas.tsx
 * High-performance, photorealistic 3D Golden Eagle simulation built with Three.js.
 * Features hierarchical articulated wing skeleton, PBR plumage shaders,
 * cinematic multi-phase flight timeline, and smooth camera tracking.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../utils/audio';

export type FlightPhase = 1 | 2 | 3 | 4 | 5;

interface Eagle3DCanvasProps {
  currentPhase: FlightPhase;
  onPhaseChange?: (phase: FlightPhase) => void;
  isAutoPlay?: boolean;
  className?: string;
}

export const Eagle3DCanvas: React.FC<Eagle3DCanvasProps> = ({
  currentPhase,
  onPhaseChange,
  isAutoPlay = true,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [isFreeOrbit, setIsFreeOrbit] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [fps, setFps] = useState(60);

  // Mutable refs for animation loop
  const stateRef = useRef({
    phase: currentPhase,
    targetPhase: currentPhase,
    phaseProgress: 0,
    time: 0,
    lastTime: performance.now(),
    isAutoPlay,
    wireframe,
    isFreeOrbit,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    orbitTheta: 0,
    orbitPhi: Math.PI / 2,
    orbitRadius: 10,
  });

  useEffect(() => {
    stateRef.current.targetPhase = currentPhase;
  }, [currentPhase]);

  useEffect(() => {
    stateRef.current.isAutoPlay = isAutoPlay;
  }, [isAutoPlay]);

  useEffect(() => {
    stateRef.current.wireframe = wireframe;
  }, [wireframe]);

  useEffect(() => {
    stateRef.current.isFreeOrbit = isFreeOrbit;
  }, [isFreeOrbit]);

  const toggleSound = useCallback(() => {
    const active = soundEngine.toggleWind();
    setAudioActive(active);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL renderer
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene & Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xE0ECF8, 0.012);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 500);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Lighting Setup (Cinematic daylight key + warm rim + cool sky fill)
    const sunLight = new THREE.DirectionalLight(0xFFF6E8, 2.8);
    sunLight.position.set(15, 25, 18);
    sunLight.castShadow = !isSoftwareGl;
    if (sunLight.castShadow) {
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
      const d = 12;
      sunLight.shadow.camera.left = -d;
      sunLight.shadow.camera.right = d;
      sunLight.shadow.camera.top = d;
      sunLight.shadow.camera.bottom = -d;
    }
    scene.add(sunLight);

    // Golden rim light to illuminate wingtips & feathers
    const rimLight = new THREE.DirectionalLight(0xE5B869, 1.9);
    rimLight.position.set(-18, 12, -15);
    scene.add(rimLight);

    // Sky/Ground bounce hemisphere light
    const hemiLight = new THREE.HemisphereLight(0xD8EAF8, 0x8C7B6A, 1.2);
    scene.add(hemiLight);

    // Subtle soft fill light
    const fillLight = new THREE.DirectionalLight(0xB4D0E8, 0.9);
    fillLight.position.set(0, -10, 10);
    scene.add(fillLight);

    // 3. Procedural Sky Dome & Volumetric Cloud Strata
    const createSkyDome = () => {
      const skyGeo = new THREE.SphereGeometry(250, 32, 24);
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: new THREE.Color(0x9DC2E6) }, // Clear high altitude azure
          midColor: { value: new THREE.Color(0xD9E7F4) }, // Atmospheric haze
          bottomColor: { value: new THREE.Color(0xF5EBDC) }, // Golden warm horizon
          sunPosition: { value: new THREE.Vector3(15, 25, 18).normalize() },
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 midColor;
          uniform vec3 bottomColor;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition).y;
            vec3 sky = mix(midColor, topColor, max(pow(max(h, 0.0), 0.7), 0.0));
            sky = mix(bottomColor, sky, max(pow(max(h + 0.15, 0.0), 0.5), 0.0));
            gl_FragColor = vec4(sky, 1.0);
          }
        `,
      });
      const sky = new THREE.Mesh(skyGeo, skyMat);
      scene.add(sky);
      return sky;
    };
    createSkyDome();

    // Subtle high-altitude clouds floating below
    const createCloudStrata = () => {
      const cloudGroup = new THREE.Group();
      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = 256;
      cloudCanvas.height = 256;
      const ctx = cloudCanvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      grad.addColorStop(0.5, 'rgba(240, 245, 255, 0.35)');
      grad.addColorStop(1, 'rgba(230, 238, 250, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const cloudTex = new THREE.CanvasTexture(cloudCanvas);
      cloudTex.colorSpace = THREE.SRGBColorSpace;

      const cloudMat = new THREE.MeshBasicMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });

      for (let i = 0; i < 28; i++) {
        const size = 18 + Math.random() * 22;
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(size, size), cloudMat);
        plane.position.set(
          (Math.random() - 0.5) * 160,
          -12 - Math.random() * 15,
          (Math.random() - 0.5) * 160 - 20
        );
        plane.rotation.x = -Math.PI / 2 + (Math.random() - 0.5) * 0.1;
        plane.rotation.z = Math.random() * Math.PI * 2;
        cloudGroup.add(plane);
      }
      scene.add(cloudGroup);
      return cloudGroup;
    };
    const clouds = createCloudStrata();

    // 4. Procedural Texture Generators for Eagle Feathers
    const generatePlumageTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Deep chocolate brown background
      ctx.fillStyle = '#2B1E16';
      ctx.fillRect(0, 0, 512, 512);

      // Layered feather barbules with golden-ochre tips
      for (let y = 0; y < 512; y += 8) {
        for (let x = 0; x < 512; x += 12) {
          const shift = (Math.sin(y * 0.05 + x * 0.02) * 6);
          const goldIntensity = Math.sin((x + y) * 0.02) * 0.5 + 0.5;

          ctx.beginPath();
          ctx.ellipse(x + shift, y, 9, 4, 0.2, 0, Math.PI * 2);

          const r = Math.floor(45 + goldIntensity * 120);
          const g = Math.floor(30 + goldIntensity * 90);
          const b = Math.floor(20 + goldIntensity * 30);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fill();

          // Central quill highlight
          ctx.strokeStyle = `rgba(210, 160, 80, 0.35)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x + shift - 6, y);
          ctx.lineTo(x + shift + 6, y);
          ctx.stroke();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    };

    const plumageTex = generatePlumageTexture();

    // Golden nape feather texture
    const generateGoldenNapeTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#C8963E';
      ctx.fillRect(0, 0, 256, 256);

      for (let i = 0; i < 600; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const len = 6 + Math.random() * 14;
        ctx.strokeStyle = Math.random() > 0.4 ? '#E8BA60' : '#8A5A1E';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (Math.random() - 0.5) * 4, y + len);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const goldenNapeTex = generateGoldenNapeTexture();

    // 5. Materials
    const bodyMat = new THREE.MeshStandardMaterial({
      map: plumageTex,
      roughness: 0.65,
      metalness: 0.12,
      bumpMap: plumageTex,
      bumpScale: 0.04,
    });

    const goldenNapeMat = new THREE.MeshStandardMaterial({
      map: goldenNapeTex,
      roughness: 0.45,
      metalness: 0.22,
      bumpMap: goldenNapeTex,
      bumpScale: 0.06,
    });

    const flightFeatherMat = new THREE.MeshStandardMaterial({
      map: plumageTex,
      roughness: 0.55,
      metalness: 0.15,
      side: THREE.DoubleSide,
    });

    const beakMat = new THREE.MeshStandardMaterial({
      color: 0xEDB842,
      roughness: 0.25,
      metalness: 0.05,
    });

    const beakTipMat = new THREE.MeshStandardMaterial({
      color: 0x221E1B,
      roughness: 0.3,
      metalness: 0.1,
    });

    const eyeIrisMat = new THREE.MeshStandardMaterial({
      color: 0xDDA020,
      roughness: 0.1,
      metalness: 0.3,
    });

    const eyePupilMat = new THREE.MeshBasicMaterial({
      color: 0x050505,
    });

    const eyeCorneaMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.0,
      transmission: 0.9,
      ior: 1.4,
      transparent: true,
      opacity: 0.8,
    });

    const talonMat = new THREE.MeshStandardMaterial({
      color: 0xF2BA36,
      roughness: 0.4,
      metalness: 0.1,
    });

    const clawMat = new THREE.MeshStandardMaterial({
      color: 0x1A1817,
      roughness: 0.2,
      metalness: 0.2,
    });

    // 6. BUILD HIGH-FIDELITY RIGGED EAGLE MODEL
    const eagleRoot = new THREE.Group();

    // --- Body / Torso ---
    const bodyGroup = new THREE.Group();
    // Aerodynamic tapered torso
    const bodyGeo = new THREE.SphereGeometry(1.0, 24, 20);
    bodyGeo.scale(0.85, 0.75, 1.8);
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    bodyGroup.add(bodyMesh);

    // Chest Keel / Breast
    const breastGeo = new THREE.SphereGeometry(0.75, 18, 16);
    breastGeo.scale(0.8, 0.9, 1.1);
    breastGeo.translate(0, -0.2, 0.4);
    const breastMesh = new THREE.Mesh(breastGeo, bodyMat);
    breastMesh.castShadow = true;
    bodyGroup.add(breastMesh);

    // --- Neck & Head ---
    const neckHeadGroup = new THREE.Group();
    neckHeadGroup.position.set(0, 0.28, 1.2);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.42, 0.6, 0.8, 18);
    neckGeo.rotateX(Math.PI / 4.5);
    const neckMesh = new THREE.Mesh(neckGeo, goldenNapeMat);
    neckMesh.castShadow = true;
    neckHeadGroup.add(neckMesh);

    // Head Skull
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.45, 0.5);

    const skullGeo = new THREE.SphereGeometry(0.46, 20, 18);
    skullGeo.scale(0.82, 0.9, 1.1);
    const skullMesh = new THREE.Mesh(skullGeo, goldenNapeMat);
    skullMesh.castShadow = true;
    headGroup.add(skullMesh);

    // Brow ridges (intense raptor expression)
    const browGeo = new THREE.BoxGeometry(0.72, 0.14, 0.45);
    browGeo.translate(0, 0.22, 0.15);
    const browMesh = new THREE.Mesh(browGeo, goldenNapeMat);
    headGroup.add(browMesh);

    // Hooked Beak
    const beakBaseGeo = new THREE.ConeGeometry(0.24, 0.65, 16);
    beakBaseGeo.rotateX(Math.PI / 2.3);
    beakBaseGeo.translate(0, -0.06, 0.5);
    const beakBaseMesh = new THREE.Mesh(beakBaseGeo, beakMat);
    headGroup.add(beakBaseMesh);

    // Curved Sharp Beak Tip
    const beakHookGeo = new THREE.ConeGeometry(0.14, 0.4, 14);
    beakHookGeo.rotateX(Math.PI / 1.6);
    beakHookGeo.translate(0, -0.22, 0.72);
    const beakHookMesh = new THREE.Mesh(beakHookGeo, beakTipMat);
    headGroup.add(beakHookMesh);

    // Nostril cere
    const cereGeo = new THREE.BoxGeometry(0.36, 0.12, 0.22);
    cereGeo.translate(0, 0.1, 0.42);
    const cereMesh = new THREE.Mesh(cereGeo, beakMat);
    headGroup.add(cereMesh);

    // Keen Eyes (Left & Right)
    const createEye = (xSign: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xSign * 0.32, 0.1, 0.25);

      const irisMesh = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), eyeIrisMat);
      irisMesh.scale.set(0.6, 1, 1);
      const pupilMesh = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 10), eyePupilMat);
      pupilMesh.position.set(xSign * 0.04, 0, 0.07);
      const corneaMesh = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 12), eyeCorneaMat);

      eyeGroup.add(irisMesh);
      eyeGroup.add(pupilMesh);
      eyeGroup.add(corneaMesh);
      return eyeGroup;
    };
    headGroup.add(createEye(1));
    headGroup.add(createEye(-1));

    neckHeadGroup.add(headGroup);
    bodyGroup.add(neckHeadGroup);

    // --- Tail & Rectrices ---
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0, 0.1, -1.6);

    // Fan of tail feathers
    const tailFeatherCount = 9;
    for (let i = 0; i < tailFeatherCount; i++) {
      const t = (i / (tailFeatherCount - 1)) - 0.5; // -0.5 to 0.5
      const featherGeo = new THREE.BoxGeometry(0.24, 0.03, 1.4);
      featherGeo.translate(0, 0, -0.65);
      const featherMesh = new THREE.Mesh(featherGeo, flightFeatherMat);
      featherMesh.rotation.y = t * 0.5;
      featherMesh.rotation.x = -0.15 + Math.abs(t) * 0.08;
      featherMesh.castShadow = true;
      tailGroup.add(featherMesh);
    }
    bodyGroup.add(tailGroup);

    // --- Tucked Aerodynamic Talons ---
    const createLeg = (xSign: number) => {
      const legGroup = new THREE.Group();
      legGroup.position.set(xSign * 0.35, -0.45, -0.2);

      // Thigh plumage
      const thighGeo = new THREE.CylinderGeometry(0.22, 0.14, 0.6, 12);
      thighGeo.rotateX(Math.PI / 3);
      const thighMesh = new THREE.Mesh(thighGeo, bodyMat);
      legGroup.add(thighMesh);

      // Tucked yellow tarsus
      const tarsusGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.5, 10);
      tarsusGeo.rotateX(Math.PI / 2.2);
      tarsusGeo.translate(0, -0.18, -0.2);
      const tarsusMesh = new THREE.Mesh(tarsusGeo, talonMat);
      legGroup.add(tarsusMesh);

      // Curved black talons
      for (let c = -1; c <= 1; c++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.22, 8), clawMat);
        claw.position.set(c * 0.07, -0.28, -0.4);
        claw.rotation.x = Math.PI / 1.5;
        legGroup.add(claw);
      }
      return legGroup;
    };
    bodyGroup.add(createLeg(1));
    bodyGroup.add(createLeg(-1));

    // --- ARTICULATED SKELETAL WINGS (Left & Right) ---
    interface WingRig {
      shoulder: THREE.Group;
      elbow: THREE.Group;
      wrist: THREE.Group;
      primaryFeathers: THREE.Mesh[];
      secondaryFeathers: THREE.Mesh[];
    }

    const createWing = (xSign: number): WingRig => {
      const shoulder = new THREE.Group();
      shoulder.position.set(xSign * 0.65, 0.22, 0.3);

      // Humerus (Inner wing bone)
      const humerusGeo = new THREE.CylinderGeometry(0.24, 0.2, 1.6, 12);
      humerusGeo.rotateZ(xSign * Math.PI / 2);
      humerusGeo.translate(xSign * 0.8, 0, 0);
      const humerusMesh = new THREE.Mesh(humerusGeo, bodyMat);
      humerusMesh.castShadow = true;
      shoulder.add(humerusMesh);

      // Elbow joint
      const elbow = new THREE.Group();
      elbow.position.set(xSign * 1.6, 0, 0);

      // Radius / Forearm
      const forearmGeo = new THREE.CylinderGeometry(0.18, 0.15, 1.8, 12);
      forearmGeo.rotateZ(xSign * Math.PI / 2);
      forearmGeo.translate(xSign * 0.9, 0, 0.05);
      const forearmMesh = new THREE.Mesh(forearmGeo, bodyMat);
      forearmMesh.castShadow = true;
      elbow.add(forearmMesh);

      // Secondary flight feathers attached to forearm
      const secondaryFeathers: THREE.Mesh[] = [];
      const secCount = 8;
      for (let i = 0; i < secCount; i++) {
        const spanOffset = (i / secCount) * 1.6;
        const featherGeo = new THREE.BoxGeometry(0.26, 0.02, 1.35);
        featherGeo.translate(0, 0, -0.6);
        const feather = new THREE.Mesh(featherGeo, flightFeatherMat);
        feather.position.set(xSign * spanOffset, -0.04, 0.05);
        feather.rotation.y = xSign * 0.08;
        feather.rotation.z = -xSign * 0.05;
        feather.castShadow = true;
        elbow.add(feather);
        secondaryFeathers.push(feather);
      }

      // Wrist joint
      const wrist = new THREE.Group();
      wrist.position.set(xSign * 1.8, 0, 0.08);

      // Hand bone / Metacarpus
      const handGeo = new THREE.CylinderGeometry(0.13, 0.09, 1.2, 10);
      handGeo.rotateZ(xSign * Math.PI / 2);
      handGeo.translate(xSign * 0.6, 0, 0);
      const handMesh = new THREE.Mesh(handGeo, bodyMat);
      wrist.add(handMesh);

      // Primary flight feathers (long outer quills with individual spread/slotting)
      const primaryFeathers: THREE.Mesh[] = [];
      const primCount = 9;
      for (let i = 0; i < primCount; i++) {
        const t = i / (primCount - 1);
        const featherLength = 1.6 + (1 - Math.abs(t - 0.35)) * 0.8;
        const featherGeo = new THREE.BoxGeometry(0.24, 0.02, featherLength);
        featherGeo.translate(0, 0, -featherLength * 0.48);

        const feather = new THREE.Mesh(featherGeo, flightFeatherMat);
        // Position along hand
        feather.position.set(xSign * (0.2 + t * 1.3), -0.02, 0.0);
        // Natural slotted fan angle at wingtip
        const fanAngle = (t - 0.4) * 0.65;
        feather.rotation.y = xSign * (0.2 + fanAngle);
        feather.rotation.x = -0.15;
        feather.rotation.z = xSign * (0.05 + t * 0.15);
        feather.castShadow = true;
        wrist.add(feather);
        primaryFeathers.push(feather);
      }

      elbow.add(wrist);
      shoulder.add(elbow);
      bodyGroup.add(shoulder);

      return { shoulder, elbow, wrist, primaryFeathers, secondaryFeathers };
    };

    const leftWing = createWing(-1);
    const rightWing = createWing(1);

    eagleRoot.add(bodyGroup);
    scene.add(eagleRoot);

    setIsLoaded(true);

    // 7. Cinematic Animation State Definitions for the 5 Phases
    interface PhaseConfig {
      eaglePos: THREE.Vector3;
      eagleRot: THREE.Euler;
      cameraPos: THREE.Vector3;
      cameraLookAt: THREE.Vector3;
      wingFlapSpeed: number;
      wingFlapAmp: number;
      wingFold: number;
      glideRatio: number;
    }

    const phases: Record<FlightPhase, PhaseConfig> = {
      // Phase 1: Distant Flight
      1: {
        eaglePos: new THREE.Vector3(0, 2.5, -42),
        eagleRot: new THREE.Euler(0.04, 0, 0),
        cameraPos: new THREE.Vector3(0, 1.8, 12),
        cameraLookAt: new THREE.Vector3(0, 2.5, -30),
        wingFlapSpeed: 4.8,
        wingFlapAmp: 0.55,
        wingFold: 0.05,
        glideRatio: 0.25,
      },
      // Phase 2: Approach (Surges closer)
      2: {
        eaglePos: new THREE.Vector3(0.5, 0.8, -16),
        eagleRot: new THREE.Euler(0.08, 0.06, -0.04),
        cameraPos: new THREE.Vector3(0.2, 0.9, 8.5),
        cameraLookAt: new THREE.Vector3(0.3, 0.8, -10),
        wingFlapSpeed: 5.4,
        wingFlapAmp: 0.68,
        wingFold: 0.08,
        glideRatio: 0.15,
      },
      // Phase 3: Close Flying Pose (Foreground flight, wings wide)
      3: {
        eaglePos: new THREE.Vector3(0, -0.2, -4.2),
        eagleRot: new THREE.Euler(0.12, 0.02, 0),
        cameraPos: new THREE.Vector3(0, 0.1, 4.2),
        cameraLookAt: new THREE.Vector3(0, -0.15, -3.5),
        wingFlapSpeed: 4.2,
        wingFlapAmp: 0.62,
        wingFold: 0.12,
        glideRatio: 0.3,
      },
      // Phase 4: Rotation & Turn (Banking turn showing dorsal feathers)
      4: {
        eaglePos: new THREE.Vector3(0.8, 0.2, -3.2),
        eagleRot: new THREE.Euler(0.22, -0.85, -0.42),
        cameraPos: new THREE.Vector3(-0.6, 0.6, 3.8),
        cameraLookAt: new THREE.Vector3(0.6, 0.1, -2.8),
        wingFlapSpeed: 2.8,
        wingFlapAmp: 0.38,
        wingFold: 0.25,
        glideRatio: 0.75, // banking glide
      },
      // Phase 5: Final Close-up / Hover Profile (Settles in regal 3/4 pose)
      5: {
        eaglePos: new THREE.Vector3(0.75, 0.05, -1.8),
        eagleRot: new THREE.Euler(0.16, -1.15, -0.08),
        cameraPos: new THREE.Vector3(-0.4, 0.45, 2.8),
        cameraLookAt: new THREE.Vector3(0.6, 0.15, -1.6),
        wingFlapSpeed: 1.8,
        wingFlapAmp: 0.22,
        wingFold: 0.38, // wings partially swept back in noble perch pose
        glideRatio: 0.9,
      },
    };

    // Current interpolated transformation state
    const currentEaglePos = phases[1].eaglePos.clone();
    const currentEagleRot = phases[1].eagleRot.clone();
    const currentCamPos = phases[1].cameraPos.clone();
    const currentCamLookAt = phases[1].cameraLookAt.clone();
    let currentFlapSpeed = phases[1].wingFlapSpeed;
    let currentFlapAmp = phases[1].wingFlapAmp;
    let currentWingFold = phases[1].wingFold;

    // 8. Contained Mouse & Pointer Parallax Tracking
    // Maximum range of motion constants to keep movement subtle, contained, and cinematic
    const MAX_CAM_PAN_X = 0.45;    // Maximum horizontal camera pan
    const MAX_CAM_PAN_Y = 0.28;    // Maximum vertical camera pan
    const MAX_CAM_TILT_X = 0.06;   // Maximum pitch tilt
    const MAX_CAM_TILT_Y = 0.09;   // Maximum yaw tilt

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      // Only track when cursor is within reasonable proximity or over the hero container
      const rawX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const rawY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      // Clamp within [-1, 1] bounds
      const clampedX = Math.max(-1, Math.min(1, rawX));
      const clampedY = Math.max(-1, Math.min(1, rawY));

      stateRef.current.targetMouseX = clampedX;
      stateRef.current.targetMouseY = clampedY;

      if (stateRef.current.isDragging && stateRef.current.isFreeOrbit) {
        const deltaX = e.clientX - stateRef.current.dragStartX;
        const deltaY = e.clientY - stateRef.current.dragStartY;
        stateRef.current.orbitTheta -= deltaX * 0.008;
        stateRef.current.orbitPhi = Math.max(0.2, Math.min(Math.PI - 0.2, stateRef.current.orbitPhi + deltaY * 0.008));
        stateRef.current.dragStartX = e.clientX;
        stateRef.current.dragStartY = e.clientY;
      }
    };

    const handlePointerLeave = () => {
      // Gently return to neutral center position when cursor leaves the hero panel
      stateRef.current.targetMouseX = 0;
      stateRef.current.targetMouseY = 0;
      stateRef.current.isDragging = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Free orbit dragging only in free orbit mode
      if (stateRef.current.isFreeOrbit) {
        stateRef.current.isDragging = true;
        stateRef.current.dragStartX = e.clientX;
        stateRef.current.dragStartY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      stateRef.current.isDragging = false;
    };

    // Passive listeners ensure no interference with native browser page scrolling
    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    container.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // 9. ANIMATION LOOP
    let animationFrameId = 0;
    let lastFlapPeak = 0;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const animate = (timestamp: number) => {
      const delta = Math.min((timestamp - stateRef.current.lastTime) / 1000, 0.1);
      stateRef.current.lastTime = timestamp;
      stateRef.current.time += delta;

      // FPS tracking
      frameCount++;
      if (timestamp - lastFpsUpdate > 1000) {
        setFps(Math.round((frameCount * 1000) / (timestamp - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = timestamp;
      }

      // Smooth mouse damping
      stateRef.current.mouseX = THREE.MathUtils.damp(stateRef.current.mouseX, stateRef.current.targetMouseX, 4.0, delta);
      stateRef.current.mouseY = THREE.MathUtils.damp(stateRef.current.mouseY, stateRef.current.targetMouseY, 4.0, delta);

      // Auto-play phase progression if enabled
      if (stateRef.current.isAutoPlay) {
        stateRef.current.phaseProgress += delta * 0.25; // 4 seconds per phase
        if (stateRef.current.phaseProgress >= 1) {
          stateRef.current.phaseProgress = 0;
          let nextPhase = (stateRef.current.phase + 1) as FlightPhase;
          if (nextPhase > 5) nextPhase = 1;
          stateRef.current.phase = nextPhase;
          stateRef.current.targetPhase = nextPhase;
          if (onPhaseChange) {
            onPhaseChange(nextPhase);
          }
        }
      } else {
        stateRef.current.phase = stateRef.current.targetPhase;
      }

      const targetPhaseCfg = phases[stateRef.current.targetPhase];

      // Smooth interpolation between phases (exponential damping for cinematic flow)
      const dampSpeed = 2.2;
      currentEaglePos.x = THREE.MathUtils.damp(currentEaglePos.x, targetPhaseCfg.eaglePos.x, dampSpeed, delta);
      currentEaglePos.y = THREE.MathUtils.damp(currentEaglePos.y, targetPhaseCfg.eaglePos.y, dampSpeed, delta);
      currentEaglePos.z = THREE.MathUtils.damp(currentEaglePos.z, targetPhaseCfg.eaglePos.z, dampSpeed, delta);

      currentEagleRot.x = THREE.MathUtils.damp(currentEagleRot.x, targetPhaseCfg.eagleRot.x, dampSpeed, delta);
      currentEagleRot.y = THREE.MathUtils.damp(currentEagleRot.y, targetPhaseCfg.eagleRot.y, dampSpeed, delta);
      currentEagleRot.z = THREE.MathUtils.damp(currentEagleRot.z, targetPhaseCfg.eagleRot.z, dampSpeed, delta);

      currentCamPos.x = THREE.MathUtils.damp(currentCamPos.x, targetPhaseCfg.cameraPos.x, dampSpeed, delta);
      currentCamPos.y = THREE.MathUtils.damp(currentCamPos.y, targetPhaseCfg.cameraPos.y, dampSpeed, delta);
      currentCamPos.z = THREE.MathUtils.damp(currentCamPos.z, targetPhaseCfg.cameraPos.z, dampSpeed, delta);

      currentCamLookAt.x = THREE.MathUtils.damp(currentCamLookAt.x, targetPhaseCfg.cameraLookAt.x, dampSpeed, delta);
      currentCamLookAt.y = THREE.MathUtils.damp(currentCamLookAt.y, targetPhaseCfg.cameraLookAt.y, dampSpeed, delta);
      currentCamLookAt.z = THREE.MathUtils.damp(currentCamLookAt.z, targetPhaseCfg.cameraLookAt.z, dampSpeed, delta);

      currentFlapSpeed = THREE.MathUtils.damp(currentFlapSpeed, targetPhaseCfg.wingFlapSpeed, dampSpeed, delta);
      currentFlapAmp = THREE.MathUtils.damp(currentFlapAmp, targetPhaseCfg.wingFlapAmp, dampSpeed, delta);
      currentWingFold = THREE.MathUtils.damp(currentWingFold, targetPhaseCfg.wingFold, dampSpeed, delta);

      // --- WING FLAP KINEMATICS ---
      const flapTime = stateRef.current.time * currentFlapSpeed;
      const flapSine = Math.sin(flapTime);
      const flapCos = Math.cos(flapTime);

      // Play subtle wing flap whoosh sound at downstroke apex
      if (flapSine > 0.95 && timestamp - lastFlapPeak > 350) {
        lastFlapPeak = timestamp;
        soundEngine.playWingFlap();
      }

      // Natural aerodynamic lift & body bobbing
      const bodyBob = flapSine * currentFlapAmp * 0.22;
      const bodyPitch = flapCos * currentFlapAmp * 0.08;

      // Subtle breathing / micro-hover in close-up phase
      const breathe = Math.sin(stateRef.current.time * 1.8) * 0.03;

      // Contained eagle micro-banking and altitude posture response
      const eaglePanX = stateRef.current.mouseX * 0.25;
      const eaglePanY = stateRef.current.mouseY * 0.15;

      eagleRoot.position.set(
        currentEaglePos.x + eaglePanX,
        currentEaglePos.y + bodyBob + breathe + eaglePanY,
        currentEaglePos.z
      );

      eagleRoot.rotation.set(
        currentEagleRot.x + bodyPitch - (stateRef.current.mouseY * 0.06),
        currentEagleRot.y + (stateRef.current.mouseX * 0.10),
        currentEagleRot.z + (flapSine * 0.03) - (stateRef.current.mouseX * 0.04)
      );

      // Left & Right Wing Joint Rotations
      // Shoulder: main vertical flap (Z-axis) + forward/back sweep (Y-axis)
      const shoulderFlap = flapSine * currentFlapAmp;
      const sweep = flapCos * currentFlapAmp * 0.2;

      // Left Wing
      leftWing.shoulder.rotation.z = -shoulderFlap - currentWingFold * 0.8;
      leftWing.shoulder.rotation.y = sweep + currentWingFold * 0.6;
      leftWing.elbow.rotation.z = (shoulderFlap * 0.45) - currentWingFold * 0.5;
      leftWing.wrist.rotation.z = (shoulderFlap * 0.35) - currentWingFold * 0.4;
      // Wingtip primary feather aero-flexing
      leftWing.primaryFeathers.forEach((feather, idx) => {
        feather.rotation.z = (shoulderFlap * 0.2) + (idx * 0.02 * flapSine);
      });

      // Right Wing (mirrored)
      rightWing.shoulder.rotation.z = shoulderFlap + currentWingFold * 0.8;
      rightWing.shoulder.rotation.y = -sweep - currentWingFold * 0.6;
      rightWing.elbow.rotation.z = (-shoulderFlap * 0.45) + currentWingFold * 0.5;
      rightWing.wrist.rotation.z = (-shoulderFlap * 0.35) + currentWingFold * 0.4;
      rightWing.primaryFeathers.forEach((feather, idx) => {
        feather.rotation.z = (-shoulderFlap * 0.2) - (idx * 0.02 * flapSine);
      });

      // Head stabilization: Head remains locked on horizon despite body roll & pitch
      headGroup.rotation.x = -bodyPitch * 0.8 + Math.sin(stateRef.current.time * 0.9) * 0.05;
      headGroup.rotation.y = -(stateRef.current.mouseX * 0.18) + Math.sin(stateRef.current.time * 0.6) * 0.08;

      // Tail rudder articulation
      tailGroup.rotation.x = -0.15 - (flapSine * 0.1);
      tailGroup.rotation.y = stateRef.current.mouseX * 0.12;

      // Drifting clouds beneath
      clouds.position.z = (stateRef.current.time * 4) % 40;

      // Camera Positioning
      if (stateRef.current.isFreeOrbit) {
        // Free orbit around the eagle
        const radius = stateRef.current.orbitRadius;
        const theta = stateRef.current.orbitTheta;
        const phi = stateRef.current.orbitPhi;
        camera.position.x = eagleRoot.position.x + radius * Math.sin(phi) * Math.sin(theta);
        camera.position.y = eagleRoot.position.y + radius * Math.cos(phi);
        camera.position.z = eagleRoot.position.z + radius * Math.sin(phi) * Math.cos(theta);
        camera.lookAt(eagleRoot.position);
      } else {
        // Cinematic tracking camera with contained, smooth mouse parallax within defined bounds
        const panX = stateRef.current.mouseX * MAX_CAM_PAN_X;
        const panY = stateRef.current.mouseY * MAX_CAM_PAN_Y;
        const tiltX = stateRef.current.mouseY * MAX_CAM_TILT_X;
        const tiltY = stateRef.current.mouseX * MAX_CAM_TILT_Y;

        camera.position.set(
          currentCamPos.x + panX,
          currentCamPos.y + panY,
          currentCamPos.z
        );
        camera.lookAt(
          currentCamLookAt.x + panX * 0.35 + tiltY,
          currentCamLookAt.y + panY * 0.35 + tiltX,
          currentCamLookAt.z
        );
      }

      // Wireframe toggle update
      if (bodyMat.wireframe !== stateRef.current.wireframe) {
        bodyMat.wireframe = stateRef.current.wireframe;
        goldenNapeMat.wireframe = stateRef.current.wireframe;
        flightFeatherMat.wireframe = stateRef.current.wireframe;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      // Dispose Three.js resources
      bodyGeo.dispose();
      breastGeo.dispose();
      neckGeo.dispose();
      skullGeo.dispose();
      browGeo.dispose();
      beakBaseGeo.dispose();
      beakHookGeo.dispose();
      cereGeo.dispose();
      plumageTex.dispose();
      goldenNapeTex.dispose();
      bodyMat.dispose();
      goldenNapeMat.dispose();
      flightFeatherMat.dispose();
      beakMat.dispose();
      beakTipMat.dispose();
      eyeIrisMat.dispose();
      eyePupilMat.dispose();
      eyeCorneaMat.dispose();
      talonMat.dispose();
      clawMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas Mounting Container */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Interact: move cursor for parallax tracking, click & drag in Free Orbit mode"
      />

      {/* Loading state indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E5EEF8]/80 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#1B1A17] border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium tracking-widest text-[#1B1A17]/70 uppercase">
              Initializing 3D Altitude Engine...
            </span>
          </div>
        </div>
      )}

      {/* Sleek bottom control overlay - Unified Collapsible Dock as instructed */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/15 text-white/90 text-xs shadow-lg z-10 transition-all hover:bg-black/60">
        {/* Phase selector pills */}
        <div className="flex items-center gap-1 border-r border-white/15 pr-2">
          {([1, 2, 3, 4, 5] as FlightPhase[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                if (onPhaseChange) onPhaseChange(p);
              }}
              className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                currentPhase === p
                  ? 'bg-amber-400 text-black shadow-sm font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              title={`Jump to Phase ${p}`}
            >
              P{p}
            </button>
          ))}
        </div>

        {/* Orbit Mode Toggle */}
        <button
          onClick={() => setIsFreeOrbit(!isFreeOrbit)}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
            isFreeOrbit ? 'bg-white text-black' : 'text-white/70 hover:text-white'
          }`}
          title="Toggle Free 360° Orbit Camera"
        >
          {isFreeOrbit ? 'Free Orbit' : 'Cinematic'}
        </button>

        {/* Wireframe Toggle */}
        <button
          onClick={() => setWireframe(!wireframe)}
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
            wireframe ? 'bg-white text-black' : 'text-white/70 hover:text-white'
          }`}
          title="Toggle Mesh Wireframe View"
        >
          Mesh
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
            audioActive ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' : 'text-white/70 hover:text-white'
          }`}
          title="Toggle High-Altitude Ambient Wind Synthesizer"
        >
          <span>{audioActive ? 'Wind On' : 'Wind Off'}</span>
        </button>

        {/* FPS indicator */}
        <span className="text-[10px] text-white/40 font-mono tabular-nums pl-1">
          {fps} FPS
        </span>
      </div>
    </div>
  );
};
