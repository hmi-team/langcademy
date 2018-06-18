import {CourseTaken} from "./courseTaken";

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    coursesTaken?: CourseTaken[];
}