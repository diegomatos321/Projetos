import Cell, { Direction } from "./Cell"

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