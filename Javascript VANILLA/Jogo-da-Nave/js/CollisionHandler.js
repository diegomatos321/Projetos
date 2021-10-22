function CollisionHandler(object01, object02) {
    if (object01.position.getX() + object01.width >= object02.position.getX() &&
        object01.position.getX() <= object02.position.getX() + object02.width &&
        object01.position.getY() <= object02.position.getY() + object02.height &&
        object01.position.getY() + object01.height >= object02.position.getY()) {
        return true;
    }
}