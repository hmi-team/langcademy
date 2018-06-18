import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User} from "../../_models";
import {UserService} from "../../_services";

@Component({templateUrl: 'users-administration.component.html'})
export class UsersAdministrationComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService) {}

    ngOnInit() {
        this.loadAllUsers();
    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllUsers()
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }
}