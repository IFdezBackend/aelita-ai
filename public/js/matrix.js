const canvas = document.querySelector('.matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = '01';
const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

const symbolImage = new Image();
symbolImage.src = 'img/symbol.png';

let symbolMaskCanvas = document.createElement('canvas');
let symbolMaskCtx = symbolMaskCanvas.getContext('2d');
let maskReady = false;
let symbolSize = 600;

symbolImage.onload = () => {
  symbolMaskCanvas.width = symbolSize;
  symbolMaskCanvas.height = symbolSize;
  symbolMaskCtx.clearRect(0, 0, symbolSize, symbolSize);
  symbolMaskCtx.drawImage(symbolImage, 0, 0, symbolSize, symbolSize);
  maskReady = true;
  animate();
};

function drawMatrixWithMask() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--matrix-color');
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    const text = letters[Math.floor(Math.random() * letters.length)];

    let draw = true;

    if (maskReady) {
      const cx = Math.floor(x - canvas.width / 2 + symbolSize / 2);
      const cy = Math.floor(y - canvas.height / 2 + symbolSize / 2 + 90);

      if (cx >= 0 && cx < symbolSize && cy >= 0 && cy < symbolSize) {
        const alpha = symbolMaskCtx.getImageData(cx, cy, 1, 1).data[3];
        if (alpha > 20) draw = false;
      }
    }

    if (draw) ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
    drops[i]++;
  }
}

function animate() {
  drawMatrixWithMask();
  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
