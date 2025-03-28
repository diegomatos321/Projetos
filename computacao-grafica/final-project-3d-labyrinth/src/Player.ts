import * as THREE from 'three';

export default class Player extends THREE.Object3D
{
    public camera: THREE.PerspectiveCamera;

    private scene: THREE.Scene;

    constructor(scene: THREE.Scene)
    {
        super();
        
        this.scene = scene;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        window.document.addEventListener('keydown', this.OnKeyDown.bind(this));
    }

    public Update()
    {
        this.camera.position.set(this.position.x, this.position.y + .5, this.position.z);
        this.camera.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    }

    isAnimating = false;
    private async OnKeyDown(event: KeyboardEvent): Promise<void> {
        if (this.isAnimating) {
            return;
        }
        
        this.isAnimating = true;
        console.dir(event.key)
        switch (event.key) {
            case 'w':
                await this.SmoothMovement(-1);
                break;
            case 's':
                await this.SmoothMovement(1);
                break;
            case 'a':
                await this.SmoothRotation(Math.PI / 2);
                break;
            case 'd':
                await this.SmoothRotation(-Math.PI / 2);
                break;
            case ' ':
                await this.SmoothRotation(Math.PI / 2, new THREE.Vector3(1, 0, 0));
                await this.SmoothMovement(-1);
                await this.SmoothRotation(-Math.PI / 2, new THREE.Vector3(1, 0, 0));
                // this.position.y += 1
                break;
            case 'Shift':
                await this.SmoothRotation(-Math.PI / 2, new THREE.Vector3(1, 0, 0));
                await this.SmoothMovement(-1);
                await this.SmoothRotation(Math.PI / 2, new THREE.Vector3(1, 0, 0));

                // this.position.y -= 1
                break;
        }

        console.dir(this.position)
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