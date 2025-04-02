import * as THREE from 'three';
import IScene from './Interfaces/IScene';

export default class Game
{
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private sceneList: IScene[];
    private currentScene: IScene;

    private clock: THREE.Clock = new THREE.Clock();

    constructor(sceneList: IScene[] = [])
    {
        this.sceneList = sceneList;
        this.currentScene = sceneList[0];

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.scene = this.currentScene.scene;
        this.camera = this.currentScene.mainCamera;

        this.Start();
    }

    public Start()
    {
        this.currentScene.Start();

        this.renderer.setAnimationLoop(this.Update.bind(this));
        window.addEventListener('ChangeScene', (event: CustomEvent) => {
            const newSceneKey = event.detail;
            const newScene = this.sceneList.find(scene => scene.key === newSceneKey);
            if (newScene) {
                // this.scene.remove(this.currentScene.scene);
                // this.renderer.setAnimationLoop(null);
                this.currentScene = newScene;
                this.scene = this.currentScene.scene;
                this.camera = this.currentScene.mainCamera;

                this.currentScene.Start();
                this.renderer.setAnimationLoop(this.Update.bind(this));
            }
        })
    }

    public Update(dt: number)
    {
        this.currentScene.Update(dt);

        this.renderer.render(this.scene, this.camera);
    }
}