import { Component} from '@angular/core';

import {User} from "../_models";

@Component({
    selector: 'ng-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent {

    currentUser: User;

    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
}