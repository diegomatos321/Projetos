import * as THREE from 'three';

export default interface IScene {
    key: string;
    scene: THREE.Scene;
    mainCamera: THREE.PerspectiveCamera;
    Start(): void;
    Update(dt: number): void;
}