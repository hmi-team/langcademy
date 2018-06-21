import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Course } from '../_models';
import { CourseService } from '../_services';
import {CourseTaken} from "../_models/courseTaken";
import {st} from "@angular/core/src/render3";
import {calcBindingFlags} from "@angular/core/src/view/util";

@Component({
    templateUrl: './course.component.html',
    styles: []
})
export class CourseComponent implements OnInit {
    course: Course;
    courseTaken: CourseTaken;
    progressValue: number;

    constructor(
        private route: ActivatedRoute,
        private courseService: CourseService,
        private location: Location
    ) {}

    ngOnInit(): void {
        this.getCourse();
        this.courseTaken = {id: 1, courseId: 1001, isFinished: false, materialsFinished:[]};
    }

    getCourse(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.courseService.getCourse(id)
            .subscribe(course => {this.course = course; this.calculateProgress()});
    }

    goBack(): void {
        this.location.back();
    }

    markAsFinished(materialId: number){
        if (this.courseTaken.materialsFinished.indexOf(materialId) < 0){
            this.courseTaken.materialsFinished.push(materialId);
        }
        this.calculateProgress();
    }

    calculateProgress(){
        this.progressValue = (100 / this.course.materials.length) * this.courseTaken.materialsFinished.length;
    }
}
