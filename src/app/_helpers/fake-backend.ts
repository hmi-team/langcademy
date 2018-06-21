import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import {Course, User} from "../_models";
import {st} from "@angular/core/src/render3";

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        let users: User[] = JSON.parse(localStorage.getItem('users')) || [];
        if (users.length < 1){
            users.push({
                id: 1001,
                username: 'DemoUser',
                firstName: 'Demo',
                lastName: "User",
                password: '123456',
                coursesTaken: [
                    {id: 1, courseId: 1001, isFinished: false, materialsFinished: [1, 2]}
                ]
            })
        }

        let courses: Course[] = JSON.parse(localStorage.getItem('courses')) || [];
        if (courses.length < 1){
            courses.push({
                id: 1001,
                name: 'Neural Networks',
                description: 'Quick overview of Neural Networks, followed by a few interesting materials concerning convolutional neural networks and recurrent neural networks by Andrej Karpathy.',
                imageUrl: 'https://zdnet4.cbsistatic.com/hub/i/2018/04/13/36c52953-7ab9-4608-a848-71d1d538856e/2cad00bf6c3dc3ff21009836b989cda7/td-deep-learning.jpg',
                materials: [
                    {id: 10011, name:'Intro', type: 'Text', duration: '1 minute', text: 'In out firm neural networks are an essential part of our work. Every employee must be familiar with the basic concepts for neural networks. We have carefully collected several materials we want everybody to have red. Good luck and dont be shy to ask questions!' },
                    {id: 10012, name:'Placement test', type: 'Test', duration: '2 minutes', text: 'Test your knowledge before you start!' },
                    {id: 10013, name:'But what *is* a Neural Network?', duration: '19 minutes', type: 'Video', text: 'An excellent video exploring the basics of a neural network.', url: 'https://www.youtube.com/embed/aircAruvnKk'},
                    {id: 10014, name:'CS231n: Convolutional Neural Networks', type: 'Link', duration: '12 minutes', text: 'Convolutional neural networks are commonly used in our projects. This article by the famous Andrej Karpathy is a great way to get into the concepts.', url: 'http://cs231n.github.io/convolutional-networks/'},
                    {id: 10015, name:'The Unreasonable Effectiveness of Recurrent Neural Networks', type: 'Link', duration: '14 minutes', text:'Recurrent neural networks have proven to be a surprisingly efficient way train our models dealing with natural language proccesing. This article is a must for everybody participating in a NLP project!', url: 'http://karpathy.github.io/2015/05/21/rnn-effectiveness/'},
                    {id: 10016, name:'10 misconceptions about Neural Networks', type: 'Link', duration: '8 minutes', text:'And lastly, a bit more entertaining article looking into some common misconceptions about neural networks. This article is not required but we find it quite helpful.', url: 'http://www.turingfinance.com/misconceptions-about-neural-networks/'},
                    {id: 10017, name:'Final test', type: 'Test', duration: '4 minutes', text:''}
                ]
            });

            courses.push({
                id: 1002,
                name: 'Logistic regression',
                description: 'The basics for logistic regression. Logistic regression is used widely in the training of our most basic models.',
                imageUrl: 'https://i2.wp.com/www.puzzlr.org/wp-content/uploads/2016/10/LogisticRegression-pic.png?fit=499%2C307'
            });

            courses.push({
                id: 1003,
                name: 'NLP',
                description: 'Natural language processing is an important part of our company and we have may projects using it.',
                imageUrl: 'https://www.themavencircle.com/wp-content/uploads/2016/03/Neuro-linguistic-Programming-650x435.jpg'
            });

            courses.push({
                id: 1004,
                name: 'Embeddings',
                description: 'Embeddings are very important part for our NLP team. Every member of this team must have an in-depth understanding of the concepts of embeddings!',
                imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR19dj2tzI2om9q7Ma1QnxiXZZ-IocctLOAkXE8Mlz8BV-IOsO3jw'
            });

            courses.push({
                id: 1005,
                name: 'Feature engineering',
                description: 'Feature engineering is also an important part of our day to day work.',
                imageUrl: 'https://api.ning.com/files/ewwzspTVVqZ7yGyi4JAL8UaSr7FgAFg4HhNKRKM51v3ofDqR0VcBGJkio9C6je8BKC7DeCrxiZ91hpB0c*C6RlNOd04RPyK2/powertools.png'
            });
        }

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate
            if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                let filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    let user = filteredUsers[0];
                    let body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return throwError('Username or password is incorrect');
                }
            }

            // get users
            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }

            // get user by id
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = users.filter(user => { return user.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    return of(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }

            // create user
            if (request.url.endsWith('/api/users') && request.method === 'POST') {
                // get new user object from post body
                let newUser = request.body;

                // validation
                let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                if (duplicateUser) {
                    return throwError('Username "' + newUser.username + '" is already taken');
                }

                // save new user
                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < users.length; i++) {
                        let user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }

            // create course
            if (request.url.endsWith('/api/courses/create') && request.method === 'POST') {
                // get new user object from post body
                let newCourse = request.body;

                // validation
                let duplicateCourse = courses.filter(course => { return course.name === newCourse.name; }).length;
                if (duplicateCourse) {
                    return throwError('Course name "' + newCourse.username + '" is already taken');
                }

                // save new user
                newCourse.id = courses.length + 1;
                courses.push(newCourse);
                localStorage.setItem('courses', JSON.stringify(courses));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 }));
            }

            // get course by id
            if (request.url.match(/\/api\/courses\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedCourses = courses.filter(course => { return course.id === id; });
                    let course = matchedCourses.length ? matchedCourses[0] : null;

                    return of(new HttpResponse({ status: 200, body: course }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return throwError('Unauthorised');
                }
            }

            // get courses
            if (request.urlWithParams.startsWith('/api/courses') && request.method === 'GET') {
                let name = this.getParameterByName('name',request.urlWithParams).toLowerCase();

                if (name != 'undefined'){
                    console.log('nameee');
                    let coursesToReturn = courses.filter(x => x.name.toLocaleLowerCase().includes(name));
                    console.log(coursesToReturn);
                    return of(new HttpResponse({ status: 200, body: coursesToReturn }));
                }
                console.log('dont got ');
                return of(new HttpResponse({ status: 200, body: courses }));
            }

            // pass through any requests not handled above
            return next.handle(request);
            
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }

    getParameterByName(name:string, url:string) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

}



export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};