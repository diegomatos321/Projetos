import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import IScene from "../Interfaces/IScene";
import Maze from "../Maze";

export default class MenuScene implements IScene
{
    public key: string = 'MenuScene';
    public scene: THREE.Scene;
    public mainCamera: THREE.PerspectiveCamera;

    private maze: Maze;
    private modeclickCallback!: (event: Event) => void

    constructor()
    {
        this.scene = new THREE.Scene();
        this.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.mainCamera.position.set(12, 7, 12);
        this.mainCamera.lookAt(5, 0, 5);

        this.maze = new Maze(10, 10, 3);
    }

    Start(): void {
        const menuHud = document.getElementById('menu')
        if (menuHud) {
            menuHud.style.display = 'flex';

            this.modeclickCallback = this.OnModeClick.bind(this);
            menuHud.querySelector('#easy')?.addEventListener('click', this.modeclickCallback);
            menuHud.querySelector('#medium')?.addEventListener('click', this.modeclickCallback);
            menuHud.querySelector('#hard')?.addEventListener('click',  this.modeclickCallback);
        }

        new RGBELoader().load('./assets/table_mountain_1_2k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture
        });

        this.maze.Generate();
        this.maze.RenderMaze(this.scene);
    }

    Update(dt: number): void {
        this.mainCamera.position.x = 5+ 12*Math.cos(-dt/1000 * 0.4)
        this.mainCamera.position.z = 5+ 12*Math.sin(-dt/1000 * 0.4)
        this.mainCamera.lookAt(5, 0, 5);
    }

    Stop(): void {
        const menuHud = document.getElementById('menu')
        if (menuHud) {
            menuHud.style.display = 'none';
            menuHud.querySelector('#easy')?.removeEventListener('click', this.modeclickCallback);
            menuHud.querySelector('#medium')?.removeEventListener('click', this.modeclickCallback);
            menuHud.querySelector('#hard')?.removeEventListener('click',  this.modeclickCallback);
        }
    }

    private OnModeClick(event: Event): void {
        const target = event.target as HTMLElement;
        const mode = target.id;
        this.HandleModeSelect(mode);
    }

    private HandleModeSelect(mode: string) {
        const menuHud = document.getElementById('menu')
        if (menuHud) {
            menuHud.style.display = 'none';
            window.dispatchEvent(new CustomEvent('ChangeScene', { detail: { sceneKey: 'MazeLevelScene', args: { mode } } }));
        }
    }
}