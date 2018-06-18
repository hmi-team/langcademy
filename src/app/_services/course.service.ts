import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {Course, User} from '../_models';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    private coursesUrl = '/api/courses';  // URL to web api

    constructor(
        private http: HttpClient) {
    }

    getAll() {
        return this.http.get<Course[]>('/api/courses');
    }

    /** GET courses from the server */
    getCourses (name?: string): Observable<Course[]> {
        return this.http.get<Course[]>(this.coursesUrl,{params: {name: name}})
            .pipe(
                catchError(this.handleError('getCourses', []))
            );
    }

    /** GET course by id. Will 404 if id not found */
    getCourse(id: number): Observable<Course> {
        const url = `${this.coursesUrl}/${id}`;
        return this.http.get<Course>(url).pipe(
            catchError(this.handleError<Course>(`getCourse id=${id}`))
        );
    }

/*    /!** PUT: update the hero on the server *!/
    updateHero (hero: Hero): Observable<any> {
        return this.http.put(this.coursesUrl, hero, httpOptions).pipe(
            tap(_ => this.log(`updated hero id=${hero.id}`)),
            catchError(this.handleError<any>('updateHero'))
        );
    }*/

    /** POST: add a new course to the server */
    addCourse (course: Course): Observable<Course> {
        return this.http.post<Course>('/api/courses/create', course, httpOptions).pipe(
            catchError(this.handleError<Course>('addCourse'))
        );
    }

/*    /!** DELETE: delete the hero from the server *!/
    deleteHero (hero: Hero | number): Observable<Hero> {
        const id = typeof hero === 'number' ? hero : hero.id;
        const url = `${this.coursesUrl}/${id}`;

        return this.http.delete<Hero>(url, httpOptions).pipe(
            tap(_ => this.log(`deleted hero id=${id}`)),
            catchError(this.handleError<Hero>('deleteHero'))
        );
    }

    /!* GET heroes whose name contains search term *!/
    searchHeroes(term: string): Observable<Hero[]> {
        if (!term.trim()) {
            // if not search term, return empty hero array.
            return of([]);
        }
        return this.http.get<Hero[]>(`${this.coursesUrl}/?name=${term}`).pipe(
            tap(_ => this.log(`found heroes matching "${term}"`)),
            catchError(this.handleError<Hero[]>('searchHeroes', []))
        );
    }*/

    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
