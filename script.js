
//An array named "shaders" from the js file shaderStrings has been loaded in with an html script tag.
//It contains source code for all the shaders.
let canvas = document.createElement("canvas");
//console.log(window.innerWidth);
//console.log(window.devicePixelRatio);
//console.log( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
//My laptop was set to dpi of 125%(1.25) therefore the canvas size got all messed up
if (window.innerWidth < 1000 || window.devicePixelRatio > 1.26) {
  canvas.style.width = "750px";
  canvas.style.height = "550px";
  canvas.style.marginLeft = "10px";
  
} else {
  canvas.style.width = "1000px";
  canvas.style.height = "800px";
}


/*Putting the size of cnavas into the css instead of directl(canvas.width = 1000)
Seems to jave fixed alot. Fixet atleast the 125% scaling on my laptop.
The html-canvas-width&height seem to follow the CSS units. But those units dictate the clipspace coords rendering res inside canvas,
while CSS will always display the canvas in 1000x800 no matter what. So the CSS units is more the rendering res in the whole document, outside of the canvas */
//canvas.style.width = "1000px";
//canvas.style.height = "800px";


//Create new instance of GlslCanvas module and link it to our canvas.
let sandbox = new GlslCanvas(canvas);
sandbox.load(shaders[0]);

//console.log(glslCanvases[0]);
//sandbox.resume();
// So that I can make arrow-canvases a child of a element i put the 3 canvas inside this div
//JSDoc doc of an variable:
/**@description A div tag contaaining all canvases on the page
 * @type {object}. An <div> tag.
 */
const canvasDiv = document.createElement("div");
canvasDiv.id = "SCanvas";

//Keyboard informational
let keyboardCanvasRight = document.createElement("canvas");
keyboardCanvasRight.width = 50;
keyboardCanvasRight.height = 75;
keyboardCanvasRight.id = "keyInfoRight";
keyboardCanvasRight.title = "You can use arrow keys aswell!"

//Creating a drawing object on our canvas
const ctxRight = keyboardCanvasRight.getContext("2d");
ctxRight.fillStyle = "DarkSlateGrey";
ctxRight.moveTo(5, 5);
ctxRight.lineTo(50, keyboardCanvasRight.height/2);
ctxRight.lineTo(5, 70);
//stroke is used to actually draw or line. It will just draw the lines, so it will be an outline drawing
//ctx.stroke();
//Fill is similiar to stroke except that it will fill the drawn area with the color deined in ctx.fillstyle
ctxRight.fill();

let keyboardCanvasLeft = document.createElement("canvas");
keyboardCanvasLeft.width = 50;
keyboardCanvasLeft.height = 75;
keyboardCanvasLeft.id = "keyInfoLeft";
keyboardCanvasLeft.title = "You can use arrow keys aswell!"

const ctxLeft = keyboardCanvasLeft.getContext("2d");
ctxLeft.fillStyle = "DarkSlateGrey";
ctxLeft.moveTo(45, 5);
ctxLeft.lineTo(5, keyboardCanvasLeft.height/2);
ctxLeft.lineTo(45, 70);
ctxLeft.fill();

/*
  Animating with JS so that when mouse is over canvas, then change color. onmouseout is when not hovering, while onmouseover is hovering.
  Cant do it in CSS sinxe i am drawing the arrow onto canvas with canvas drawing tools. I use onmouseout to set it back to the
  initial color so that the OlivrDrab color doesnt get stuck on there once user hovers once over the canvas.

  OBS: This is the same as doing:
  keyboardCanvasRight.addEventListener("mouseover", function); Like I did with other elements.
  Its just another way of adding a function to an eventlistener. In the other cases I named my function "changeShader", while
  the function here is just directly passed in without a name.
*/
keyboardCanvasRight.onmouseout = function() {

  ctxRight.fillStyle = "DarkSlateGrey";
  ctxRight.fill();

};

keyboardCanvasRight.onmouseover = function() {
  
  ctxRight.fillStyle = "OliveDrab";
  ctxRight.fill();

};

keyboardCanvasLeft.onmouseout = function() {

  ctxLeft.fillStyle = "DarkSlateGrey";
  ctxLeft.fill();

};

keyboardCanvasLeft.onmouseover = function() {
  
  ctxLeft.fillStyle = "OliveDrab";
  ctxLeft.fill();

};

//appending our 3 canvases to be childen of canvasDiv
canvasDiv.appendChild(keyboardCanvasLeft);
canvasDiv.appendChild(canvas);
canvasDiv.appendChild(keyboardCanvasRight);

//Returns an HTMLCollection consisiting of 1 element, our footer.
const footer = document.getElementsByTagName("footer");
//console.log(footer[0]);
/*
Appending our canvasDiv to the body of the html document. I could use appendChild() here
but then the footer would be before all our canvases in the document, which we dont want.
insertBefore does the same as appendChild only that it specifies where we should appens it.
In this case we want to append our canvases before the footer.
*/
document.body.insertBefore(canvasDiv, footer[0]);
//console.log(canvasDiv.parentElement);
//Starts at 1 since the first shader[0] is already loaded.
let shaderIndex = 0;

//Creating a counter showing on number what shader you are on and how many are in total.
//Using template string to achieve this. with the ${variable} its easy to insert a variable value.
//innerText attribute is the actual text content of the <p> tag.
let shaderCountInfo = document.createElement("p");
shaderCountInfo.id = "shaderCountInfo";
shaderCountInfo.innerText = `${shaderIndex + 1} / ${shaders.length}`;
//appending to be child of the canvasDiv div.
document.body.insertBefore(shaderCountInfo, footer[0]);

//JSDoc syntax, this one simply describes the function

/** @description Main goal here is to either increase or decrease the global variable shaderIndex in order to change the current shader.
 * This is achieved by either pressing arrowRight-arrowLeft on the keboard or by clicking on canvases that represent arrows.
 */
function changeShader() {
  //event.target tells us where the click came from, we want it to run if it came from keyboardCanvasRight element
  if ((event.code === "ArrowRight" || event.target === keyboardCanvasRight) && shaderIndex < shaders.length - 1) {
    /*
    Found out that somehow GlslCanvas library is running all shaders in shaders array at once!
    This we dont want to happen because of perfromance(and some shaders have limited time of operation). There is no "refresh" function in the library
    so only way I found to fix this is to use the destroy function to clear out everything and then
    assing sandbox to a brand new instance of the class, this way everything is refreshed and reloaded
    when user changes shader.
    */
    sandbox.destroy();
    sandbox = new GlslCanvas(canvas);
    shaderIndex += 1;
    sandbox.load(shaders[shaderIndex]);
    //console.log("ArrowRight pressed");
    //console.log(shaderIndex);
    //Updating shaderCountInfo to reflect the new reality when shader is changed.
    shaderCountInfo.innerText = `${shaderIndex + 1} / ${shaders.length}`;
  }

  if ((event.code === "ArrowLeft" || event.target === keyboardCanvasLeft) && shaderIndex > 0) {
    sandbox.destroy();
    sandbox = new GlslCanvas(canvas);

    shaderIndex -= 1;
    sandbox.load(shaders[shaderIndex]);
    //console.log("ArrowLeft pressed");
    //console.log(shaderIndex);

    shaderCountInfo.innerText = `${shaderIndex + 1} / ${shaders.length}`;
    
  }

  //console.log(event.target);
}

//Adding eventlistener for detecting a keypress.
//The first parameter: is an string for a specified event. See all events possible here: https://developer.mozilla.org/en-US/docs/Web/Events
document.addEventListener("keyup", changeShader);
keyboardCanvasLeft.addEventListener("click", changeShader);
keyboardCanvasRight.addEventListener("click", changeShader);

