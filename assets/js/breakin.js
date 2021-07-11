const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


canvas.width = innerWidth;
canvas.height = innerHeight;


let x = canvas.width / 2;
let y = canvas.height / 2;

//html id element
const scoreEle = document.querySelector('#scoreEle');

const startGameBtn = document.querySelector('#startGameBtn');

const modalEle = document.querySelector('#modalEle');

const bigScoreEle = document.querySelector('#bigScoreEle');

const commentEle = document.querySelector('#commentEle');


//play bgm
var audio = new Audio('../bgm/Loyalty_Freak_Music_-_04_-_Cant_Stop_My_Feet_.mp3');
audio.volume = 0.3;


var drum = new Audio('../bgm/drum_roll.mp3');
drum.volume = 0.3;


//sprites
narutoSrc = "../images/sprites/biggerNaruto.png";
fishcakeSrc = "../images/fishcake/fishcake.png";
droneSrc = "../images/drone/drone.png";
alienSrc = "../images/alien/alien.png";


function drawCustomImage(canvasCxt, imgSrc, x, y, width, height) {
    var customImage = new Image();
    customImage.src = imgSrc;
    canvasCxt.drawImage(customImage, x, y, width, height)
}




class FishCake {
    constructor(x, y, velocity, img, width, height) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.img = img;
        this.width = width;
        this.height = height;


    }

    draw() {
        drawCustomImage(c, this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Drone {
    constructor(x, y, velocity, img, width, height) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.img = img;
        this.width = width;
        this.height = height;


    }

    draw() {
        drawCustomImage(c, this.img, this.x, this.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}


let fishcakes = [];
let drones = [];
var lose = Boolean(false);

function init() {
    score = 0;
    lose = false;
    bigScoreEle.innerHTML = score;
    scoreEle.innerHTML = score;
    drawCustomImage(c, narutoSrc, x, y, 150, 150);
    fishcakes = [];
    drones = [];

    addEventListener('click', (event) => {

        const angle = Math.atan2(event.clientY - y, event.clientX - x);

        const velocity = {x: Math.cos(angle) * 4, y: Math.sin(angle) * 4};

        if (fishcakes.length < 10) {
            var laser = new Audio('../bgm/laser_shots_short.mp3');
            laser.volume = 0.3;
            laser.play();
            laser = null;
            fishcakes.push(new FishCake(x , y, velocity, fishcakeSrc, 80, 80));
        }

    });

    return audio.play();
}

function droneSpeed(angle) {
    var n = Math.floor(Math.random() * 5) + 1;
    return {x: Math.cos(angle) * n, y: Math.sin(angle) * n}
}

function decreasePoints(points, lose) {
    if (!lose) {
        return points - 1;
    }
}


function spawnDrones() {

    setInterval(() => {


        let x;
        let y;

        if (Math.random() < 0.5) {
             x = Math.random() < 0.5 ? 0 - 150 : canvas.width + 150;
             y = Math.random() * canvas.height;
        } else {
             x = Math.random() * canvas.width;
              y = Math.random() < 0.5 ? 0 - 150 : canvas.height + 150;
        }


        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        //const velocity = {x: Math.cos(angle), y: Math.sin(angle)};

        drones.push(new Drone(x, y, droneSpeed(angle), droneSrc, 80, 80));

    }, 500)
}

let animationId;
let score = 0;
var won = Boolean(false);

function animate() {
    animationId = requestAnimationFrame(animate);
    //c.fillStyle = 'rgba(224, 224, 224, 1)';
    var bg = new Image();
    bg.src = '../images/space/space_bg.jpg';
    c.fillStyle = c.createPattern(bg, 'no-repeat');
    c.fillRect( 0, 0, canvas.width, canvas.height);
    drawCustomImage(c, narutoSrc, canvas.width / 2 - 75, canvas.height / 2 - 75, 150, 150);

    if (score > 100) {
        won = true;
        drum.play();
        setTimeout(() => {
            window.location.replace("../quotes/index.html");
            console.log("hehe");
            }, 300
        )
    }

    if (won) {
        drawCustomImage(c, alienSrc, canvas.width / 2 - 400, canvas.height / 2 - 400, 800, 800);
    }

    setTimeout(() => {
        score = decreasePoints(score);
        scoreEle.innerHTML = score;
    }, 3000);


    fishcakes.forEach((fishCake, fishCakeIndex) => {
        fishCake.update();

        //remove from left side
        if (fishCake.x + 80 < 0 || fishCake.x - 80 > canvas.width ||
            fishCake.y + 80 < 0 || fishCake.y - 80 > canvas.height) {
            setTimeout(() =>
            {
                fishcakes.splice(fishCakeIndex, 1);
            }, 0)
        }

    });

    drones.forEach((drone, index) => {
        drone.update();

        const dist = Math.hypot(x - drone.x, y - drone.y);

        if (dist < 1) {
            cancelAnimationFrame(animationId);
            modalEle.style.display = 'flex';
            bigScoreEle.innerHTML = score;
            startGameBtn.innerHTML = 'Retry';
            commentEle.innerHTML = 'Points';
            lose = true;
            score = 0;
            return audio.pause();
        }

        fishcakes.forEach((fishCake, fishCakeIndex) => {
            const dist = Math.hypot(fishCake.x - drone.x, fishCake.y - drone.y);

            //objects touch
            if (dist - 160 < 1) {

                var explode = new Audio('../bgm/collision.mp3');
                explode.volume = 0.3;
                explode.play();
                explode = null;

                //increase score
                score += 30;
                scoreEle.innerHTML = score;

                setTimeout(() =>
                    {
                        drones.splice(index, 1);
                        fishcakes.splice(fishCakeIndex, 1);
                    }, 0)

            }
        })
    })

}


startGameBtn.addEventListener('click', () => {
    init();
    animate();
    spawnDrones();
    modalEle.style.display = 'none'
});

