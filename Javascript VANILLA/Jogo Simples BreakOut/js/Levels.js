import Brick from "./Brick.js"

export function buildLevel(game, level)
{
    let bricks = [];
    level.forEach((linha, linhaIndex) => {
        linha.forEach((brick, brickIndex) => {
            if (brick == 1)
            {
                let position = 
                {
                    x: brickIndex * 80,
                    y: 32 + linhaIndex * 20
                };

                bricks.push(new Brick(game, position))
            }
        });
    });

    return bricks;
}

export const LEVEL1 = 
[
    [1,0,1,1,1,0,1,0],
    [0,1,1,1,1,1,1,1],
    [1,0,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1]
]

export const LEVEL2 = 
[
    [1,1,0,1,0,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,1,1,1,0],
    [0,1,0,1,1,0,0,1],
    [0,1,1,0,1,1,0,0],
    [1,1,0,0,0,0,1,1],
    [1,0,0,1,0,1,0,1]
]