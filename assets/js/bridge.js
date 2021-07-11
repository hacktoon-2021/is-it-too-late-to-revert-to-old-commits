

/*
Scenes
1: main bridge
2: knuckles cutscene
3: sign cutscene
*/
var scene = 1; 

var startAudio;

var bridgeCanvas;
var bridgeCxt;
// var canvas;
// var ctx;

var bridgePosX = 0;
var bridgePosX2 = 0;
var narutoPosY = 245/500*innerHeight;
var signPostSize = 50/500*innerHeight;
var signPostPosX = -signPostSize;
var signPostPosY = 260/500*innerHeight;

var landPosY = 0;
var landLeftPosX = -800;
var landRightPosX = 800;

var knucklesPosX = 800;
var knucklesPosY = 300/500*innerHeight;

var pointRightX = 800;
var pointRightY = 320/500*innerHeight;

var musicNotPlaying = true;

var distRunX = 0;


var narutoHeight = 80/500*innerHeight;

var mousePos = {
    x: 0,
    y: 0
};

var frame = 1; // to keep track of which animation to render
var knuckleCutsceneFrame = 1;


// starting function
window.onload = function() {
    bridgeCanvas = document.getElementById("bridgeCanvas");
    bridgeCanvas.width = innerWidth;
    bridgeCanvas.height = innerHeight;
    
    bridgeCxt = bridgeCanvas.getContext("2d");

    // canvas = document.getElementById('canvas');
    // ctx = canvas.getContext('2d');

    var framesPerSecond = 24;
	setInterval(function() {
			moveEverything();
			drawEverything();	

            // increment frame
            if (frame === 24) {
                frame = 1;
            } else {
                frame++;
            }
		}, 1000/framesPerSecond);
    
    // add a mouse listener to the canvas
    bridgeCanvas.addEventListener('mousemove',
    function(evt) {
        mousePos = calculateMousePos(evt);
        
    });

    // add a listener for clicks
    bridgeCanvas.addEventListener('mousedown', handleMouseClick);

};

function moveEverything() {

    if (scene == 1) {
        if ((distRunX > -1800/800*innerWidth &&  distRunX < 3400/800*innerWidth) ||
            (distRunX < -1800/800*innerWidth && mousePos.x - bridgeCanvas.width/2 > 0) || 
            (distRunX > 3400/800*innerWidth && mousePos.x - bridgeCanvas.width/2 < 0)
            ) {
            // get new bridge position
            bridgePosX = (bridgePosX + (mousePos.x - bridgeCanvas.width/2)/20)%(bridgeCanvas.width)

            bridgePosX2 = 0;

            if (bridgePosX > 0) {
                bridgePosX2 = bridgeCanvas.width - bridgePosX;
            } else {
                bridgePosX2 = -bridgeCanvas.width - bridgePosX;
            }

            distRunX += (mousePos.x - bridgeCanvas.width/2)/20;
            console.log(distRunX)
        } 

        // get naruto position
        if (mousePos.y < narutoPosY || mousePos.y > narutoPosY + narutoHeight) {
            narutoPosY = narutoPosY + (mousePos.y - narutoPosY) / 5
            if (narutoPosY > 300/500*innerHeight) {
                narutoPosY = 300/500*innerHeight;
            } else if (narutoPosY < 190/500*innerHeight) {
                narutoPosY = 190/500*innerHeight;
            }
        }
    }
        
}

function drawEverything() {
    if (scene == 1) {
        // draw river
        drawCustomImage(bridgeCxt, "../images/bridge/narutoFood.jpg", 0, 0, bridgeCanvas.width, bridgeCanvas.height)

        // draw first bridge layer
        drawCustomImage(bridgeCxt, "../images/bridge/sprite_newbridge0.png", -bridgePosX, 0, bridgeCanvas.width, bridgeCanvas.height)
        
        drawCustomImage(bridgeCxt, "../images/bridge/sprite_newbridge0.png", bridgePosX2, 0, bridgeCanvas.width, bridgeCanvas.height)

        if (narutoPosY > signPostPosY - 20) {
            renderSign();
        }

        // draw characters (between 190 and 300 y)
        // draw naruto
        var narutoFrame = Math.floor((frame/2) % 4);

        if (mousePos.x - bridgeCanvas.width/2 < 0) {
            narutoSrc = "../images/sprites/narutoLeft/narutoLeft_".concat(narutoFrame.toString(), ".png");
        } else {
            narutoSrc = "../images/sprites/narutoRight/narutoRight_".concat(narutoFrame.toString(), ".png");

        }
        
        drawCustomImage(bridgeCxt, narutoSrc, 360/800*innerWidth, narutoPosY, narutoHeight, narutoHeight);

        if (narutoPosY < signPostPosY - 20/500*innerHeight) {
            renderSign();
        }

        renderKnuckles();


        renderNextScene();        

        // draw second bridge layer
        drawCustomImage(bridgeCxt, "../images/bridge/sprite_newbridge1.png", -bridgePosX, 0, bridgeCanvas.width, bridgeCanvas.height)
        drawCustomImage(bridgeCxt, "../images/bridge/sprite_newbridge1.png", bridgePosX2, 0, bridgeCanvas.width, bridgeCanvas.height)

        // Add land on the left
        // if (distRunX < -1600) {
        //     drawCustomImage( )
        // }

        
    } else if (scene == 2) {
        
        // render knuckles scene
        drawCustomImage(bridgeCxt, "../images/bridge/bridgeCutscene.png", 0, 0, bridgeCanvas.width, bridgeCanvas.height)
        if (knuckleCutsceneFrame < 45) {
            knuckleCutsceneFrame++ 
            drawCustomImage(bridgeCxt, "../images/sprites/knuckles/knuckles_1.png", 300/800*innerWidth, 100/500*innerHeight, 300/500*innerHeight, 300/500*innerHeight)
        } else {
            drawCustomImage(bridgeCxt, "../images/sprites/knuckles/knuckles_1.png", -100/800*innerWidth, -130/500*innerHeight, 1000/500*innerHeight, 1000/500*innerHeight)
        }

    } else {
        // render signpost scene
        drawCustomImage(bridgeCxt, "../images/bridge/bridgeCutscene.png", 0, 0, bridgeCanvas.width, bridgeCanvas.height)
        drawCustomImage(bridgeCxt, "../images/bridge/signPost_0.png", 350/800*innerWidth, 150/500*innerHeight, 250/500*innerHeight, 250/500*innerHeight)


    }

}

function renderNextScene() {
    if (distRunX > 3100/800*innerWidth) {
        pointRightX = - distRunX + 4000/800*innerWidth;

        var pointerFrame = Math.floor((frame/4) % 2);
        pointerSrc = "../images/pointLeft/pointLeft_".concat(pointerFrame.toString(), ".png");
        drawCustomImage(bridgeCxt, pointerSrc, pointRightX, pointRightY - signPostSize, signPostSize, signPostSize);
    }
}

function renderSign() {
    // draw sign post
    if (distRunX < -1150/800*innerWidth) {
        signPostPosX = - distRunX - 1200/800*innerWidth;
        drawCustomImage(bridgeCxt, "../images/bridge/signPost_0.png", signPostPosX, signPostPosY, signPostSize, signPostSize);
        
        if (distRunX > - 1650/800*innerWidth && distRunX < -1500/800*innerWidth) {
            var pointerFrame = Math.floor((frame/4) % 2);
            pointerSrc = "../images/pointer/click_".concat(pointerFrame.toString(), ".png");
            drawCustomImage(bridgeCxt, pointerSrc, signPostPosX, signPostPosY - signPostSize, signPostSize, signPostSize);
        }
    }
    
}

function renderKnuckles() {
    // draw knuckles
    if (distRunX > 1100/800*innerWidth) {
        knucklesPosX = - distRunX + 1900/800*innerWidth;
        // draw knuckles
        var knucklesFrame = Math.floor((frame/4) % 2);
        knucklesSrc = "../images/sprites/knuckles/knuckles_".concat(knucklesFrame.toString(), ".png");
        drawCustomImage(bridgeCxt, knucklesSrc, knucklesPosX, knucklesPosY, narutoHeight, narutoHeight);
        
        if (distRunX < 1600/800*innerWidth && distRunX > 1450/800*innerWidth) {
            var pointerFrame = Math.floor((frame/4) % 2);
            pointerSrc = "../images/pointer/click_".concat(pointerFrame.toString(), ".png");
            drawCustomImage(bridgeCxt, pointerSrc, knucklesPosX + 15/500*innerHeight, knucklesPosY - signPostSize +15/800*innerWidth, signPostSize, signPostSize);
        }
    }

}

function drawCustomImage(canvasCxt, imgSrc, x, y, width, height) {
    var customImage = new Image();
    customImage.src = imgSrc;
    canvasCxt.drawImage(customImage, x, y, width, height)
}

function handleMouseClick(evt) {
    if (musicNotPlaying) {
        startAudio = new Audio('../bgm/Unicorn.mp3');
        startAudio.volume = 0.08;
        startAudio.loop = true;
        startAudio.play();
        musicNotPlaying = false;
    }
    
    if (scene != 1) {
        scene = 1;
        knuckleCutsceneFrame = 1;
    } else if (distRunX > - 1650/800*innerWidth && distRunX < -1500/800*innerWidth) {
        // if in range of sign show sign
        scene = 3;
    } else if (distRunX < 1600/800*innerWidth && distRunX > 1450/800*innerWidth) {
        // if in range of knuckles show knuckles
        scene = 2;
        // play the why are you running audio
        var whyRunningAudio = new Audio();
        whyRunningAudio.src = "../audio/why_running.mp3"
        startAudio.pause();
        whyRunningAudio.play();
        musicNotPlaying = true;
    } else if (distRunX > 3200/800*innerWidth) {
        // go to next scene
        console.log("go to next scene")
        location.replace("../themesong/index.html");
    }
}

function calculateMousePos(evt) {
	var rect = bridgeCanvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}