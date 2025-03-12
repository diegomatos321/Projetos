import * as THREE from "three";
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default function ProductConfigurator()
{
    return {
        selectedObjectName: "",

        init() 
        {
            if (WebGL.isWebGL2Available()) {
                this.Start();
            } else {
                const warning = WebGL.getWebGL2ErrorMessage();

                // @ts-ignore
                this.$refs.container.appendChild(warning);
            }
        },

        Start()
        {
            const container = document.getElementById("configurator") as HTMLDivElement;

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 1000);
            camera.position.z = 1;
        
            const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);
        
            const ambientLight = new THREE.AmbientLight(0xffffff, 1);
            scene.add(ambientLight);
        
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(0, 10, 0);
            scene.add(directionalLight);
        
            new OrbitControls(camera, renderer.domElement);
        
            const gltfLoader = new GLTFLoader();
            gltfLoader.load("/assets/models/demo-tent/scene.gltf", (gltf) => {
                scene.add(gltf.scene);
            });
        
            renderer.domElement.addEventListener("mousemove", (event) => {
                const parentBoundings = container.getBoundingClientRect();
                const mouse = new THREE.Vector2(
                    ((event.clientX - parentBoundings.left) / container.clientWidth) * 2 - 1,
                    -((event.clientY - parentBoundings.top) / container.clientHeight) * 2 + 1,
                );
        
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, camera);
        
                const intersects = raycaster.intersectObjects(scene.children, true);
                if (intersects.length > 0) {
                    const clickedObject = intersects[0].object;
                    this.selectedObjectName = clickedObject.name;
                }
            })
        
            function animate() {
                renderer.render(scene, camera);
            }
            renderer.setAnimationLoop(animate);        
        }
    }
}