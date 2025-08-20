export default class Projection
{
    constructor(min, max) {
        this.min = min
        this.max = max
    }

    overlap(other) {
        return this.max >= other.min && other.max >= this.min
        // return !(this.min > other.max || other.min > this.max);
    }
}