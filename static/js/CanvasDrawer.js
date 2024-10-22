class CanvasDrawer {
    SIZE = 450;
    LINE_WIDTH = 2;
    TEXT_SIZE = 20;
    TEXT_MARGIN = 15;
    TEXT_LINE_HEIGHT = 3;
    COLOR_RED = "#D18189"
    COLOR_GREEN = "#58d263"
    pointsList = [];

    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.ctx.font = `${this.TEXT_SIZE}px Soyuz Grotesk`
    }
    addPoint(point){
        this.pointsList.push(point)
    }

    redrawAll(r=1) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawGraph(r);
        this.drawAxes();
        this.setPointerAtDot(5);
        this.setPointerAtDot(1);

        this.pointsList.forEach(point => {
            this.drawPoint(point.x, point.y, point.success === "success")
        })
    }

    drawAxes() {
        this.ctx.fillStyle = "black";
        this.drawArrow(-this.SIZE, this.SIZE / 2, this.SIZE, this.SIZE / 2);
        this.drawArrow(this.SIZE / 2, this.SIZE, this.SIZE / 2, 0);
    }

    drawGraph(r) {
        const totalPoints = 12;
        const pointInPixels = this.SIZE / totalPoints;
        this.ctx.fillStyle = "#b5c7e0";

        this.ctx.beginPath();
        this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r * pointInPixels);
        this.ctx.lineTo(this.SIZE / 2 + (r) * pointInPixels, this.SIZE / 2 - r * pointInPixels);
        this.ctx.lineTo(this.SIZE / 2 + (r ) * pointInPixels, this.SIZE / 2);
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 + r  * pointInPixels);
        this.ctx.lineTo(this.SIZE / 2 + r/2 * pointInPixels, this.SIZE / 2);
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(
            this.SIZE / 2,
            this.SIZE / 2,
            r/2 * pointInPixels,

            3*Math.PI/2,
            Math.PI,
            true
        );
        this.ctx.moveTo(this.SIZE / 2, this.SIZE / 2);
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2 - r/2 * pointInPixels);
        this.ctx.lineTo(this.SIZE / 2 - r/2 * pointInPixels, this.SIZE / 2);
        this.ctx.lineTo(this.SIZE / 2, this.SIZE / 2);
        this.ctx.fill();
    }

    setPointerAtDot(max_r = 5) {
        const totalPoints = 12;
        const pointInPixels = this.SIZE / totalPoints;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText(`${max_r}`, this.SIZE / 2 + pointInPixels * max_r, this.SIZE / 2 - this.TEXT_MARGIN);
        this.ctx.fillText(`${max_r}`, this.SIZE / 2 + this.TEXT_MARGIN, this.SIZE / 2 - pointInPixels * max_r);

        this.ctx.beginPath()
        this.ctx.lineWidth = this.LINE_WIDTH;
        this.ctx.moveTo(this.SIZE / 2 + pointInPixels * max_r, this.SIZE / 2 + this.TEXT_LINE_HEIGHT);
        this.ctx.lineTo(this.SIZE / 2 + pointInPixels * max_r, this.SIZE / 2 - this.TEXT_LINE_HEIGHT);
        this.ctx.moveTo(this.SIZE / 2 + this.TEXT_LINE_HEIGHT, this.SIZE / 2 - pointInPixels * max_r);
        this.ctx.lineTo(this.SIZE / 2 - this.TEXT_LINE_HEIGHT, this.SIZE / 2 - pointInPixels * max_r);
        this.ctx.stroke();
        // this.ctx.fillText(`-${max_r}`, this.SIZE / 2 - pointInPixels * max_r, this.SIZE / 2 - this.TEXT_MARGIN);
        // this.ctx.fillText(`-${max_r}`, this.SIZE / 2 + this.TEXT_MARGIN, this.SIZE / 2 + pointInPixels * max_r);
    }

    drawArrow(fromx, fromy, tox, toy) {
        var headlen = 10; // length of head in pixels
        var dx = tox - fromx;
        var dy = toy - fromy;
        var angle = Math.atan2(dy, dx);
        this.ctx.beginPath();
        this.ctx.lineWidth = this.LINE_WIDTH;
        this.ctx.moveTo(fromx, fromy);
        this.ctx.lineTo(tox, toy);
        this.ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(tox, toy);
        this.ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }

    drawPoint(x, y, success) {
        this.ctx.fillStyle = success
            ? this.COLOR_GREEN
            : this.COLOR_RED;
        const totalPoints = 12;
        const pointInPixels = this.SIZE / totalPoints;
        this.ctx.beginPath();
        this.ctx.arc(
            this.SIZE / 2 + pointInPixels * x,
            this.SIZE / 2 - y * pointInPixels,
            5,
            0,
            Math.PI * 2,
        );
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = "black"
        this.ctx.lineWidth = 1.5
        this.ctx.arc(
            this.SIZE / 2 + pointInPixels * x,
            this.SIZE / 2 -  y * pointInPixels,
            5,
            0,
            Math.PI * 2
        )
        this.ctx.stroke();
    }
    drawBOOM(x, y){
        const totalPoints = 12;
        const pointInPixels = this.SIZE / totalPoints;
        this.ctx.beginPath();
        const boomImage = new Image();
        boomImage.src = '../resources/boom.png';
        boomImage.onload = () => {
            this.ctx.drawImage(
                boomImage,
                this.SIZE / 2 + pointInPixels * x - 45,
                this.SIZE / 2 - y * pointInPixels - 45,
                90,
                90
            );
    }}
}