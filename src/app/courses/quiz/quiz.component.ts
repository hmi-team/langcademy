import {Component, OnInit, Input, OnChanges} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'quiz',
    templateUrl: './quiz.component.html',
    styleUrls: ['quiz.component.css']

})
export class QuizComponent implements OnInit{
@Input() materialId: number;

test = {questions: [
        {question: "Test", answers: ['Start']},
        {question: "What is not present in a neural network?", answers: ['Input', 'Hidden layers', 'Weights', 'Encoding']},
        {question: "What is not an actual machine learning algorithm?", answers: ['Linear regression', 'Logistic regression', 'Latent regression']},
        {question: "What does NLP stand for?", answers: ['Natural language processing', 'National language performances', 'Natural latent spaces']},
        {question: "Results", passedTopics: ['But what *is* a Neural Network?']},
        {question: "What are recurrent neural networks most commonly used for?", answers: ['Feature engineering', 'Image recognition', 'Image generation', 'Text processing']},
        {question: "Can convolutional neural networks be used for NLP?", answers: ['Yes', 'No', 'It is possible but with bad results']},
        {question: "What is not a popular neural networks architecture?", answers: ['Transmutual neural network', 'Recurrent neural network', 'Convolutional neural network']},
        {question: "What is not a common misconception about neural networks?", answers: ['They are slow to train', 'They need very large train data', 'They cannot be used in unsupervised learning']},
        {question: "Results", passedTopics: []}
    ]};
currentQuestion = this.test.questions[0];
testIsFinished = false;
counter = 0;

    constructor() {}

    ngOnInit(){
        this.counter = 0;
        this.testIsFinished = false;

        if (this.materialId == 10012){
            this.counter = 0;
        }
        if(this.materialId == 10017){
            this.counter = 4;
        }
    }

    sendAnswer(){
        this.counter = this.counter + 1;

        if (this.counter >= this.test.questions.length){
            this.testIsFinished = true;
        }
        else{
            this.currentQuestion = this.test.questions[this.counter];
        }

    }
}
