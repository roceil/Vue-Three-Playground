<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import uv_texture from "../assets/texture/uv.jpeg";
import earth from "../assets/texture/earth.jpg";
import cloud from "../assets/texture/clouds.jpg";
import space from "../assets/texture/space.png";

const sceneRef = ref(null);

// 初始化 GUI
const gui = new GUI();

// 建立場景
let scene: THREE.Scene;
const createScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.TextureLoader().load(space);
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

// 建立紋理
// let texture: THREE.Texture;
// const createTexture = () => {
//   texture = new THREE.TextureLoader().load(
//     "../assets/texture/uv.jpeg"
//   );
//   // const material = new THREE.MeshStandardMaterial({ map: texture });
//   // cube.material = material;
// };

// 建立正方體
let cube: THREE.Mesh;
let cube1: THREE.Mesh;
let cube2: THREE.Mesh;
const createCube = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const uv_texture_skin = new THREE.TextureLoader().load(uv_texture);
  const material = new THREE.MeshPhongMaterial({
    map: uv_texture_skin,
    side: THREE.DoubleSide,
  });
  cube = new THREE.Mesh(geometry, material);

  const geometry1 = new THREE.BoxGeometry(1, 1, 1);
  const material1 = new THREE.MeshStandardMaterial();
  cube1 = new THREE.Mesh(geometry1, material1);
  cube1.castShadow = true;
  cube1.position.set(2, 0, 0);

  const geometry2 = new THREE.BoxGeometry(1, 1, 1);
  const material2 = new THREE.MeshStandardMaterial();
  cube2 = new THREE.Mesh(geometry2, material2);
  cube2.position.set(-2, 0, 0);

  scene.add(cube, cube1, cube2);
};

// 建立圓形
let sphere1: THREE.Mesh;
let sphere2: THREE.Mesh;
let sphere3: THREE.Mesh;
const round_speed = 0.001;
const createSphere = () => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);

  // 加載第一層紋理
  const earth_skin = new THREE.TextureLoader().load(earth);
  const material1 = new THREE.MeshPhongMaterial({
    map: earth_skin,
    side: THREE.DoubleSide,
  });

  // 創建第一個球體
  sphere1 = new THREE.Mesh(geometry, material1);
  sphere1.position.set(0, 0, 0);
  scene.add(sphere1);

  // 加載第二層紋理
  const clouds_texture = new THREE.TextureLoader().load(cloud); // 確保雲層紋理有透明度
  const material2 = new THREE.MeshPhongMaterial({
    map: clouds_texture,
    transparent: true, // 雲層紋理需要透明
    opacity: 0.5, // 根據需要調整透明度
  });

  // 創建第二個球體，疊加在第一個球體之上
  sphere2 = new THREE.Mesh(geometry, material2);
  sphere2.position.copy(sphere1.position); // 確保與第一個球體位置相同;
  sphere2.scale.set(1.01, 1.01, 1.01); // 確保雲層比地球大一點
  scene.add(sphere2);

  // 創建第三個球體
  const geometry3 = new THREE.SphereGeometry(100, 50, 50);
  const texture = new THREE.TextureLoader().load("https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg");

  const material3 = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide, // 確保只有外面有紋理
  });

  sphere3 = new THREE.Mesh(geometry3, material3);
  scene.add(sphere3);

  // 設定 GUI
  const sphereFolder = gui.addFolder("Sphere");
  sphereFolder.add(sphere1.position, "x", -10, 10, 0.01);
  sphereFolder.add(sphere1.position, "y", -10, 10, 0.01);
  sphereFolder.add(sphere1.position, "z", -10, 10, 0.01);
};

// 建立燈光
const createLight = () => {
  const light = new THREE.PointLight("#FFFCF0", 100);
  const lightHelper = new THREE.PointLightHelper(light);
  light.position.set(-2.41, 1.34, 3.1);

  // 設定 GUI
  const lightFolder = gui.addFolder("Light");
  lightFolder.add(light.position, "x", -10, 10, 0.01);
  lightFolder.add(light.position, "y", -10, 10, 0.01);
  lightFolder.add(light.position, "z", -10, 10, 0.01);
  lightFolder.add(light, "intensity", 0, 100, 0.01);
  lightFolder.open();

  // 寫入場景
  scene.add(light, lightHelper);
};

// 建立動畫
const animate = () => {
  requestAnimationFrame(animate);
  // 地球自轉
  sphere1.rotation.y += 0.0005;
  sphere2.rotation.y += round_speed;
  controls.update();
  renderer.render(scene, camera);
};

onMounted(() => {
  createScene();
  createCamera();
  createRenderer();
  // createCube();
  createSphere();
  createLight();
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
