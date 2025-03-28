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

        this.maze = new Maze(10, 10, 3);
        this.player = new Player(this.scene);
        this.mainCamera = this.player.camera;
        this.entities.push(this.player);
    }

    public Start() {
        this.maze.Generate();
        this.maze.mazeGrid.forEach(this.RenderMaze.bind(this));

        const firstCell = this.maze.mazeGrid[0][0][0];
        this.player.position.set(firstCell.position.x, firstCell.position.z, firstCell.position.y);
        
        const firstNeighbour = firstCell.neighbours.entries().next().value;
        if (firstNeighbour) {
            switch (firstNeighbour[0]) {
                case Direction.Front:
                    break;
                case Direction.Backward:
                    // this.player.rotateY(-Math.PI);
                    this.player.rotateY(-Math.PI);
                    break;
                case Direction.Left:
                    // this.player.rotateY(Math.PI / 2 );
                    this.player.rotateY(Math.PI / 2);
                    break;
                case Direction.Right:
                    // this.player.rotateY(-Math.PI / 2);
                    this.player.rotateY(-Math.PI / 2);
                    break;
                default:
                    break;
            }
        }

        const exit = this.maze.mazeGrid[this.maze.floors - 1][this.maze.rows - 1][this.maze.cols - 1];
        const exitImage = new THREE.TextureLoader().load('./assets/exit.png');
        const exitMaterial = new THREE.SpriteMaterial({ map: exitImage });
        const sprite = new THREE.Sprite(exitMaterial);
        sprite.position.set(exit.position.x, exit.position.z + .5, exit.position.y);
        sprite.scale.set(0.5, 0.5, 0.5);
        this.scene.add(sprite);

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

    private RenderMaze(floors: Cell[][]) {
        floors.forEach((floor) => {
            floor.forEach(cell => {
                const group = new THREE.Group();
                group.position.set(cell.position.x, cell.position.z, cell.position.y);

                cell.walls.forEach((value, key) => {
                    if (value === false) {
                        return
                    }

                    const wallGeometry = new THREE.PlaneGeometry();
                    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    const wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);

                    switch (key) {
                        case Direction.Front:
                            wallMesh.position.set(0, 0.5, 0.5);
                            wallMesh.material.color = new THREE.Color(0xffc0cb)
                            wallMesh.rotateY(-Math.PI);

                            break;
                        case Direction.Backward:
                            wallMesh.position.set(0, 0.5, -0.5);
                            // wallMesh.rotateY(-Math.PI);
                            break;
                        case Direction.Left:
                            wallMesh.position.set(-0.5, .5, 0);
                            wallMesh.material.color = new THREE.Color(0x0000ff)
                            wallMesh.rotateY(Math.PI / 2);

                            break;
                        case Direction.Right:
                            wallMesh.position.set(0.5, 0.5, 0);
                            wallMesh.material.color = new THREE.Color(0xffff00)
                            wallMesh.rotateY(-Math.PI / 2);

                            break;
                        case Direction.Up:
                            wallMesh.position.set(0, 1, 0);
                            wallMesh.rotateX(Math.PI / 2);
                            break;
                        case Direction.Down:
                            if (cell.walls.get(Direction.Up) === true) {
                                wallMesh.material.color = new THREE.Color(0x00ff00)
                            } else {
                                wallMesh.material.color = new THREE.Color(0xffffff)
                            }

                            wallMesh.position.set(0, 0, 0);
                            wallMesh.rotateX(-Math.PI / 2);

                            break;
                        }
                    group.add(wallMesh);
                })

                if (cell.walls.get(Direction.Up) === false) {
                    const arrowImage = new THREE.TextureLoader().load('./assets/arrow.png');
                    const arrowMaterial = new THREE.SpriteMaterial({ map: arrowImage });
                    const sprite = new THREE.Sprite(arrowMaterial);
                    sprite.position.set(.2, .5, 0);
                    sprite.scale.set(0.5, 0.5, 0.5);
                    group.add(sprite);
                }

                if (cell.walls.get(Direction.Down) === false) {
                    const arrowImage = new THREE.TextureLoader().load('./assets/arrow.png');
                    const arrowMaterial = new THREE.SpriteMaterial({ map: arrowImage });
                    const sprite = new THREE.Sprite(arrowMaterial);
                    sprite.position.set(-.2, .5, 0);
                    sprite.scale.set(0.5, 0.5, 0.5);
                    sprite.material.rotation = Math.PI;
                    group.add(sprite);
                }

                this.scene.add(group);
                this.entities.push(group);
            })
        })
    }
}