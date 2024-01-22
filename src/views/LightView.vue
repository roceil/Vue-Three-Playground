<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { GUI } from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const sceneRef = ref(null);

// 初始化 GUI
const gui = new GUI();

// 設定 three 基本物品
let scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  cube: THREE.Mesh;

// 建立場景
const createScene = () => {
  scene = new THREE.Scene();
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);
};

// 建立 Group
let group: THREE.Group;
const createGroup = () => {
  group = new THREE.Group();
  scene.add(group);
};

// 建立相機
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
const createRenderer = () => {
  renderer = new THREE.WebGLRenderer({
    canvas: (sceneRef.value as unknown) as HTMLCanvasElement,
  });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
};

// 建立地板
const createGround = (x: number, y: number, z: number) => {
  const groundGeometry = new THREE.BoxGeometry(x, y, z);
  const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xfafafa });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);

  ground.receiveShadow = true;
  ground.position.set(0, -2, 0);
  group.add(ground);
};

// 建立立方體
const createCube = (x: number, y: number, z: number) => {
  const geometry = new THREE.BoxGeometry(x, y, z);
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  cube = new THREE.Mesh(geometry, material);

  cube.castShadow = true;
  cube.position.x = -2;
  cube.position.z = -2;
  group.add(cube);
};

// 建立球體
const createSphere = (radius: number, widthSegments: number, heightSegments: number) => {
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const sphere = new THREE.Mesh(geometry, material);

  sphere.castShadow = true;
  sphere.receiveShadow = true;
  sphere.position.x = 0;
  group.add(sphere);
};

// 建立圓錐體
const createCone = (radius: number, height: number, radialSegments: number) => {
  const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
  const material = new THREE.MeshPhongMaterial({ color: 0x0000ff });
  const cone = new THREE.Mesh(geometry, material);

  cone.castShadow = true;
  cone.position.x = 2;
  cone.position.z = 2;
  
  group.add(cone);
};

// TODO => 建立 Point Light
let pl: THREE.PointLight;
let angle = 0;
const rotationSpeed = 0.01;
const radiusX = 4; // 橢圓在 x 軸的半徑
const radiusZ = 7.5; // 橢圓在 z 軸的半徑
const createPointLight = (color: number, intensity: number) => {
  pl = new THREE.PointLight(0xf75000, 500, 20, 2);
  pl.position.set(2, 0, 4);
  const plHelper = new THREE.PointLightHelper(pl, 0.5);
  group.add(pl, plHelper);
  pl.castShadow = true; // 啟用陰影投射

  // set up point light gui
  const plSettings = {
    visible: true,
    color: pl.color.getHex(),
  };
  const plFolder = gui.addFolder("point light");
  plFolder.add(plSettings, "visible").onChange((value) => {
    pl.visible = value;
    plHelper.visible = value;
  });
  plFolder.add(pl, "intensity", 0, 50, 0.25);
  plFolder.add(pl.position, "x", -10, 10, 0.5);
  plFolder.add(pl.position, "y", -2, 10, 0.5);
  plFolder.add(pl.position, "z", -2, 10, 0.5);
  plFolder.add(pl, "castShadow");
  plFolder.addColor(plSettings, "color").onChange((value) => pl.color.set(value));
  plFolder.open();
};

// TODO => 建立 Spot Light
let sl: THREE.SpotLight;
const createSpotLight = () => {
  sl = new THREE.SpotLight(0xffd306, 100, 8, Math.PI / 8, 0);
  sl.position.set(6, 2, 6);
  sl.castShadow = true;
  sl.rotation.x = -Math.PI / 4;
  const slHelper = new THREE.SpotLightHelper(sl);
  group.add(sl, slHelper);

  // set up spot light gui
  const slSettings = {
    visible: true,
  };
  const slFolder = gui.addFolder("spot light");
  slFolder.add(slSettings, "visible").onChange((value) => {
    sl.visible = value;
    slHelper.visible = value;
  });
  slFolder.add(sl, "intensity", 0, 200, 0.5);
  slFolder.add(sl, "angle", Math.PI / 16, Math.PI / 2, Math.PI / 16);
  slFolder.add(sl.position, "x", -10, 10, 0.5);
  slFolder.add(sl.position, "y", -10, 10, 0.5);
  slFolder.add(sl.position, "z", -10, 10, 0.5);
  slFolder.add(sl, "castShadow");
  slFolder.open();
};

// TODO => 建立 Directional Light
let dl: THREE.DirectionalLight;
const createDirectionalLight = () => {
  dl = new THREE.DirectionalLight(0xffffff, 20);
  dl.position.set(10, 10, 8);
  dl.castShadow = true;
  const dlHelper = new THREE.DirectionalLightHelper(dl, 3);
  group.add(dl, dlHelper);

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
  dlFolder.add(dl, "castShadow");
  dlFolder.addColor(dlSettings, "color").onChange((value) => dl.color.set(value));
  dlFolder.open();
};

// 建立控制器
let controls: OrbitControls;
const createControls = (cameraX: number, cameraY: number, cameraZ: number) => {
  controls = new OrbitControls(camera, renderer.domElement);
  // controls.autoRotate = true;
  controls.enableDamping = true;
  camera.position.set(cameraX, cameraY, cameraZ);
  controls.target.set(0, 0, 0);
};

// 定義橢圓形軌跡的參數
// const radiusX = 10; // 橢圓在 x 軸的半徑
// const radiusZ = 15; // 橢圓在 z 軸的半徑
const segments = 100; // 軌跡的細分數量

// 創建橢圓形軌跡的點
const createRoute = () => {
  const ellipsePath = new THREE.EllipseCurve(
    0,
    0, // ax, aY
    radiusX,
    radiusZ, // xRadius, yRadius
    0,
    2 * Math.PI, // aStartAngle, aEndAngle
    false, // aClockwise
    0 // aRotation
  );

  const points = ellipsePath.getPoints(segments);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  // 創建材質
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });

  // 創建線條並添加到場景
  const ellipse = new THREE.Line(geometry, material);

  // 調整橢圓形線條的旋轉以使其水平
  ellipse.rotation.x = Math.PI / 2; // 繞x軸旋轉90度
  // 根據需要進行其他旋轉調整

  scene.add(ellipse);
};

// 建立動畫
const animate = () => {
  requestAnimationFrame(animate);
  // 更新光源位置
  angle += rotationSpeed;
  pl.position.x = radiusX * Math.sin(angle);
  pl.position.z = radiusZ * Math.cos(angle);
  pl.lookAt(0, 0, 0);

  console.log("x 向量: ", pl.position.x);
  console.log("z 向量: ", pl.position.z);

  controls.update();
  renderer.render(scene, camera);
};

onMounted(() => {
  createScene();
  createGroup();
  createCamera();
  createRenderer();
  createGround(8, 0.5, 8);
  createCube(1, 1, 1);
  createSphere(1, 20, 20);
  createCone(1, 2, 20);
  createPointLight(0xffffff, 1);
  // createSpotLight();
  // createDirectionalLight();
  createRoute();
  createControls(10, 7, 9);
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
