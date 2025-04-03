import * as THREE from 'three';
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

import Maze from '../Maze';
import { Direction } from '../Entities/Cell';
import Player from '../Entities/Player';
import IScene from '../Interfaces/IScene';

export default class MazeLevelScene implements IScene{
    public key: string = 'MazeLevelScene';
    public scene: THREE.Scene = new THREE.Scene();
    public mainCamera: THREE.PerspectiveCamera;

    private entities: THREE.Object3D[] = [];

    private maze!: Maze;
    private player: Player;

    constructor() {
        this.scene = new THREE.Scene();

        this.mainCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.player = new Player(this.scene, this.mainCamera, this.maze);
        // this.player.add(this.mainCamera)
        this.entities.push(this.player);
    }

    Start(args: any) {
        new RGBELoader().load('./assets/table_mountain_1_2k.hdr', (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture
        });

        if (args) {
            if (args.mode === 'easy') {
                const randomRows = Math.min(Math.floor(Math.random() * 15) + 1, 5);
                const randomCols = Math.min(Math.floor(Math.random() * 15) + 1, 5);

                this.maze = new Maze(randomRows, randomCols, 1);
            } else if (args.mode === 'medium') {
                const randomRows = Math.min(Math.floor(Math.random() * 15) + 1, 5);
                const randomCols = Math.min(Math.floor(Math.random() * 15) + 1, 5);

                this.maze = new Maze(randomRows, randomCols, 3);
            } else if (args.mode === 'hard') {
                const randomRows = Math.min(Math.floor(Math.random() * 30) + 1, 10);
                const randomCols = Math.min(Math.floor(Math.random() * 30) + 1, 10);
                const randomFloors = Math.min(Math.floor(Math.random() * 30) + 1, 5);

                this.maze = new Maze(randomRows, randomCols, randomFloors);
            }
        } else {
            this.maze = new Maze(10, 10, 3);
        }

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
                    this.player.rotateY(-Math.PI);
                    break;
                case Direction.Left:
                    this.player.rotateY(Math.PI / 2);
                    break;
                case Direction.Right:
                    this.player.rotateY(-Math.PI / 2);
                    break;
                default:
                    break;
            }
        }
    }

    Update() {
        const exit = this.maze.mazeGrid[this.maze.floors - 1][this.maze.rows - 1][this.maze.cols - 1];
        const distanceToExit = this.player.position.distanceTo(new THREE.Vector3(exit.position.x, exit.position.z, exit.position.y))

        if (distanceToExit < 0.1) {
            window.dispatchEvent(new CustomEvent('ChangeScene', { detail: { sceneKey: 'LevelFinished' } }));         
        }
        this.player.Update();
    }

    Stop() {
        this.player.Dispose();
    }
}