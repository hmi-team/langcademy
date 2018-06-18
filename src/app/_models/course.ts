import {Material} from "./material";

export class Course {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    materials?: Material[];
}