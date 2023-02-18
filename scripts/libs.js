function Point(x, y) {
  this.x = x;
  this.y = y;

  this.distanceTo = function(anotherPoint) {
    const dx = Math.abs(anotherPoint.x - this.x);
    const dy = Math.abs(anotherPoint.y - this.y);

    const distance = Math.sqrt(dx*dx + dy*dy);
    return distance;
  }

  this.normalize = function() {
    const len = Math.sqrt(x*x + y*y);
    
    const nX = this.x / len;
    const nY = this.y / len;

    return new Point(nX, nY);
  }

  this.add = function(anotherPoint) {
    this.x += anotherPoint.x;
    this.y += anotherPoint.y;
  }

  this.directionTo = function(anotherPoint) {
    const dx = anotherPoint.x - this.x;
    const dy = anotherPoint.y - this.y;

    return new Point(dx, dy).normalize();
  }

  this.multiplyScalar = function(c) {
    this.x *= c;
    this.y *= c;
  }

  this.clone = function() {
    return new Point(this.x, this.y);
  }
}

function randomInt(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function slideTriangle(array) {
  const result = [...array];

  const tmp0 = result[0];
  const tmp1 = result[1];

  result[0] = result[2];
  result[1] = tmp0;
  result[2] = tmp1;

  return result;
}

function App(canvasWidth, canvasHeight, context, pointWidth=1) {
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;

  this.onBeforeDraw = null;
  this.onDrawing = null;
  this.onAfterDraw = null;

  this.ctx = context;

  let points = [
    new Point(canvasWidth - 5, canvasHeight - 5),
    new Point(0, canvasHeight - 5),
    new Point(canvasWidth / 2, 0),
  ];
  let lastPoint = new Point(150, 150);

  this.ctx.fillRect(lastPoint.x, lastPoint.y, pointWidth, pointWidth);

  this.init = () => {
    for (const point of points) {
      this.ctx.fillRect(point.x, point.y, pointWidth, pointWidth);
    }
  }

  let lastTimeout;

  const drawPoints = (limit, interval=30, currIteration=1) => {
    const randomCornerPoint = points[randomInt(0, 2)];
    const distance = lastPoint.distanceTo(randomCornerPoint);
    const newPoint = lastPoint.clone().directionTo(randomCornerPoint);
    newPoint.multiplyScalar(distance / 2);
    newPoint.add(lastPoint);

    if (this.onDrawing) {
      this.onDrawing(limit, currIteration);
    }

    if (currIteration % 4 === 0) points = slideTriangle(points);

    lastPoint = newPoint;

    this.ctx.fillRect(lastPoint.x, lastPoint.y, pointWidth, pointWidth);

    if (currIteration != limit) {
      lastTimeout = setTimeout(
        () => drawPoints(limit, interval, currIteration + 1),
        interval
      );
    } else {
      if (this.onAfterDraw) this.onAfterDraw(limit, interval, currIteration);
    }
  }

  this.iterate = (count, interval) => {
    clearTimeout(lastTimeout);

    this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    this.ctx.fillStyle = "#000000";
    this.init();
    if (this.onBeforeDraw) this.onBeforeDraw(count);
    drawPoints(count, interval);
  }
}
