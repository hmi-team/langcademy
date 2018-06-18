import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Course } from '../_models';
import { CourseService } from '../_services';
import {CourseTaken} from "../_models/courseTaken";

@Component({
    templateUrl: './course.component.html',
    styles: []
})
export class CourseComponent implements OnInit {
    course: Course;
    courseTaken: CourseTaken;

    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.getCourse();
        this.courseTaken = {id: 1, courseId: 1001, isFinished: false, materialsFinished:[10011, 10012, 10013]};
    }

    getCourse(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.courseService.getCourse(id)
            .subscribe(course => this.course = course);
    }

    goBack(): void {
        this.location.back();
    }
}
