import * as THREE from "three";

export enum Direction {
    Front,
    Backward,
    Right,
    Left,
    Up,
    Down
}

export default class Cell
{
    public position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)
    public neighbours: Map<Direction, Cell> = new Map<Direction, Cell>()
    public visited: boolean = false
    public walls: Map<Direction, boolean> = new Map<Direction, boolean>([
        [Direction.Front, true],
        [Direction.Backward, true],
        [Direction.Left, true],
        [Direction.Right, true],
        [Direction.Up, true],
        [Direction.Down, true],
    ])

    constructor(x: number, y: number, z: number) {
        this.position = new THREE.Vector3(x, y, z)
    }

    public AddNeighbour(direction: Direction, cell: Cell) {
        this.neighbours.set(direction, cell)
    }

    public GetUnvisitedNeighbours(): Cell[] {
        let unvisited: Cell[] = []
        this.neighbours.forEach(neighbour => {
            if (!neighbour.visited) {
                unvisited.push(neighbour)
            }
        })
        return unvisited
    }

    public RemoveWall(Direction: Direction)
    {
        this.walls.set(Direction, false)
    }
}