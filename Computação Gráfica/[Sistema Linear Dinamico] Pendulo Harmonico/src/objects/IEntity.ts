export default interface Entity {
    update(deltaTime: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
}