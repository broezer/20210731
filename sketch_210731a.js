const Y_AXIS = 1;
const X_AXIS = 2;
let c1, c2, c3;
let b1, b2, b3;

let cols02, rows02;
let scl02 = 100;
let w02 = 1600;
let h02 = 1600;



function setup() {
   createCanvas(400, 400, WEBGL);
   kitten = createGraphics(400,1600);
   c1 = color(255, 10, 36);
   c2 = color(255, 36, 117);
   c3 = color(255, 18, 216);
   
   b1 = color(0, 0, 0);
   b2 = color(153, 227, 209);
   b3 = color(0, 0, 0);

   t1 = color(39, 255, 253);
   t2 = color(255, 255, 253);
   t3 = color(100, 100, 200);

   cols02 = w02 / scl02;
   rows02 = h02 / scl02;
    

   setGradient(0, 0 , width , height , b3, b2, b1, Y_AXIS);
   push();
   kitten.rectMode(CENTER);
   kitten.fill(0);
   kitten.translate(width * 0.5, height * 0.5, 0);
   kitten.circle(0, 0, width * 0.5);
   pop();
  
   image(kitten, 0, 0);
   makeDithered(kitten, 1.4);
   image(kitten, width * -0.5, height * -0.5);
   
}

function draw() {
  noFill();
  stroke(t2);
 
  translate(0, 0, width*-3);
  rotateZ(-QUARTER_PI);
  box(width/2);
  push();
    translate(width*-1, 0, 0);
    box(width/1);
    translate(width*2, 0, 0);
    box(width/1);
  pop();
  push();
    translate(0, height*-1, 0);
    box(width/1);
    translate(0, height*2, 0);
    box(width/1);
  pop();
  
  translate(0, 0, width*-2);
  rotateZ(-QUARTER_PI);
  sphere(width/2);
  box(width/2);
  
 
  
  save("20210731.png");
  noLoop();
  
  
}

function setGradient(x, y, w, h, c1, c2, c3, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, (y + h) - ((h/2)), 0, 1);
      let c = lerpColor(c1, c2, inter);
      
      let inter02 = map(i, (y + h) - ((h/2)) ,  y + h , 0, 1);
      let p = lerpColor(c2, c3, inter02);
      
      kitten.stroke(255);
      kitten.line(x, i, x + w, i);
      
      if ( i <= (y + h) - ((h/2))){
        kitten.stroke(c);
        kitten.line(x, i, x + w, i);
      }else{
        kitten.stroke(p);
        kitten.line(x, i, x + w, i);
      }
      
      
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x,(x + w) - (w/2), 0, 1);
      let c = lerpColor(c1, c2, inter);
      
      let inter02 = map(i, (x + w) - (w/2), x + w, 0, 1);
      let p = lerpColor(c2, c3, inter02);
      
      kitten.stroke(255);
      kitten.line(i, y, i, y + h);
      if ( i <= (x + w) - (w/2)){
        kitten.stroke(c);
        kitten.line(i, y, i, y + h);
      }else{
        kitten.stroke(p);
        kitten.line(i, y, i, y + h);
      }
      
    }
  }
}

function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}

function getColorAtindex(img, x, y) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  let red = pix[idx];
  let green = pix[idx + 1];
  let blue = pix[idx + 2];
  let alpha = pix[idx + 3];
  return color(red, green, blue, alpha);
}

function setColorAtIndex(img, x, y, clr) {
  let idx = imageIndex(img, x, y);

  let pix = img.pixels;
  pix[idx] = red(clr);
  pix[idx + 1] = green(clr);
  pix[idx + 2] = blue(clr);
  pix[idx + 3] = alpha(clr);
}

// Finds the closest step for a given value
// The step 0 is always included, so the number of steps
// is actually steps + 1
function closestStep(max, steps, value) {
  return round(steps * value / 255) * floor(255 / steps);
}

function makeDithered(img, steps) {
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let clr = getColorAtindex(img, x, y);
      let oldR = red(clr);
      let oldG = green(clr);
      let oldB = blue(clr);
      let newR = closestStep(255, steps, oldR);
      let newG = closestStep(255, steps, oldG);
      let newB = closestStep(255, steps, oldB);

      let newClr = color(newR, newG, newB);
      setColorAtIndex(img, x, y, newClr);

      let errR = oldR - newR;
      let errG = oldG - newG;
      let errB = oldB - newB;

      distributeError(img, x, y, errR, errG, errB);
    }
  }

  img.updatePixels();
}

function distributeError(img, x, y, errR, errG, errB) {
  addError(img, 7 / 16.0, x + 1, y, errR, errG, errB);
  addError(img, 3 / 16.0, x - 1, y + 1, errR, errG, errB);
  addError(img, 5 / 16.0, x, y + 1, errR, errG, errB);
  addError(img, 1 / 16.0, x + 1, y + 1, errR, errG, errB);
}

function addError(img, factor, x, y, errR, errG, errB) {
  if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
  let clr = getColorAtindex(img, x, y);
  let r = red(clr);
  let g = green(clr);
  let b = blue(clr);
  clr.setRed(r + errR * factor);
  clr.setGreen(g + errG * factor);
  clr.setBlue(b + errB * factor);

  setColorAtIndex(img, x, y, clr);
}
