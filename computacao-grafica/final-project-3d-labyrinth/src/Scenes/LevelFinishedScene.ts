import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

import IScene from "../Interfaces/IScene";

export default class LevelFinishedScene implements IScene
{
    public key: string = 'LevelFinished';
    public scene: THREE.Scene;
    public mainCamera: THREE.PerspectiveCamera;

    constructor()
    {
        this.scene = new THREE.Scene();
        this.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.mainCamera.position.set(50, 0, 200);
    }

    Start(): void {
        new RGBELoader().load('./assets/table_mountain_1_2k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture
        });

        const fontLoader = new FontLoader();
        fontLoader.load("./assets/helvetiker_regular.typeface.json", (font) => {
            const geometry = new TextGeometry("Maze completed!", {
                font: font,
                size: 16,
                depth: 5,
                curveSegments: 12,
                // bevelEnabled: true,
                // bevelThickness: 10,
                // bevelSize: 8,
                // bevelOffset: 0,
                // bevelSegments: 5
            } );

            const textMesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ));
            textMesh.position.set(0,0,0)
            this.scene.add(textMesh)
        });
    }

    Update(dt: number): void { }

    Stop() {}
}