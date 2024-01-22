<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { TTFLoader } from "three/addons/jsm/loaders/TTFLoader";
// import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
// import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

import { TTFLoader } from "three/addons/loaders/TTFLoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";


const sceneRef = ref(null);

// 初始化 GUI
const gui = new GUI();

// 建立場景
let scene: THREE.Scene;
const createScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#3677FF");
  // const light = new THREE.AmbientLight(0xffffff, 1);
  // scene.add(light);
};

// 建立相機
let camera: THREE.PerspectiveCamera;
const createCamera = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 0);
};

// 建立渲染器
let renderer: THREE.WebGLRenderer;
const createRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    canvas: (sceneRef.value as unknown) as HTMLCanvasElement,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 建立控制器
let controls: OrbitControls;
const createControls = (cameraX: number, cameraY: number, cameraZ: number) => {
  controls = new OrbitControls(camera, renderer.domElement);
  // controls.autoRotate = true;
  controls.enableDamping = true;
  camera.position.set(cameraX, cameraY, cameraZ);
  // controls.target.set(0, 0, 0);
};

// 建立字體

const createFont = () => {
  const fontLoader = new FontLoader();
  fontLoader.load("../font/Taipei_TC_Regular.typeface.json", (json) => {
    console.log(1)
    console.log(json)
    // Use parsed font as normal.
    const textGeometry = new TextGeometry("哈囉", {
      height: 2,
      size: 10,
      font: json,
    });
    const textMaterial = new THREE.MeshNormalMaterial();
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);
    textMesh.position.x = -46;
    textMesh.position.y = -10;
  });
};

// 建立文字
// let text: THREE.Mesh;
// const createText = () => {
//   const textGeometry = new THREE.TextGeometry("Hello World", {
//     font: font,
//     size: 0.5,
//     height: 0.2,
//     curveSegments: 12,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 5,
//   });
//   const textMaterial = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//   });
//   text = new THREE.Mesh(textGeometry, textMaterial);
//   text.position.set(-1.5, 0, 0);
//   scene.add(text);
// };

// 建立動畫
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

onMounted(() => {
  createScene();
  createCamera();
  createRenderer();
  createFont();
  createControls(0, 0, 4);
  animate();
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
</script>

<template>
  <main class="h-screen w-screen relative">
    <canvas ref="sceneRef"></canvas>
    <div class="w-screen h-screen bg-gray-500">
      <h1
        class="text-white font-bold text-[100px] opacity-100 container z-20 absolute top-0"
      >
        地球自轉
      </h1>
    </div>
  </main>
</template>
