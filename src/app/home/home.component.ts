import { Component, OnInit } from '@angular/core';
import { User } from '../_models';

@Component({templateUrl: 'home.component.html',styleUrls: ['./home.component.css']})
export class HomeComponent implements OnInit {
    currentUser: User;
    
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        //TODO don't do it here

    }

    ngOnInit() {}

}