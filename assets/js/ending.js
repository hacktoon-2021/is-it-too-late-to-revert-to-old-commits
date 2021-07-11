const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


canvas.width = innerWidth;
canvas.height = innerHeight;


let x = canvas.width / 2;
let y = canvas.height / 2;

let w = 40;
let h = 40;

//html id element

const startGameBtn = document.querySelector('#startGameBtn');

const modalEle = document.querySelector('#modalEle');

const scoreEle = document.querySelector('#scoreEle');

const dialogEle = document.querySelector('#dialogEle');


//play bgm
var audio = new Audio('../bgm/MusictoDelight.mp3');
audio.volume = 0.3;
audio.loop = true;

var startAudio = new Audio('../bgm/30-seconds-2020-04-24_-_Arcade_Kid_-_FesliyanStudios.com_-_David_Renda.mp3');
startAudio.volume = 0.3;
startAudio.loop = true;
startAudio.play();

//sprites
fishcakeSrc = "../images/alien/pc.png";
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


let fishcakes = [];
let score = 0;
let words = "";

let count = 0;

function init() {
    score = 0;

    fishcakes = [];

    addEventListener('click', (event) => {

        if(window.speechSynthesis.speaking === true && count > 1) {
            console.log("here");
            window.speechSynthesis.cancel();
            count -= 1;
        }

        score = score + 10;
        scoreEle.innerHTML = `${score}/100`;

        fetch('https://animechan.vercel.app/api/random')
            .then(response => response.json())
            .then(quote => words = JSON.stringify(quote));

        wordsDict = JSON.parse(words);

        var anime = wordsDict.anime;
        var character = wordsDict.character;
        var q = wordsDict.quote;

        console.log(q);

        dialogEle.innerHTML = 'anime: ' + anime + '\n' + 'character: '+ character +  '\n' + 'quote: '+ q;

        const msg = new SpeechSynthesisUtterance(q);

        window.speechSynthesis.speak(msg);

        count += 1;

        w = w + 100;
        h = h + 100;
        fishcakes.push(new FishCake(x - (w/2) , y - (h/2), {x: 0, y: 0}, fishcakeSrc, w, h));


    });

    return audio.play();
}



let animationId;
var won = Boolean(false);

/*let link = '/Users/hualun/Desktop/naruto-breaks-into-area-51/html/wrong.html';

function changeLink(link) {
    window.location=link;
}*/

function animate() {
    animationId = requestAnimationFrame(animate);
    //c.fillStyle = 'rgba(224, 224, 224, 1)';
    var bg = new Image();
    bg.src = '../images/ending_bg/ending_bg.jpg';
    c.fillStyle = c.createPattern(bg, 'no-repeat');
    c.fillRect( 0, 0, canvas.width, canvas.height);

    if (score === 100) {
        won = true;

        setTimeout(() => {
                cancelAnimationFrame(animationId);
                window.speechSynthesis.cancel();
                audio.pause();
                modalEle.style.display = 'flex';
                startGameBtn.innerHTML = 'click above for the final scene!';
                console.log("hehe");

                window.location.replace("../end/index.html");
            }, 100
        )
    }


    fishcakes.forEach((fishCake, fishCakeIndex) => {
        fishCake.update();

        //remove from left side
        if (fishcakes.length > 2) {
            setTimeout(() =>
            {
                fishcakes.splice(fishCakeIndex, 1);
            }, 0)
        }

    });

}


startGameBtn.addEventListener('click', () => {
    startAudio.pause();
    init();
    animate();
    modalEle.style.display = 'none'
});
