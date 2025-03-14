export default function CollisionHandler(object01, object02, callback, context){
    if (object01._position.getX() + object01.width*object01.origin.x >= object02._position.getX() - object02.width*object02.origin.x &&
        object01._position.getX() - object01.width*object01.origin.x <= object02._position.getX() + object02.width*object02.origin.x &&
        object01._position.getY() - object01.height*object01.origin.y <= object02._position.getY() + object02.height*object02.origin.y &&
        object01._position.getY() + object01.height*object01.origin.y >= object02._position.getY() - object02.height*object02.origin.y) {
            callback.call(context, object01, object02);
    }
}