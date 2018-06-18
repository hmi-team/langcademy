import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import {CreateCourseComponent} from "./courses/create-course/create-course.component";
import {CoursesComponent} from "./courses/courses.component";
import {CourseComponent} from "./courses/course.component";
import {UsersAdministrationComponent} from "./administration/users-administration/users-administration.component";
import {CourseDetailsComponent} from "./courses/course-details/course-details.component";

const appRoutes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'courses/create', component: CreateCourseComponent },
    { path: 'courses', component: CoursesComponent},
    { path: 'courses/:id', component: CourseComponent},
    { path: 'courses/details/:id', component: CourseDetailsComponent},

    {path: 'administration/users', component: UsersAdministrationComponent},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);