import * as THREE from 'three';
import Maze from '../Maze';

export default class Player extends THREE.Object3D
{
    public camera: THREE.PerspectiveCamera;

    private scene: THREE.Scene;
    private maze: Maze;
    
    private isAnimating: boolean = false;

    constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, maze: Maze)
    {
        super();
        
        this.scene = scene;
        this.camera = camera;
        this.maze = maze;

        window.document.addEventListener('keydown', (e) => this.HandlePlayerMovement(e.code));
        window.document.addEventListener('pointerdown', this.OnPointerDown.bind(this));
    }

    public Update()
    {
        this.camera.position.set(this.position.x, this.position.y + .5, this.position.z);
        this.camera.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    }

    private OnPointerDown(event: PointerEvent): void
    {
        if (event.button !== 0) return;

        const posX = (event.clientX / window.innerWidth) * 2 - 1;
        const posY = -(event.clientY / window.innerHeight) * 2 + 1;

        if (posX < -0.5) {
            this.HandlePlayerMovement('KeyA');
        } else if (posX > 0.5) {
            this.HandlePlayerMovement('KeyD');
        }
        
        if (posY < -0.5) {
            this.HandlePlayerMovement('ShiftLeft');
        } else if (posY > 0.5) {
            this.HandlePlayerMovement('Space');
        }

        if (posX >= -0.5 && posX <= 0.5 && posY >= -0.5 && posY <= 0.5) {
            this.HandlePlayerMovement('KeyW');
        }
    }

    private async HandlePlayerMovement(command: string): Promise<void>
    {
        if (this.isAnimating) {
            return;
        }

        this.isAnimating = true;
        switch (command) {
            case 'KeyW':
            case 'ArrowUp':
                {
                    const forward = new THREE.Vector3();
                    this.getWorldDirection(forward); 
                    forward.normalize()
                    forward.multiplyScalar(-1)
                    const raycaster = new THREE.Raycaster(new THREE.Vector3(this.position.x, this.position.y + .5, this.position.z), forward, 0, 1);
                    raycaster.camera = this.camera
                    const intersects = raycaster.intersectObjects(this.scene.children);
                    const hitWall = intersects.find(intersect => intersect.object.name === 'wall');
                    if (hitWall === undefined) {
                        await this.SmoothMovement(-1);
                    }
                }
                break;
            case 'KeyS':
            case 'ArrowDown':
                {
                    const forward = new THREE.Vector3();
                    this.getWorldDirection(forward); 
                    const raycaster = new THREE.Raycaster(this.camera.position, forward, 0, 1);
                    raycaster.camera = this.camera
                    const intersects = raycaster.intersectObjects(this.scene.children);
                    const hitWall = intersects.find(intersect => intersect.object.name === 'wall');
                    if (hitWall === undefined) {
                        await this.SmoothMovement(1);
                    }
                }
                break;
            case 'KeyA':
            case 'ArrowLeft':
                await this.SmoothRotation(Math.PI / 2);
                break;
            case 'KeyD':
            case 'ArrowRight':
                await this.SmoothRotation(-Math.PI / 2);
                break;
            case 'Space':
                if (this.position.y >= this.maze.floors - 1) {
                    break;
                }

                {
                    const raycaster = new THREE.Raycaster(this.camera.position, new THREE.Vector3(0,1,0), 0, 1);
                    raycaster.camera = this.camera
                    const intersects = raycaster.intersectObjects(this.scene.children);
                    const hitWall = intersects.find(intersect => intersect.object.name === 'wall');
                    if (hitWall === undefined) {
                        await this.SmoothRotation(Math.PI / 2, new THREE.Vector3(1, 0, 0));
                        await this.SmoothMovement(-1);
                        await this.SmoothRotation(-Math.PI / 2, new THREE.Vector3(1, 0, 0));
                    }
                }

                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                if (this.position.y <= 0) {
                    break;
                }

                {
                    const raycaster = new THREE.Raycaster(this.camera.position, new THREE.Vector3(0,-1,0), 0, 1);
                    raycaster.camera = this.camera
                    const intersects = raycaster.intersectObjects(this.scene.children);
                    const hitWall = intersects.find(intersect => intersect.object.name === 'wall');
                    if (hitWall === undefined) {
                        await this.SmoothRotation(-Math.PI / 2, new THREE.Vector3(1, 0, 0));
                        await this.SmoothMovement(-1);
                        await this.SmoothRotation(Math.PI / 2, new THREE.Vector3(1, 0, 0));
                    }
                }

                break;
        }

        this.isAnimating = false;
    }

    private async SmoothMovement(distance: number): Promise<void> {
        const duration = 250; // Animation duration in milliseconds
        let startTime: number | null = null;
        const startPosition = this.position.clone(); // Clone initial position
        
        const direction = new THREE.Vector3();
        this.getWorldDirection(direction); // Get forward direction
        direction.normalize(); // Normalize direction vector
        
        const finalPosition = startPosition.clone().addScaledVector(direction, distance);

        return new Promise((resolve, reject) => {
            const animate = (currentTime: number): void => {
                if (startTime === null) startTime = currentTime;
        
                const timeElapsed = currentTime - startTime;
                let t = Math.min(timeElapsed / duration, 1); // Normalize t to range [0, 1]
        
                // Interpolate between start and final position
                this.position.lerpVectors(startPosition, finalPosition, t);

                if (t < 1) {
                    window.requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            window.requestAnimationFrame(animate);
        })    
    }

    private async SmoothRotation(angle: number, axis: THREE.Vector3 = new THREE.Vector3(0, 1, 0)): Promise<void> {
        // this.rotateY(angle)
        // return

        const duration = 250; // Rotation duration in ms
        let startTime: number | null = null;
        
        // Convert current rotation to quaternion
        const startQuaternion = this.quaternion.clone();
        
        // Compute the target rotation
        const rotationQuaternion  = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(axis, angle);
        
        // Multiply to get the correct final target rotation
        const targetQuaternion = startQuaternion.clone().multiply(rotationQuaternion);
        
        return new Promise((resolve, reject) => {
            const animate = (currentTime: number): void => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                let t = Math.min(timeElapsed / duration, 1); // Normalized time factor
                
                // Spherical interpolation between current and target rotation
                this.quaternion.slerpQuaternions(startQuaternion, targetQuaternion, t);
        
                if (t < 1) {
                    window.requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            window.requestAnimationFrame(animate);
        })
    }
    
}