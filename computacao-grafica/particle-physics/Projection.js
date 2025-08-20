export default class Projection
{
    constructor(v0, v1) {
        this.v0 = v0
        this.v1 = v1
    }

    overlap(other) {
        return false
    }
}