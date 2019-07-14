
//An array named "shaders" from the js file shaderStrings has been loaded in with an html script tag.
//It contains source code for all the shaders.
let canvas = document.createElement("canvas");
canvas.width = 1000;
canvas.height = 800;

//Create new instance of GlslCanvas module and link it to our canvas.
let sandbox = new GlslCanvas(canvas);
sandbox.load(shaders[0]);

//Append our glslCanvas to html, programmitacally created
document.body.appendChild(canvas);

//Starts at 1 since the first shader[0] is already loaded.
let shaderIndex = 0;

//Creating a counter showing on number what shader you are on and how many are in total
let sInfo = document.createElement("h5");
sInfo = shaders.length;
document.body.append(sInfo);



function changeShader() {

  if (event.code == "ArrowRight" && shaderIndex < shaders.length - 1) {

    shaderIndex += 1;
    sandbox.load(shaders[shaderIndex]);
    console.log("ArrowRight pressed");
    console.log(shaderIndex);
    
  }

  if (event.code == "ArrowLeft" && shaderIndex > 0) {

    shaderIndex -= 1;
    sandbox.load(shaders[shaderIndex]);
    console.log("ArrowLeft pressed");
    console.log(shaderIndex);
    
  }
}

//Adding eventlistener for detecting a keypress.
//The first parameter: is an string for a specified event. See all events possible here: https://developer.mozilla.org/en-US/docs/Web/Events
document.addEventListener("keyup", changeShader);




/*
let canvas = document.createElement("canvas");
let sandbox = new GlslCanvas(canvas);

let ss = window.glslCanvases;

console.log(ss);

console.log(sandbox);
console.log(typeof(sandbox));

console.log(sandbox.fragmentString);

//Returns a list of all elements with the name "glslCanvas"
let shaderCanvases = document.getElementsByClassName("glslCanvas");
//Initiating array of the data-fragment attribute.
let shaderStringAttributes = [];
//Populating array with the data-fragment attributes values.
for (i = 0; i < shaderCanvases.length; i++) {
  shaderStringAttributes.push(shaderCanvases[i].attributes[1]);
}

//const string_frag_code = "main(){\ngl_FragColor = vec4(1.0);\n}\n";

//setAttributes method updates an nodes attribute value. params: (attribute name, new value) 
//shaderCanvases[2].setAttribute("data-fragment", string_frag_code);
//console.log(shaderStringAttributes[2]);

*/

//let d = new Date();
//console.log(d.getSeconds());

/*
//Code here creates a canvas and adds it to the html via javascript
var canvas = document.createElement("canvas");
canvas.height = 800;
canvas.width = 600;

const shaderCanvas = document.getElementsByClassName("glslCanvas");
console.log(typeof(shaderCanvas));
console.log(shaderCanvas);
console.log(shaderCanvas[2].width);
console.log(window.outerWidth);
console.log(window.screen.width);

*/

/*
//Resizes canvas dynamically if the browser detects a change in the windows widht and height
//Wont be using it here for my shader site, but useful for later.

function resizeCanvas() {
  shaderCanvas[0].width = window.innerWidth;
  shaderCanvas[0].height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);

/*

//document.body.appendChild(canvas);

//const cc = window.GlslCanvas.canvas;
//cc.width = 20;
//cc.height = document.height;

//Part of the GlslCanvas library
var sandbox = new GlslCanvas(canvas);


var string_frag_code = `#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time; 

void main() {

    vec2 nc = gl_FragCoord.xy/u_resolution;
    float c = pow(min(cos(PI * nc.x / 2.0), 1.0 - abs(nc.x)), 0.5);
    //c = c + sin(u_time);
    c = clamp(c, abs(sin(u_time)), abs(cos(u_time)));
    float line = smoothstep(nc.y - 0.02, nc.y, c) - 
    smoothstep(nc.y, nc.y + 0.02, c);
    
    vec3 green = vec3(0.302, 0.9216, 0.3529);
    vec3 red = vec3(0.9, 0.0, 0.0);

    //Old, Whole line is just one color, no changes
    //vec3 color = line * vec3(0.302, 0.9216, 0.3529);

    //Old, whole line changes color equally along every pixel
    //vec3 color = line * mix(green, red, abs(tan(u_time)));

    //New with smoothstep so tthat color changes in an gradient way
    vec3 color = line * mix(green, red, smoothstep(0.0, abs(tan(u_time)), nc.x));

    gl_FragColor = vec4(color, 1.0);
}`;

//Load the shader into our GlslCanvas
sandbox.load(string_frag_code);



/*

var sun = new Image();
var moon = new Image();
var earth = new Image();
function init() {
  sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
  moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
  earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
  window.requestAnimationFrame(draw);
}

var ctx = document.getElementById('tutorial').getContext('2d');

function draw() {

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, 300, 300); // clear canvas

  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.strokeStyle = 'rgba(0, 153, 255, 0.4)';
  ctx.save();
  ctx.translate(150, 150);

  // Earth
  var time = new Date();
  ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds());
  ctx.translate(105, 0);
  ctx.fillRect(0, -12, 40, 24); // Shadow
  ctx.drawImage(earth, -12, -12);

  // Moon
  ctx.save();
  ctx.rotate(((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds());
  ctx.translate(0, 28.5);
  ctx.drawImage(moon, -3.5, -3.5);
  ctx.restore();

  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Earth orbit
  ctx.stroke();
 
  ctx.drawImage(sun, 0, 0, 300, 300);

  window.requestAnimationFrame(draw);
}

init();

*/


