import { Component, OnInit } from '@angular/core';
import { first,debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {Router, ActivatedRoute, Params} from '@angular/router';

import { Course } from '../_models';
import { CourseService } from '../_services';

@Component({templateUrl: 'courses.component.html'})
export class CoursesComponent implements OnInit {
    courses: Course[] = [];

    constructor( private courseService: CourseService, private activatedRoute: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            let name = params['name'];
            this.loadAllCourses(name);
        });
    }

    private loadAllCourses(name?: string) {
        this.courseService.getCourses(name).pipe(first()).subscribe(courses => {
            this.courses = courses;
        });
    }

    search(term: string){

        if (term == ''){
            return;
        }

        //TODO add separators for blank spaces
        //TODO add debounce time
        this.courseService.getCourses(term).pipe(
            first()).subscribe(courses => {
            this.courses = courses;
        });

        //TODO-fix ; vs ? for query params
        //this.router.navigate(['/courses'], { queryParams: { name: term } });

    }
}