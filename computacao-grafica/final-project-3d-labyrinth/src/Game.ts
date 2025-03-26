import * as THREE from 'three';

import Maze from './Maze';
import Cell, { Direction } from './Cell';
import Player from './Player';

export default class Game {
    private entities: THREE.Object3D[] = [];
    private scene: THREE.Scene;
    private mainCamera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    private maze: Maze;
    private player: Player;

    constructor() {
        this.scene = new THREE.Scene();
        // this.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // this.controls = new OrbitControls( this.mainCamera, this.renderer.domElement );

        let lightDir = new THREE.DirectionalLight(0xffffff, 1);
        lightDir.position.set(1, 1, 1);
        this.scene.add(lightDir)

        let lightAmb = new THREE.AmbientLight(0x303030);
        this.scene.add(lightAmb)

        this.maze = new Maze(10, 10);
        this.player = new Player(this.scene);
        this.mainCamera = this.player.camera;
        this.entities.push(this.player);
    }

    public Start() {
        this.maze.Generate();
        this.maze.mazeGrid.forEach(this.RenderMaze.bind(this));

        const firstCell = this.maze.mazeGrid[0][0];
        this.mainCamera.position.set(firstCell.position.x, .5, firstCell.position.y);
        const firstNeighbour = firstCell.neighbours.entries().next().value;
        if (firstNeighbour) {
            switch (firstNeighbour[0]) {
                case Direction.Front:
                    break;
                case Direction.Backward:
                    // this.player.rotateY(-Math.PI);
                    this.mainCamera.rotateY(-Math.PI);
                    break;
                case Direction.Left:
                    // this.player.rotateY(Math.PI / 2 );
                    this.mainCamera.rotateY(Math.PI / 2 );
                    break;
                case Direction.Right:
                    // this.player.rotateY(-Math.PI / 2);
                    this.mainCamera.rotateY(-Math.PI / 2);
                    break;
                default:
                    break;
            }
        }

        this.renderer.setAnimationLoop(this.Update.bind(this));
    }

    public Update() {
        this.entities.forEach(entity => {
            if (entity instanceof Player) {
                entity.Update();
            }
        })
        this.renderer.render(this.scene, this.mainCamera);
    }

    private RenderMaze(row: Cell[]) {
        row.forEach(cell => {
            const group = new THREE.Group();
            group.position.set(cell.position.x, 0, cell.position.y);

            const floor = new THREE.PlaneGeometry();
            const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const floorMesh = new THREE.Mesh(floor, floorMaterial);
            floorMesh.position.set(0, 0, 0);
            floorMesh.rotateX(-Math.PI / 2);

            group.add(floorMesh);

            cell.walls.forEach((value, key) => {
                if (value === false) {
                    return
                }

                const wallGeometry = new THREE.PlaneGeometry();
                const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
                const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
                wallMesh.position.set(0, 0, 0);

                switch (key) {
                    case Direction.Front:
                        wallMesh.position.set(0, 0.5, 0.5);
                        // wallMesh.rotateX(Math.PI / 2);
                        break;
                    case Direction.Backward:
                        wallMesh.position.set(0, 0.5, -0.5);
                        // wallMesh.rotateX(-Math.PI / 2);
                        break;
                    case Direction.Left:
                        wallMesh.position.set(-0.5, 0.5, 0);
                        wallMesh.rotateY(Math.PI / 2);
                        break;
                    case Direction.Right:
                        wallMesh.position.set(0.5, 0.5, 0);
                        wallMesh.rotateY(-Math.PI / 2);
                        break;
                }

                group.add(wallMesh);
            })

            this.scene.add(group);
            this.entities.push(group);
        })
    }
}