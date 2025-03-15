import Alpine from 'alpinejs';
import { defineComponent } from './utils';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import SweepObject from './Objects/SweepObject';

export default defineComponent(() => ({
    sweepPoints: 20,
    crossSectionPoints: 20,
    catmullRomTension: 0.5,
    twist: 0,
    isClosed: false,
    showWireframe: false,
    showTexture: false,
    showFrenet: false,

    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000),
    
    sweepObject: null as SweepObject | null,

    init() {
        const container = this.$refs.renderer;
        if (container === null) {
            return;
        }
        const width = 800;
        container.style.width = width + "px";
        container.style.height = (width * 9 / 16) + "px";

        this.scene.background = new THREE.Color(0xEEEEEE);
        this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        let lightDir = new THREE.DirectionalLight(0xffffff, 1);
        lightDir.position.set(1, 1, 1);
        this.scene.add(lightDir)

        let lightAmb = new THREE.AmbientLight(0x303030);
        this.scene.add(lightAmb)

        new OrbitControls(this.camera, renderer.domElement);
        
        this.sweepObject = new SweepObject(this.scene);
        this.sweepObject.sweepPoints = this.sweepPoints;
        this.sweepObject.crossSectionPoints = this.crossSectionPoints;
        this.sweepObject.isClosed = this.isClosed;
        this.sweepObject.tension = this.catmullRomTension;
        this.sweepObject.mesh.material.wireframe = this.showWireframe;
        this.sweepObject.UpdateGeometry();

        this.camera.position.z = 5;

        const animate = () => { renderer.render(Alpine.raw(this.scene), Alpine.raw(this.camera)); }
        renderer.setAnimationLoop(animate);
    },

    UpdateObject()
    {
        if (this.sweepObject === null) {
            return;
        }

        this.sweepObject.sweepPoints = this.sweepPoints;
        this.sweepObject.crossSectionPoints = this.crossSectionPoints;
        this.sweepObject.mesh.material.wireframe = this.showWireframe;

        this.sweepObject.isClosed = this.isClosed;
        this.sweepObject.tension = this.catmullRomTension;
        this.sweepObject.UpdateGeometry();
    }
}))
