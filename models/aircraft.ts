import { ObjectId } from "mongodb";

export default interface Aircraft {
    _id: number;
    userId: ObjectId;
    name: string;
    year: number;
}