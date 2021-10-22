export function CollisionHandler (ball, gameObject, deltaTime)
{
    let topOfBall = ball.position.y;
    let bottomOfBall = ball.position.y + ball.size;
    let leftOfBall = ball.position.x;
    let rightOfBall = ball.position.x + ball.size;


    let topOfGameObject = gameObject.position.y;
    let leftSideOfGameObject = gameObject.position.x;
    let rightSideOfGameObject = gameObject.position.x + gameObject.width;
    let bottomOfGameObject = gameObject.position.y + gameObject.height;

    let distanceBT = topOfGameObject - bottomOfBall;
    let distanceLR = leftOfBall - rightSideOfGameObject;
    let distanceRL= leftSideOfGameObject - rightOfBall;
    let distanctTB = topOfBall - bottomOfGameObject;

    if(distanceBT - ball.speed.y / deltaTime <= 0 &&
        distanceBT >= -ball.speed.y / deltaTime &&
        rightOfBall >= leftSideOfGameObject &&
        leftOfBall <= rightSideOfGameObject)
    {
        //console.log("EM CIMA");
        ball.position.y = topOfGameObject - ball.size;
        ball.speed.y = ball.maxSpeed.y * (Math.random() * (1.5 - 0.7) + 0.7)
        return true;
    } 
    else if(distanctTB + ball.speed.y / deltaTime <= 0 &&
        distanctTB >= ball.speed.y / deltaTime &&
        rightOfBall >= leftSideOfGameObject &&
        leftOfBall <= rightSideOfGameObject)
    {
        //console.log("EM BAIXO");
        ball.position.y = bottomOfGameObject;
        ball.speed.y = -ball.maxSpeed.y * (Math.random() * (1.5 - 0.7) + 0.7)
        return true;
    }
    if(distanceLR + ball.speed.x / deltaTime <= 0 &&
        distanceLR >= (ball.speed.x - gameObject.speed) / deltaTime &&
        bottomOfBall >= topOfGameObject &&
       topOfBall <= bottomOfGameObject)
    {
        //console.log("DIREITA");
        ball.position.X = rightSideOfGameObject;
        ball.speed.x = ball.maxSpeed.x * (Math.random() * (1.5 - 0.7) + 0.7)
        return true;
    }
    else if(distanceRL - ball.speed.x / deltaTime <= 0 &&
        distanceRL >= (-ball.speed.x + gameObject.speed) / deltaTime &&
        bottomOfBall >= topOfGameObject &&
       topOfBall <= bottomOfGameObject)
     {
        //console.log("ESQUERDA");
        ball.position.x = leftSideOfGameObject - ball.size;
        ball.speed.x = -ball.maxSpeed.x * (Math.random() * (1.5 - 0.7) + 0.7)
        return true;
    }
    return false;
}