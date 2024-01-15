<script lang="ts" setup>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 已經存在的鏡頭位置設定
camera.position.set(0, 10, 15);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(100, 50, 50);
console.log(geometry);
// 匯入材質
// image source: https://www.deviantart.com/kirriaa/art/Free-star-sky-HDRI-spherical-map-719281328
const texture = new THREE.TextureLoader().load(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg"
);
// 帶入材質，設定內外面
const material = new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide });
// 新增環境光
const light = new THREE.AmbientLight(0xffffff, 1);
scene.add(light);

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const earthGeometry = new THREE.SphereGeometry(5, 50, 50);
// 匯入材質
const earthTexture = new THREE.TextureLoader().load(
  "https://storage.googleapis.com/umas_public_assets/michaelBay/1280px-Solarsystemscope_texture_8k_earth_daymap.jpeg"
);
// 帶入材質，設定內外面
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  side: THREE.DoubleSide,
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// 將OrbitControls存於一個變數
const control = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 改用這個方法來控制鏡頭的方向
control.target.set(0, 0, 0);
control.update();

// 建立四元數
const dir = new THREE.Vector3(-2.49, 4.74, -3.01).normalize();
const quaternion = new THREE.Quaternion();

// 旋轉弧度
let rotation = 0;

// 傾斜地球的角度
earth.rotation.x = 0.41;
earth.rotation.y = 0.41;
earth.rotation.z = 0.41;

let earthRotation = 0;


quaternion.setFromAxisAngle(dir, rotation);
function animate() {
  // 地球自轉-每次執行都會轉動
  // 不斷增加弧度
  rotation += 0.001;
  // 更新四元數
  quaternion.setFromAxisAngle(dir, rotation);
  // 增加地球的位置
  earthRotation += 0.005;
  earth.position.setFromSphericalCoords(10, Math.tan(earthRotation), 0);
  // 將四元數帶入地球的旋轉
  earth.quaternion.copy(quaternion);
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
</script>

<template>
  <!-- <canvas ref="sceneRef"></canvas> -->
  <p></p>
</template>
