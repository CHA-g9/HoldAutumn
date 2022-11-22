// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/PJ_X_0djV/';
let img;
let imgName = ['image/Autumn City.png','image/Autumn City (1).png', 'image/Autumn City (2).png', 'image/Autumn City (3).png', 'image/Autumn City (4).png'];

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
let LeafArr = [];

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
    createCanvas(700, 700);
    // Create the video
    video = createCapture(VIDEO);
    video.size(160, 120);
    video.hide();

    flippedVideo = ml5.flipImage(video)
    // Start classifying
    classifyVideo();

    for (i = 0; i < 150; i++) {
        LeafArr.push(new Leaf());
    }

    let index = int(random(0, 6));
    img = loadImage(imgName[index]); // 변수 'img' 선언

}

function draw() {
    background(255);
    // video 위치 선정
    image(flippedVideo, 270, 0);

    let imgMask = loadImage('DeepDreamTest.jpg');
    
    if (label == 'blow') {
        LeafArr.forEach(function (r) {
            r.createLeaf();
            r.move();

        });
    } else if (label == 'grab') {
        image(img, 100, height / 4, img.width / 2, img.height / 2);

    } else {
        image(imgMask, 100, height/4, img.width / 2, img.height / 2);
    }

}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video)
    classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    // The results are in an array ordered by confidence.
    // console.log(results[0]);
    label = results[0].label;
    // Classifiy again!
    classifyVideo();
}

class Leaf {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.mx = random(0, width);
        this.my = random(0, height);
        this.speedRange = [-2, -1, 1, 2];
        this.xSpeed = random(this.speedRange);
        this.ySpeed = random(this.speedRange);
        this.size = random(55);
        this.degree = random(10);

        this.red = random(255);
        this.green = random(128);
        this.blue = 0;
    }

    createLeaf() {
        let angle = TWO_PI / 5;
        let halfAngle = angle / 2.0;
        push();
        translate(this.mx, this.my);
        rotate(PI * this.degree);

        noStroke();
        noSmooth();
        fill(this.red, this.green, this.blue);
        beginShape();

        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = this.x + cos(a) * 45;
            let sy = this.y + sin(a) * 45;
            vertex(sx, sy);
            sx = this.x + cos(a + halfAngle) * 30;
            sy = this.y + sin(a + halfAngle) * 30;
            vertex(sx, sy);
            fill(this.red, this.green, this.blue, 100);

        }
        endShape(CLOSE);
        pop();
    }

    move() {
        if (this.mx < 0 || this.mx > width) {
            this.xSpeed *= -1;
        }
        if (this.my < 0 || this.my > height) {
            this.ySpeed *= -1;
        }

        this.mx += this.xSpeed;
        this.my += this.ySpeed;
        this.degree = this.degree + 0.01;
    }


}

