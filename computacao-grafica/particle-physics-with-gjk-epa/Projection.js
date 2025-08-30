export default class Projection
{
    constructor(min, max) {
        this.min = min
        this.max = max
    }

    overlaps(other) {
        if (this.max >= other.min && other.max >= this.min) {
            return Math.min(this.max, other.max) - Math.max(this.min, other.min);
        }

        return 0
    }
}