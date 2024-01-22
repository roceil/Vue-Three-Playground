<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const sceneRef = ref(null);

// 初始化 GUI
const gui = new GUI();

// 建立場景
let scene: THREE.Scene;
const createScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#3677FF");
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
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

// 建立方塊
let cube: THREE.Mesh;
const addNewBoxMesh = (x: number, y: number, z: number) => {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0xfafafa,
  });

  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.set(x, y, z);
  scene.add(boxMesh);
};

// 建立 pointer
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

// 建立滑鼠事件
let selectedObject:any = null; // 用於保存上次選中的物體

const onMouseMove = (event: { clientX: number; clientY: number; }) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    if (selectedObject != intersects[0].object) {
      if (selectedObject) {
        selectedObject.material.color.set(0xffffff); // 將上一個物體的顏色重置
      }
      selectedObject = intersects[0].object;
      selectedObject.material.color.set(0xff0000); // 更改當前物體的顏色
    }
  } else {
    if (selectedObject) {
      selectedObject.material.color.set(0xffffff); // 如果沒有物體被選中，重置顏色
      selectedObject = null;
    }
  }
};

window.addEventListener("pointermove", onMouseMove); // 添加事件監聽器

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
  // top rows
  addNewBoxMesh(0, 2, 0);
  addNewBoxMesh(2, 2, 0);
  addNewBoxMesh(-2, 2, 0);
  addNewBoxMesh(0, 2, -2);
  addNewBoxMesh(2, 2, -2);
  addNewBoxMesh(-2, 2, -2);
  addNewBoxMesh(0, 2, 2);
  addNewBoxMesh(2, 2, 2);
  addNewBoxMesh(-2, 2, 2);

  // middle rows
  addNewBoxMesh(0, 0, 0);
  addNewBoxMesh(2, 0, 0);
  addNewBoxMesh(-2, 0, 0);
  addNewBoxMesh(0, 0, -2);
  addNewBoxMesh(2, 0, -2);
  addNewBoxMesh(-2, 0, -2);
  addNewBoxMesh(0, 0, 2);
  addNewBoxMesh(2, 0, 2);
  addNewBoxMesh(-2, 0, 2);

  // bottom rows
  addNewBoxMesh(0, -2, 0);
  addNewBoxMesh(2, -2, 0);
  addNewBoxMesh(-2, -2, 0);
  addNewBoxMesh(0, -2, -2);
  addNewBoxMesh(2, -2, -2);
  addNewBoxMesh(-2, -2, -2);
  addNewBoxMesh(0, -2, 2);
  addNewBoxMesh(2, -2, 2);
  addNewBoxMesh(-2, -2, 2);

  // =======
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
  </main>
</template>
