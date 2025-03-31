import * as THREE from "three";
import IScene from "../Interfaces/IScene";
import Maze from "../Maze";

export default class MenuScene implements IScene
{
    public key: string = 'MenuScene';
    public scene: THREE.Scene;
    public mainCamera: THREE.PerspectiveCamera;

    private maze: Maze;

    constructor()
    {
        this.scene = new THREE.Scene();
        this.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.mainCamera.position.set(12, 7, 12);
        this.mainCamera.lookAt(5, 0, 5);

        let lightDir = new THREE.DirectionalLight(0xffffff, 1);
        lightDir.position.set(1, 1, 1);
        this.scene.add(lightDir)

        let lightAmb = new THREE.AmbientLight(0x303030);
        this.scene.add(lightAmb)

        this.maze = new Maze(10, 10, 3);
    }

    Start(): void {
        const menuHud = document.getElementById('menu')
        if (menuHud) {
            menuHud.style.display = 'flex';

            menuHud.querySelector('#start-button')?.addEventListener('click', () => {
                menuHud.style.display = 'none';
                window.dispatchEvent(new CustomEvent('ChangeScene', { detail: 'MazeLevelScene' }));
            })
        }

        this.maze.Generate();
        this.maze.RenderMaze(this.scene);
    }

    Update(dt: number): void {
        this.mainCamera.position.x = 5+ 12*Math.cos(-dt/1000 * 0.4)
        this.mainCamera.position.z = 5+ 12*Math.sin(-dt/1000 * 0.4)
        this.mainCamera.lookAt(5, 0, 5);
    }
}