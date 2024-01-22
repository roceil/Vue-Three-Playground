<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Lensflare, LensflareElement } from "three/addons/objects/Lensflare.js";
import space from "../assets/texture/8k_stars.jpg";
import sun_texture from "../assets/texture/8k_sun.jpg";
import moon_texture from "../assets/texture/8k_moon.jpg";
import mercury_texture from "../assets/texture/8k_mercury.jpg";
import venus_texture from "../assets/texture/8k_venus_surface.jpg";
import mars_texture from "../assets/texture/8k_mars.jpg";

const sceneRef = ref(null);

// 初始化 GUI
const gui = new GUI();

//  初始化three.js

// 建立場景
let scene: THREE.Scene;
const createScene = () => {
  scene = new THREE.Scene();
  scene.background = new THREE.TextureLoader().load(space);
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
  // camera.position.set(0, 0, 0);
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

// 建立球體宇宙
let universe: THREE.Mesh;
const createUniverse = () => {
  const geometry = new THREE.SphereGeometry(100, 50, 50);
  const texture = new THREE.TextureLoader().load(space);

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.BackSide, // 背面渲染
  });

  universe = new THREE.Mesh(geometry, material);
  scene.add(universe);
};

// 建立太陽
let sun: THREE.Mesh;
const createSun = () => {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const sun_skin = new THREE.TextureLoader().load(sun_texture);
  const material1 = new THREE.MeshPhongMaterial({
    map: sun_skin,
    side: THREE.DoubleSide,
    emissive: 0xffe66f, // 添加發光顏色
    emissiveIntensity: 0.5, // 設定發光強度
    transparent: true, // 設定材質透明
    opacity: 1, // 設定透明度
  });

  sun = new THREE.Mesh(geometry, material1);
  sun.position.set(0, 0, 0);
  scene.add(sun);

  // 增強太陽光源強度
  const light = new THREE.PointLight(0xffffff, 100, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  // 創建 Lensflare
  const textureLoader = new THREE.TextureLoader();
  const lensflareTexture = textureLoader.load(
    "https://threejs.org/examples/textures/lensflare/lensflare0.png"
  );

  const lensflare = new Lensflare();
  const lensflareElement = new LensflareElement(lensflareTexture, 100, 0, light.color);
  lensflare.addElement(lensflareElement);

  // 添加 Lensflare 到光源
  light.add(lensflare);
};

// 建立水星
let mercury: THREE.Mesh;
const createMercury = () => {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const mercury_skin = new THREE.TextureLoader().load(mercury_texture);
  const material = new THREE.MeshPhongMaterial({
    map: mercury_skin,
    side: THREE.DoubleSide,
  });

  mercury = new THREE.Mesh(geometry, material);
  mercury.position.set(2, 0, 0);
  scene.add(mercury);
};

// 更新水星的位置使其繞著太陽旋轉
let mercuryAngle = 0;
let mercuryRotationSpeed = 0.008;
const mercuryRadiusX = 2; // 橢圓在 x 軸的半徑
const mercuryRadiusZ = 3; // 橢圓在 z 軸的半徑
const updateMercuryPosition = () => {
  mercuryAngle += mercuryRotationSpeed;
  mercury.position.x = mercuryRadiusX * Math.sin(mercuryAngle);
  mercury.position.z = mercuryRadiusZ * Math.cos(mercuryAngle);
};

// 建立水星軌道
const createMercuryOrbit = (radiusX: number = 2, radiusZ: number = 2) => {
  const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xfff123 });
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2; // 繞x軸旋轉90度
  scene.add(ellipse);
};

// 建立金星
let venus: THREE.Mesh;
let venusAngle = 0;
let venusRotationSpeed = 0.005;
const venusRadiusX = 3.7; // 橢圓在 x 軸的半徑
const venusRadiusZ = 4.9; // 橢圓在 z 軸的半徑
const createVenus = () => {
  const geometry = new THREE.SphereGeometry(0.3, 32, 32);
  const venus_skin = new THREE.TextureLoader().load(venus_texture);
  const material = new THREE.MeshPhongMaterial({
    map: venus_skin,
    side: THREE.DoubleSide,
  });

  venus = new THREE.Mesh(geometry, material);
  venus.position.set(3, 0, 0);
  scene.add(venus);
};

// 更新金星的位置使其繞著太陽旋轉
const updateVenusPosition = () => {
  venusAngle += venusRotationSpeed;
  venus.position.x = venusRadiusX * Math.sin(venusAngle);
  venus.position.z = venusRadiusZ * Math.cos(venusAngle);
};

// 建立金星軌道
const createVenusOrbit = (radiusX: number = 2, radiusZ: number = 2) => {
  const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2; // 繞x軸旋轉90度
  scene.add(ellipse);
};

// 建立地球
let earth: THREE.Mesh;
let angle = 0;
let moonAngle = 0;
const rotationSpeed = 0.001;
const moonRotationSpeed = 0.01;
const radiusX = 5; // 橢圓在 x 軸的半徑
const radiusZ = 7.5; // 橢圓在 z 軸的半徑
const createEarth = () => {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const earth_skin = new THREE.TextureLoader().load(
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"
  );
  const material = new THREE.MeshPhongMaterial({
    map: earth_skin,
    side: THREE.DoubleSide,
  });

  earth = new THREE.Mesh(geometry, material);
  earth.position.set(5, 0, 0);
  scene.add(earth);
};

// 建立地球軌道
const createEarthOrbit = () => {
  const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2; // 繞x軸旋轉90度
  scene.add(ellipse);
};

// 建立月球
let moon: THREE.Mesh;
const createMoon = () => {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const moon_skin = new THREE.TextureLoader().load(moon_texture);
  const material = new THREE.MeshPhongMaterial({
    map: moon_skin,
    side: THREE.DoubleSide,
  });

  moon = new THREE.Mesh(geometry, material);
  moon.position.set(1.3, 0, 0);
  earth.add(moon);
};

// 更新月球的位置使其繞著地球旋轉
const updateMoonPosition = () => {
  moonAngle += moonRotationSpeed;
  const moonDistance = 1; // 地球到月球的距離
  moon.position.x = moonDistance * Math.cos(moonAngle);
  moon.position.z = moonDistance * Math.sin(moonAngle);
};

// 建立月球軌道
const createMoonOrbit = () => {
  const curve = new THREE.EllipseCurve(0, 0, 1, 1, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotation.x = Math.PI / 2; // 繞x軸旋轉90度
  earth.add(ellipse);
};

// 建立火星
let mars: THREE.Mesh;
let marsAngle = 0;
let marsRotationSpeed = 0.0012;
const marsRadiusX = 7.8; // 橢圓在 x 軸的半徑
const marsRadiusZ = 9.5; // 橢圓在 z 軸的半徑
const createMars = () => {
  const geometry = new THREE.SphereGeometry(0.7, 32, 32);
  const mars_skin = new THREE.TextureLoader().load(mars_texture);
  const material = new THREE.MeshPhongMaterial({
    map: mars_skin,
    side: THREE.DoubleSide,
  });

  mars = new THREE.Mesh(geometry, material);
  mars.position.set(7, 0, 0);
  scene.add(mars);
};

// 更新火星的位置使其繞著太陽旋轉
const updateMarsPosition = () => {
  marsAngle += marsRotationSpeed;
  mars.position.x = marsRadiusX * Math.sin(marsAngle);
  mars.position.z = marsRadiusZ * Math.cos(marsAngle);
};

// 建立火星軌道
const createMarsOrbit = (radiusX: number = 2, radiusZ: number = 2) => {
  const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusZ, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(50);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });
  const ellipse = new THREE.Line(geometry, material);
  ellipse.rotateX(Math.PI / 2); // 繞x軸旋轉90度
  scene.add(ellipse);
};

// 建立定向光
let dl: THREE.DirectionalLight;
const createDirectionalLight = () => {
  dl = new THREE.DirectionalLight(0xffffff, 100);
  dl.position.set(0, 0, 0);

  dl.castShadow = true;

  const dlHelper = new THREE.DirectionalLightHelper(dl, 5);
  scene.add(dlHelper);
  scene.add(dl);

  const dlSettings = {
    visible: true,
    color: dl.color.getHex(),
  };
  const dlFolder = gui.addFolder("directional light");
  dlFolder.add(dlSettings, "visible").onChange((value) => {
    dl.visible = value;
    dlHelper.visible = value;
  });
  dlFolder.add(dl, "intensity", 0, 20, 0.25);
  dlFolder.add(dl.position, "x", -10, 10, 0.5);
  dlFolder.add(dl.position, "y", -10, 10, 0.5);
  dlFolder.add(dl.position, "z", -10, 10, 0.5);
  dlFolder.add(dl.rotation, "x", -10, 10, 0.5);
  dlFolder.add(dl.rotation, "y", -10, 10, 0.5);
  dlFolder.add(dl.rotation, "z", -10, 10, 0.5);
  dlFolder.add(dl, "castShadow");
  dlFolder.addColor(dlSettings, "color").onChange((value) => dl.color.set(value));
  dlFolder.open();
};

// 建立動畫
const animate = () => {
  requestAnimationFrame(animate);
  angle += rotationSpeed;
  earth.position.x = radiusX * Math.sin(angle);
  earth.position.z = radiusZ * Math.cos(angle);
  updateMoonPosition();
  updateMercuryPosition();
  updateVenusPosition();
  updateMarsPosition();
  controls.update();
  renderer.render(scene, camera);
};

onMounted(() => {
  createScene();
  createCamera();
  createRenderer();
  createControls(0, 0, 4);
  createUniverse();
  createSun();
  createMercury();
  createMercuryOrbit(mercuryRadiusX, mercuryRadiusZ);
  createVenus();
  createVenusOrbit(venusRadiusX, venusRadiusZ);
  createEarth();
  createEarthOrbit();
  createMoon();
  createMoonOrbit();
  createMars();
  createMarsOrbit(marsRadiusX, marsRadiusZ);
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

