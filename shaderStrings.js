const shaders = [

`
        #ifdef GL_ES
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
        }`,



` #ifdef GL_FRAGMENT_PRECISION_MEDIUM
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(void) {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 middle = u_resolution.xy/2.0;

  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;
  float dx = abs(middle.x - x);
  float dy = abs(middle.y - y);

  float distance = sqrt(pow(dx, 2.0) +
    pow(dy, 2.0));

  vec3 rgb = hsb2rgb(vec3(
    pow(distance * 0.01, abs(tan(u_time))),
    0.9,
    0.9-distance*0.001));

  gl_FragColor = vec4(rgb, 1.0);
}`,



`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

/*
Function for making an box. nc: normalized coordinates.
howBig: specifies how big the box should be. 
A bigger value equals a smaller box, while smaller value equals bigger box. 
Value range(sirka): 0.0 to 0.5
howmuddy: Is for specifying how much space-smoothstep should be on the border of the box
A value of 0.0 will give a straight line-that is to say no gradient.
value range: 0.0 to 1.0 (depends on size of box if tis visible or not)
*/

float makeFilledBox(vec2 nc, float howBig, float howMuddy) {

    vec2 bl = smoothstep(vec2(howBig), vec2(howBig + howMuddy), nc);
   
    vec2 tr = smoothstep(vec2(howBig), vec2(howBig + howMuddy), 1.0 - nc);
    
    return bl.x * bl.y * tr.x * tr.y;

}

/*
Makes an outline of a box.
Position: value range: 0.0 to 0.49. Determines how far from edge of canvas the box should be. 0.0 will be on the edge while higher values go more towards middle
and therefore makes also a smaller box.
thickness: determines how thick the outline of the box is. value range: 0.0 to 0.49
*/
float makeOutlineBox(vec2 nc, float position, float thickness) {
    
    //float anim = abs(sin(u_time))/1.0;
    float anim = u_time/10.0;
 
    float positionInvert = 1.0 - position;
    
    //This is the animation, absolutely must remove if the goal is to make outline box.
    position -= anim;
    positionInvert += anim;
    

    //The last step in b: 1.0 - nc.x rotates the canvas 180 degrees
    float b = step(position, nc.y) - step(position + thickness, nc.y) - step(positionInvert, nc.x) - step(positionInvert, 1.0 - nc.x);
    float t = step(positionInvert - thickness, nc.y) - step(positionInvert, nc.y) - step(positionInvert, nc.x) - step(positionInvert, 1.0 - nc.x);
    float r = step(positionInvert - thickness, nc.x) - step(positionInvert, nc.x) - step(positionInvert, nc.y) - step(positionInvert, 1.0 - nc.y);
    float l = step(position, nc.x) - step(position + thickness, nc.x) - step(positionInvert, nc.y) - step(positionInvert, 1.0 - nc.y);

    return b+t+r+l;

}


void main() {

    vec2 nc = gl_FragCoord.xy/u_resolution;

    vec4 finalColor = vec4(0.0, 0.0, 0.0, 0.0);

    //Everything under 0.1 will be 0.0, anything over will be 1.0
    //float left = step(0.1, nc.x);
    //float bottom = step(0.1, nc.y);
    //float anim = abs(sin(u_time));

    //float oBox = makeOutlineBox(nc, 0.0, 0.01);
    //float oBox2 = makeOutlineBox(nc, 0.1, 0.01);

    float inc = 0.0;
    const int maximum = 200;
    //inc += 0.1;

    vec3 colorInHSb = vec3(0.47, 1.0, 1.0);
    
    for (int i = 0; i < maximum; i++) {
       
        float ooo = makeOutlineBox(nc, inc, 0.02);
        inc += 0.1;
        finalColor = mix(finalColor, vec4(hsb2rgb(colorInHSb), 1.0), ooo);
        
    }

    //blFloat += makeOutlineBox(nc, 0.0, 0.01);
    //finalColor += blFloat; //* vec3(0.149, 0.0, 1.0);
    
    //finalColor = oBox * vec3(0.149, 0.0, 1.0);
    //finalColor = mix(finalColor, vec3(0.149, 0.0, 1.0), oBox2);

    gl_FragColor = finalColor;
}`,



`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time; 

void main() {

    vec2 nc = gl_FragCoord.xy/u_resolution;

    vec3 baseColor = vec3(0.9882, 0.0, 0.0);
    vec3 blueStripe = vec3(0.0, 0.0, 1.0);
    vec3 whiteStripe = vec3(1.0);

    float whiteHorizontal = step(0.6, nc.y) - step(0.75, nc.y);
    float blueHorizontal = step(0.63, nc.y) - step(0.72, nc.y);

    float whiteVertical = step(0.4, nc.x) - step(0.6, nc.x);
    float blueVertical = step(0.44, nc.x) - step(0.56, nc.x);
    
    //Animation transition beetween colors
    baseColor = mix(baseColor, blueStripe, sin(u_time));
    
    baseColor = mix(baseColor, whiteStripe, whiteHorizontal);
    baseColor = mix(baseColor, whiteStripe, whiteVertical);
    
    //Animation transition between colors
    blueStripe = mix(blueStripe, vec3(1.0, 0.0, 0.0), sin(u_time));

    baseColor = mix(baseColor, blueStripe, blueHorizontal);
    baseColor = mix(baseColor, blueStripe, blueVertical);
    //OBS-Note: Basecolor here in the end is a composiiton of different colors, not just one, one for each pixel though.
    
    /*
    Hmmmmmmmmmmmmm? Code below not really woeking at not blending the
    baseColor = (1.0 - blueHorizontal) * (1.0 - blueVertical) * (1.0 - whiteHorizontal) * (1.0 - whiteVertical) * baseColor +
    whiteHorizontal * whiteStripe + 
    whiteVertical * whiteStripe +
    blueHorizontal * blueStripe +
    blueVertical * blueStripe;
    */
    gl_FragColor = vec4(baseColor, 1.0);


}`,



`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float sinc( float x, float k ){
  float a = 3.1459265359 * k * x - 1.0;
  
  return sin(a)/a;
}

float testf(float coords, float time) {

  float outputs = coords * time;
  return sin(outputs)/outputs - 0.5; 

}

void main() {
  

  vec2 nc = gl_FragCoord.xy/u_resolution;

  float slowTime = u_time/10.0;

  float wave = nc.x * cos(u_time); 
  float ss = testf(nc.x, sin(u_time));

  float testWave = nc.x - sin(u_time)-0.5;
  testWave = sin(testWave)/testWave-0.4;

  float lineUp = smoothstep(nc.y + 0.005, nc.y, testWave);
  float lineDown = smoothstep(nc.y - 0.005, nc.y, testWave);
  vec3 finalColor = lineUp * vec3(0.0824, 0.8863, 0.2824) + lineDown * vec3(0.2118, 0.051, 0.9216);

  gl_FragColor = vec4(finalColor, 1.0);
   
}`,



`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


void main() {
  
  vec2 nc = gl_FragCoord.xy/u_resolution;
  //Centers the image, eg: makes 0.0 be in the middle.
  nc = nc / vec2(0.5);
  float slowTime = u_time/10.0;

  nc.x = nc.x - u_time;
  float testWave = nc.x;// - sin(u_time)-1.0;
  testWave = sin(testWave)/2.0;

  nc.y = nc.y - 1.0;
  float lineDown = smoothstep(nc.y - 0.07, nc.y, testWave) - smoothstep(nc.y, nc.y + 0.07, testWave);

  vec4 finalColor = vec4(1.0, 1.0, 1.0, 1.0);
  finalColor = mix(finalColor, vec4(0.2118, 0.051, 0.9216, 1.0), lineDown);

  gl_FragColor = finalColor;
   
}`,



`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time; 

vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

//A shaping function
float ease(float inputs) {
    float outputs = 0.5 - pow(max(0.0, abs(inputs) * 2.0 - 1.0), 1.0) - 0.1;
    return outputs;
}

void main() {

    vec2 nc = gl_FragCoord.xy/u_resolution;
    //hsb2rgb simply translates HSB color values to RGB.
    //HSB = Hue, saturation, brightness
    vec3 baseColor = vec3(1.0);

    //Using polar coordinates instead of cartesian
    //Moves image to the middle. f. ex: 0.0 will be moved to 0.5-middle
    vec2 toCenter = vec2(0.5) - nc;
    //vec2 toCenter = nc / vec2(0.5);
    
    //Will return a value between -PI and PI(-3.14 to 3.14)
    //Divide by TWO_pi to get values between -.5 and 0.5 and then 
    //add 0.5 to get us in the range 0.0 to 1.0
    float angle = atan(toCenter.y, toCenter.x);
    angle = angle + sin(u_time)*10.0;

    //The radius will return a maximum of 0.5, because we are calculating distance fomr middle of canvas.
    //So we multiply by two to get a maximum of 1.0(to get the range to be from 0.0 to 1.0)
    float radius = length(toCenter) * 3.0;

    baseColor = hsb2rgb(vec3(angle/TWO_PI, sin(radius), 1.0));


    gl_FragColor = vec4(baseColor, 1.0);

    
}`,



`#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

/*
Function for making an box. nc: normalized coordinates.
howBig: specifies how big the box should be. 
A bigger value equals a smaller box, while smaller value equals bigger box. 
Value range(sirka): 0.0 to 0.5
howmuddy: Is for specifying how much space-smoothstep should be on the border of the box
A value of 0.0 will give a straight line-that is to say no gradient.
value range: 0.0 to 1.0 (depends on size of box if tis visible or not)
*/

float makeFilledBox(vec2 nc, float howBig, float howMuddy) {

    vec2 bl = smoothstep(vec2(howBig), vec2(howBig + howMuddy), nc);
   
    vec2 tr = smoothstep(vec2(howBig), vec2(howBig + howMuddy), 1.0 - nc);
    
    return bl.x * bl.y * tr.x * tr.y;

}

float makeOutlineBox(vec2 nc, float position, float thickness) {
    
    float anim = abs(sin(u_time))/2.0 + 0.1;
    //float thickness = 0.01;
    //Position value range: 0.0 to 1.0. Position determines how far from the edge of the screen outlineBoc should start.
    //float position = 0.1;
    float positionInvert = 1.0 - position;
    position = anim;
    positionInvert = 1.0 - anim;

    //The last step in b: 1.0 - nc.x rotates the canvas 180 degrees
    float b = step(position, nc.y) - step(position + thickness, nc.y) - step(0.9, nc.x) - step(0.9, 1.0 - nc.x);
    float t = step(positionInvert - thickness, nc.y) - step(positionInvert, nc.y) - step(0.9, nc.x) - step(0.9, 1.0 - nc.x);
    float r = step(positionInvert - thickness, nc.x) - step(positionInvert, nc.x) - step(0.9, nc.y) - step(0.9, 1.0 - nc.y);
    float l = step(position, nc.x) - step(position + thickness, nc.x) - step(0.9, nc.y) - step(0.9, 1.0 - nc.y);

    return b+t+r+l;

}


void main() {

    vec2 nc = gl_FragCoord.xy/u_resolution;

    vec3 finalColor = vec3(1.0);

    //Everything under 0.1 will be 0.0, anything over will be 1.0
    //float left = step(0.1, nc.x);
    //float bottom = step(0.1, nc.y);
    float anim = abs(sin(u_time));

    float blFloat = makeOutlineBox(nc, 0.1, 0.01);

    finalColor = blFloat * vec3(anim, anim, anim+0.5);

    gl_FragColor = vec4(finalColor, 1.0);
}`,



];

//export {shaders};