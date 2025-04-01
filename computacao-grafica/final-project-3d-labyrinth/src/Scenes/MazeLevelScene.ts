import * as THREE from 'three';

import Maze from '../Maze';
import { Direction } from '../Entities/Cell';
import Player from '../Entities/Player';
import IScene from '../Interfaces/IScene';

export default class MazeLevelScene implements IScene{
    public key: string = 'MazeLevelScene';
    public scene: THREE.Scene = new THREE.Scene();
    public mainCamera: THREE.PerspectiveCamera;

    private entities: THREE.Object3D[] = [];

    private maze: Maze;
    private player: Player;

    constructor() {
        this.scene = new THREE.Scene();

        this.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        let lightDir = new THREE.DirectionalLight(0xffffff, 1);
        lightDir.position.set(1, 1, 1);
        this.scene.add(lightDir)

        let lightAmb = new THREE.AmbientLight(0x303030);
        this.scene.add(lightAmb)

        this.maze = new Maze(10, 10, 3);
        this.player = new Player(this.scene, this.mainCamera);
        // this.player.add(this.mainCamera)
        this.entities.push(this.player);
    }

    public Start() {
        this.maze.Generate();
        this.maze.RenderMaze(this.scene);

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
    }

    public Update() {
        const exit = this.maze.mazeGrid[this.maze.floors - 1][this.maze.rows - 1][this.maze.cols - 1];
        if (this.player.position.x === exit.position.x && this.player.position.y === exit.position.z && this.player.position.z === exit.position.y) {
            console.log('Level finished!');
            window.dispatchEvent(new CustomEvent('ChangeScene', { detail: 'LevelFinished' }));         
        }
        this.player.Update();
    }
}