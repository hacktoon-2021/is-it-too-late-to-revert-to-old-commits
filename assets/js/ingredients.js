var objectSize = 80;
var ballHTML;
var ballCSS;
var ballJS;

var textNotSpoken = true;
var musicNotStarted = true;

var spawnedBtn = false;

var inBucket = {
    html: false,
    css: false,
    js: false,
    };

// add bodies
var colorA = '#f55a3c',
colorB = '#f5d259';


// define constants for matter.js
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body,
  Composites = Matter.Composites,
  Runner = Matter.Runner,
  Common = Matter.Common,
  Constraint = Matter.Constraint,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Vector = Matter.Vector,
  Events = Matter.Events,
  Composite = Matter.Composite;



window.onload = function() {
    // create an engine
    var engine = Engine.create();

    // get the canvas items from the document
    ingredientsCanvas = document.getElementById("ingredientsCanvas");
    ingredientsCanvas.width = window.innerWidth;
    ingredientsCanvas.height = window.innerHeight;

    console.log(window.innerWidth, window.innerHeight)
    
    IngredientsCxt = ingredientsCanvas.getContext("2d");

    // first render variable
    var render = Render.create({
        element: document.body,
        engine: engine,
        canvas: ingredientsCanvas,
        options: {
            width: window.innerWidth - 20,
            height: window.innerHeight,
            wireframes: false,
            showAngleIndicator: false,
        }
    });

    // add mouse control
    var mouse = Mouse.create(render.ingredientsCanvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.9,
            render: {
                visible: false
            }
        }
    });

    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // objectSize = 5/80*render.canvas.width;

    // create objects with the tech stack on it
    ballHTML = Bodies.circle(27/40*render.canvas.width, 1/6*render.canvas.height, objectSize/2, { 
        isStatic: false,
        render: {
            // visible: false
            fillStyle: '#36c247',
        }
    });
    ballHTML.render.sprite.texture = "../images/badges/htmlCircle.png";
    ballHTML.render.sprite.xScale = 0.15;
    ballHTML.render.sprite.yScale = 0.15;

    ballCSS = Bodies.circle(25/40*render.canvas.width, 5/12*render.canvas.height, objectSize/2, { 
        isStatic: false,
        render: {
            // visible: false
            fillStyle: '#36c247',
        }
    });
    ballCSS.render.sprite.texture = "../images/badges/cssCircle.png";
    ballCSS.render.sprite.xScale = 0.15;
    ballCSS.render.sprite.yScale = 0.15;

    ballJS = Bodies.circle(20/40*render.canvas.width, 1/4*render.canvas.height, objectSize/2, { 
        isStatic: false,
        render: {
            // visible: false
            fillStyle: '#36c247',
        }
    });
    ballJS.render.sprite.texture = "../images/badges/jsCircle.png";
    ballJS.render.sprite.xScale = 0.15;
    ballJS.render.sprite.yScale = 0.15;

    // create objects that form the pot
    var size = 200,
        x = 200,
        y = 350,
        bottomPart = Bodies.rectangle(x, y + size / 2, size, size / 5, { 
            render: {
                fillStyle: '#8C52FF',
            }
        }),
        rightPart = Bodies.rectangle(x - size / 2, y, size / 5, size, { 
            render: bottomPart.render 
        });
        leftPart = Bodies.rectangle(x + size / 2, y, size / 5, size, { 
            render: bottomPart.render
        });
    var collider = Bodies.rectangle(x, y + 40, size - 40, size/2 - 20, {
        isSensor: true,
        isStatic: false,
        render: {
            strokeStyle: colorA,
            fillStyle: 'transparent',
            lineWidth: 1
        }
    });
    bottomPart.render.sprite.texture = "../images/badges/projectCode.png";
    bottomPart.render.sprite.xScale = 0.8;
    bottomPart.render.sprite.yScale = 0.8;

    var compoundBodyA = Body.create({
        parts: [bottomPart, rightPart, leftPart, collider]
    });

    Composite.add(engine.world, [
        compoundBodyA, 
        // compoundBodyB, 
        // constraint,
        // Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true })
    ]);

    // Create button to go to next scene
    var nextBtn = Bodies.rectangle(33/40*render.canvas.width, 1/7*render.canvas.height, objectSize / 2 * 5, objectSize / 2, {
        render: {
            
        }
    });
    nextBtn.render.sprite.texture = "../images/badges/stirPot.png";
    nextBtn.render.sprite.xScale = 0.8;
    nextBtn.render.sprite.yScale = 0.8;


    // Create text to explain

    // define a static ground (the *2 for width is cause canvas width is half the actual thing apparently)
    var ground = Bodies.rectangle(render.canvas.width / 2, render.canvas.height - 25, render.canvas.width, 50, { 
        isStatic: true,
        render: {
            fillStyle: '#36c247',
            strokeStyle: 'green',
            lineWidth: 0
        }
    });

    var ceiling = Bodies.rectangle(render.canvas.width / 2, 10, render.canvas.width, 50, { 
        isStatic: true,
        render: {
            fillStyle: '#36c247',
            strokeStyle: 'green',
            lineWidth: 0
        }
    });

    var leftWall = Bodies.rectangle(10, render.canvas.height / 2, 50, render.canvas.height, { 
        isStatic: true,
        render: {
            fillStyle: '#36c247',
            strokeStyle: 'green',
            lineWidth: 0
        }
    });


    var rightWall = Bodies.rectangle(render.canvas.width, render.canvas.height / 2, 70, render.canvas.height, { 
        isStatic: true,
        render: {
            fillStyle: '#36c247',
            strokeStyle: 'green',
            lineWidth: 0
        }
    });


    Events.on(engine, 'collisionStart', function(event) {
        var pairs = event.pairs;
        
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];
            if (pair.bodyA === collider || pair.bodyB === collider) {
                if (pair.bodyA === ballHTML || pair.bodyB === ballHTML) {
                    inBucket.html = true;
                    console.log("html")
                } else if (pair.bodyA === ballCSS || pair.bodyB === ballCSS) {
                    inBucket.css = true;
                    console.log("css")
                } else if (pair.bodyA === ballJS || pair.bodyB === ballJS) {
                    inBucket.js = true;
                    console.log("js")
                }
            }
        }

        if (checkAllIn()) {
            console.log("all in!");
            // alert("all in!");
            if (!spawnedBtn) {
                spawnedBtn = true;
                World.add(engine.world, [nextBtn]);

                var msg = new SpeechSynthesisUtterance();
                msg.text = "Now stir the soup to create the game";
                msg.volume = 0.4;
                window.speechSynthesis.speak(msg);
            }
            
        }
    });

    Events.on(engine, 'collisionEnd', function(event) {
        var pairs = event.pairs;
        
        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];
            if (pair.bodyA === collider || pair.bodyB === collider) {
                if (pair.bodyA === ballHTML || pair.bodyB === ballHTML) {
                    inBucket.html = true;
                    console.log("not html")
                } else if (pair.bodyA === ballCSS || pair.bodyB === ballCSS) {
                    inBucket.css = true;
                    console.log("not css")
                } else if (pair.bodyA === ballJS || pair.bodyB === ballJS) {
                    inBucket.js = true;
                    console.log("not js")
                }
            }
        }
       
    });

    Events.on(mouseConstraint, "mousedown", function(event) {
        if (mouseConstraint.body === nextBtn && checkAllIn()) {
            location.replace("/is-it-too-late-to-revert-to-old-commits/intro/index.html");
        }

        if (textNotSpoken) {
            textNotSpoken = false;
            // play the audio
            var msg = new SpeechSynthesisUtterance();
            msg.text = "Sugar, spice and everything nice. \
                These are the ingredients to make a perfect little game. \
                Help us add the 3 items into the soup to create the game";
            msg.volume = 0.4;
            window.speechSynthesis.speak(msg);

            var startAudio = new Audio('../bgm/duck.mp3');
            startAudio.volume = 0.1;
            startAudio.loop = true;
            startAudio.play();
            musicNotStarted = false;
            
        }
    });

    // add all of the bodies to the world
    World.add(engine.world, [ballHTML, ballCSS, ballJS, ground, ceiling, leftWall, rightWall]);

    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    console.log("All loaded!")
}

function checkAllIn() {
    return (inBucket.html && inBucket.css && inBucket.js);   
}


