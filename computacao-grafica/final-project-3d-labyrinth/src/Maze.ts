import * as THREE from "three"
import Cell, { Direction } from "./Entities/Cell"

export default class Maze
{
    rows: number = 0
    cols: number = 0
    floors: number = 0
    mazeGrid: Cell[][][] = []

    constructor(rows: number, cols: number, floors: number) {
        this.rows = rows
        this.cols = cols
        this.floors = floors

        for (let z = 0; z < floors; z++) {
            let floor: Cell[][] = []
            for (let y = 0; y < rows; y++) {
                let row: Cell[] = []
                for (let x = 0; x < cols; x++) {
                    row.push(new Cell(x, y, z))
                }
                floor.push(row)
            }
            this.mazeGrid.push(floor)
        }

        for (let floor = 0; floor < floors; floor++) {
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const cell = this.mazeGrid[floor][y][x]
    
                    if (x > 0) {
                        cell.AddNeighbour(Direction.Left, this.mazeGrid[floor][y][x - 1])
                    }
    
                    if (x < cols - 1) {
                        cell.AddNeighbour(Direction.Right, this.mazeGrid[floor][y][x + 1])
                    }
    
                    if (y > 0) {
                        cell.AddNeighbour(Direction.Front, this.mazeGrid[floor][y - 1][x])
                    }
    
                    if (y < rows - 1) {
                        cell.AddNeighbour(Direction.Backward, this.mazeGrid[floor][y + 1][x])
                    }

                    if (floor > 0) {
                        cell.AddNeighbour(Direction.Down, this.mazeGrid[floor - 1][y][x])
                    }

                    if (floor < floors - 1) {
                        cell.AddNeighbour(Direction.Up, this.mazeGrid[floor + 1][y][x])
                    }
                }
            }
        }
    }

    public Generate(): void {
        const initialCell = this.RandomCell()
        this.RecursiveBacktracker(initialCell);
    }

    public RenderMaze(scene: THREE.Scene) {
        this.mazeGrid.forEach((floor) => {
            floor.forEach(row => {
                row.forEach(cell => {
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
    
                    scene.add(group);
                    // this.entities.push(group);
                })
            })
        })

        const exit = this.mazeGrid[this.floors - 1][this.rows - 1][this.cols - 1];
        const exitImage = new THREE.TextureLoader().load('./assets/exit.png');
        const exitMaterial = new THREE.SpriteMaterial({ map: exitImage });
        const sprite = new THREE.Sprite(exitMaterial);
        sprite.position.set(exit.position.x, exit.position.z + .5, exit.position.y);
        sprite.scale.set(0.5, 0.5, 0.5);
        scene.add(sprite);
    }

    private RecursiveBacktracker(cell: Cell): void {
        cell.visited = true

        while (true) {
            const unvisitedNeighbours = cell.GetUnvisitedNeighbours()
            if (unvisitedNeighbours.length === 0) {
                break
            }
    
            const randomNeighbour = unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)]
            if (randomNeighbour.position.x > cell.position.x) {
                cell.RemoveWall(Direction.Right)
                randomNeighbour.RemoveWall(Direction.Left)
            } else if (randomNeighbour.position.x < cell.position.x) {
                cell.RemoveWall(Direction.Left)
                randomNeighbour.RemoveWall(Direction.Right)
            } else if (randomNeighbour.position.y > cell.position.y) {
                cell.RemoveWall(Direction.Front)
                randomNeighbour.RemoveWall(Direction.Backward)
            } else if (randomNeighbour.position.y < cell.position.y) {
                cell.RemoveWall(Direction.Backward)
                randomNeighbour.RemoveWall(Direction.Front)
            } else if (randomNeighbour.position.z > cell.position.z) {
                cell.RemoveWall(Direction.Up)
                randomNeighbour.RemoveWall(Direction.Down)
            } else if (randomNeighbour.position.z < cell.position.z) {
                cell.RemoveWall(Direction.Down)
                randomNeighbour.RemoveWall(Direction.Up)
            }

            this.RecursiveBacktracker(randomNeighbour)
        }  
    }

    private RandomCell(): Cell {
        const x = Math.floor(Math.random() * this.cols)
        const y = Math.floor(Math.random() * this.rows)
        const floor = Math.floor(Math.random() * this.floors)

        return this.mazeGrid[floor][y][x]
    }
}