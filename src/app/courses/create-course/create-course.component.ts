import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import {AlertService, CourseService} from '../../_services';

@Component({templateUrl: 'create-course.component.html'})
export class CreateCourseComponent implements OnInit {
    createCourseForm: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private courseService: CourseService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.createCourseForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.createCourseForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.createCourseForm.invalid) {
            return;
        }

        this.loading = true;
        this.courseService.addCourse(this.createCourseForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Course added', true);
                    this.router.navigate(['/courses']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
