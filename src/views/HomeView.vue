<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const sceneRef = ref(null);

// 初始化 GUI
const gui = new dat.GUI();

// 設定 three 基本物品


// 建立場景
let scene: THREE.Scene;
const createScene = () => {
  scene = new THREE.Scene();
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
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 建立立方體
let cube: THREE.Mesh;
let time = 0;
const speed = 0.1; // 控制移動速度
const amplitude = 5; // 控制移動幅度

const createCube = (x: number, y: number, z: number) => {
  const geometry = new THREE.BoxGeometry(x, y, z);
  const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
  cube = new THREE.Mesh(geometry, material);

  cube.position.set(0, 1.5, 0.6);


    gui.add(cube.rotation, 'x', 0, Math.PI).name('Rotate X Axis');
    gui.add(cube.rotation, 'y', 0, Math.PI).name('Rotate Y Axis');
    gui.add(cube.rotation, 'z', 0, Math.PI).name('Rotate Z Axis');
    gui.add(cube.scale, 'x', 0, 2).name('Scale X Axis');
    gui.add(cube.scale, 'y', 0, 2).name('Scale Y Axis');
    gui.add(cube.scale, 'z', 0, 2).name('Scale Z Axis');


  // // 定義旋轉的四元數
  // const quaternionX = new THREE.Quaternion().setFromAxisAngle(
  //   new THREE.Vector3(1, 0, 0),
  //   Math.PI / 4
  // ); // X軸旋轉45度
  // const quaternionY = new THREE.Quaternion().setFromAxisAngle(
  //   new THREE.Vector3(0, 1, 0),
  //   Math.PI / 4
  // ); // Y軸旋轉45度
  // const quaternionZ = new THREE.Quaternion().setFromAxisAngle(
  //   new THREE.Vector3(0, 0, 1),
  //   Math.PI / 8
  // ); // Z軸旋轉45度

  // cube.quaternion.multiplyQuaternions(quaternionX, quaternionY);
  // // cube.quaternion.multiply(quaternionZ);

  scene.add(cube);
};

// 建立控制器
let controls: OrbitControls;
const createControls = (cameraX: number, cameraY: number, cameraZ: number) => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.enableDamping = true;
  camera.position.set(cameraX, cameraY, cameraZ);
  controls.target.set(0, 0, 0);
};

// 建立輔助器
const createAxesHelper = () => {
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
};

// 建立動畫
const animate = () => {
  requestAnimationFrame(animate);
  // 更新時間
  time += speed;

  // 使用正弦波讓立方體來回移動
  // cube.position.x = amplitude * Math.sin(time);

  controls.position0.set(10, 0, 0);
  controls.update();
  renderer.render(scene, camera);
};

onMounted(() => {
  createScene();
  createCamera();
  createRenderer();
  createCube(4, 4, 4);
  createControls(10, 7, 9);
  createAxesHelper();
  animate();
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
</script>

<template>
  <main class="h-screen w-screen">
    <canvas ref="sceneRef"></canvas>
  </main>
</template>
