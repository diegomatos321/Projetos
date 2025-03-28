import Alpine from 'alpinejs';
import { defineComponent } from './utils.ts'
import * as THREE from "three";
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export default defineComponent(() => ({
    selectedObjectName: "",
    selectedSize: "5x5",
    selectedColor: "#ffffff",

    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: new THREE.WebGLRenderer(),

    snap: false,

    init() {
        if (WebGL.isWebGL2Available()) {
            this.Start();
        } else {
            const warning = WebGL.getWebGL2ErrorMessage();

            this.$refs.configurator.appendChild(warning);
        }
    },

    Start() {
        const container = this.$refs.configurator;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.01, 1000);
        this.camera.position.x = -1;

        this.renderer = Alpine.raw(new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }));
        this.renderer.autoClearColor = false;
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);

        const ambientLight = Alpine.raw(new THREE.AmbientLight(0xffffff, 1));
        this.scene.add(ambientLight);

        const directionalLight = Alpine.raw(new THREE.DirectionalLight());
        directionalLight.position.set(0, 10, 0);
        this.scene.add(directionalLight);

        new OrbitControls(this.camera, this.renderer.domElement);

        const gltfLoader = Alpine.raw(new GLTFLoader());
        gltfLoader.load("./assets/models/demo-tent/scene.gltf", (gltf) => {
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.scale.set(5, 5, 5);
                }
            });
            this.scene.add(Alpine.raw(gltf.scene))
        });

        this.renderer.domElement.addEventListener("pointerup", this.HandlePointerDown.bind(this));

        this.renderer.setAnimationLoop(() => {
            this.renderer.render(Alpine.raw(this.scene), Alpine.raw(this.camera))
            if (this.snap) {
                this.ExportTexture()
                this.snap = false
            }
        });
    },

    HandlePointerDown(event: PointerEvent) {
        const parentBoundings = this.$refs.configurator.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((event.clientX - parentBoundings.left) / this.$refs.configurator.clientWidth) * 2 - 1,
            -((event.clientY - parentBoundings.top) / this.$refs.configurator.clientHeight) * 2 + 1,
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, Alpine.raw(this.camera));

        const intersects = raycaster.intersectObjects(Alpine.raw(this.scene.children), true);
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            this.selectedObjectName = clickedObject.name;
        }
    },

    UpdateProduct() {
        const obj = this.scene.getObjectByName(this.selectedObjectName);
        if (obj instanceof THREE.Mesh) {
            obj.material.color.set(this.selectedColor);
        }
    },

    ChangeSize() {
        const [width, length] = this.selectedSize.split('x').map(Number);
        this.scene.getObjectByName("Tent_M_Tent_0")?.scale.set(width, 5, length);
        this.scene.getObjectByName("Tent_M_Tent_0_1")?.scale.set(width, 5, length);
    },

    ExportTexture() {
        const exportedTexture = this.renderer.domElement.toDataURL("image/png");
        console.log(exportedTexture); // Send to server or download
    }
}))