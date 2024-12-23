import './style.css'
import * as THREE from 'three';
import gsap from 'gsap';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';


let scene, camera, renderer, width, height;

//geometry

let geometry;

//meshes

let mesh;

//materials
let material;

let sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

let webglImages = [];
let webglTexts = [];

// init

camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 100, 1000);
camera.position.z = 500;
camera.fov = (180 * (2 * Math.atan(window.innerHeight / 2 / 500))) / Math.PI;
camera.updateProjectionMatrix();

scene = new THREE.Scene();

function setMediaSize() {
  const images = [...document.querySelectorAll('[data-webgl-media]')];
  const imageGeo = new THREE.PlaneGeometry(1, 1, 10, 10);

  webglImages = images.map((img, i) => {
    img.style.opacity = 0;
    const { width, height, top, left } = img.getBoundingClientRect();

    const imageMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms: {
        time: { value: 0 },
        uTexture: { value: new THREE.TextureLoader().load(img.src) }
      }
    })
    const mesh = new THREE.Mesh(imageGeo, imageMaterial);
    mesh.scale.set(width, height, 1);
    mesh.position.x = left - sizes.width / 2 + width / 2;
    mesh.position.y = -top + sizes.height / 2 - height / 2;

    scene.add(mesh);

    return {
      mesh,
      material: imageMaterial,
      img
    }
  })


}
setMediaSize();



renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setAnimationLoop(animate);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);


window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  renderer.setSize(sizes.width, sizes.height);
  camera.aspect = sizes.width / sizes.height;


  webglImages.forEach((object, i) => {

    const { width, height, top, left } = object.img.getBoundingClientRect();

    object.mesh.scale.set(width, height, 1);

    object.mesh.position.x = left - sizes.width / 2 + width / 2;
    object.mesh.position.y = -top + sizes.height / 2 - height / 2;

  })

  camera.updateProjectionMatrix();
});

function animate(time) {

  webglImages.forEach((object, i) => {
    object.material.uniforms.time.value = time / 1000;
  })

  renderer.render(scene, camera);

}