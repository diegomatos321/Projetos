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
        // @ts-ignore
        window.addEventListener('ChangeScene', (event: CustomEvent) => this.HandleChangeScene(event.detail.sceneKey, event.detail.args));
    }

    public Update(dt: number)
    {
        this.currentScene.Update(dt);

        this.renderer.render(this.scene, this.camera);
    }

    private HandleChangeScene(sceneKey: string, args?: any){
        const newScene = this.sceneList.find(scene => scene.key === sceneKey);
        if (newScene) {
            this.currentScene.Stop();
            this.scene.clear();
            this.renderer.clear();
            // this.renderer.dispose();
            
            this.currentScene = newScene;
            this.scene = this.currentScene.scene;
            this.camera = this.currentScene.mainCamera;

            this.currentScene.Start(args);
        }
    }
}