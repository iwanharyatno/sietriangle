const canvas = document.getElementById('displayCanvas');
const renderingContext = canvas.getContext('2d');

const numsIteration = document.getElementById('numsIteration');
const intervalPerDots = document.getElementById('intervalPerDots');
const drawingProgressField = document.getElementById('drawingProgressField');
const drawingProgressElement = document.getElementById('drawingProgressElement');
const saveAsImageButton = document.getElementById('saveAsImageButton');

const app = new App(canvas.width, canvas.height, renderingContext);
app.drawingProgressField = drawingProgressField;
app.drawingProgressElement = drawingProgressElement;
app.init();

app.onBeforeDraw = function() {
  saveAsImageButton.disabled = true;
}
app.onDrawing = function(limit, currIteration) {
  const percentages = Math.floor(currIteration * 100 / limit);

  this.drawingProgressElement.value = currIteration;
  this.drawingProgressElement.max = limit;

  this.drawingProgressField.innerText = `${currIteration}/${limit} (${percentages}%)`;
}
app.onAfterDraw = function() {
  saveAsImageButton.disabled = false;
}

app.iterate(numsIteration.value, intervalPerDots.value);
numsIteration.onchange = function() {
  app.iterate(this.value, intervalPerDots.value);
}
intervalPerDots.onchange = function() {
  app.iterate(numsIteration.value, this.value);
}

saveAsImageButton.onclick = function() {
  const type = 'image/jpeg';
  const a = document.createElement('a');
  a.download = `sierpinski triangle ${numsIteration.value}it.${type.split('/')[1]}`;
  a.href = canvas.toDataURL(type).replace(type, 'image/octet-stream');

  a.click();
}
