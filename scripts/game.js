const track = document.getElementById("track");
const inputL = document.getElementById("inputL");
const inputR = document.getElementById("inputR");
const roadImg=document.getElementById("road");
const ctx = track.getContext("2d");


function eventDHandle(event){
    switch(event.key){
        case 'w':SPEED+=0.4;break
        case 's':SPEED-=1;break
    }

};
function eventUHandle (event){

};

document.addEventListener("keydown", eventDHandle);
document.addEventListener("keyup", eventUHandle);

let i =-20;
const FPS=60
let SPEED=3
function drawRoad(){
    if(SPEED>0) SPEED-=0.1
    else SPEED=0
    if(i>track.height/2-20)i=-20;
    i+=SPEED/10;
    ctx.fillStyle="black"
    ctx.fillRect(0,0,track.width,track.height)
    ctx.fillStyle="white"
    ctx.fillRect(track.width/2,i,10,20)
    ctx.fillStyle="white"
    ctx.fillRect(track.width/2,i+track.height/2,10,20)
    ctx.fillStyle="white"
    ctx.fillRect(track.width/2,i+track.height,10,20)
}
function render(){
    clearCanvas()
    inputL.innerHTML=`SPEED : ${SPEED.toFixed(0)}`;
    drawRoad()
    ctx.fillStyle="red"
    ctx.fillRect(180,50,30,20)
    setTimeout(render,1000/FPS);
}
render()

// canvas functions 
function clearCanvas(){
    ctx.clearRect(0,0,track.width,track.height);
}