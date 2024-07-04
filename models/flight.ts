import { ObjectId } from "mongodb";
import { type } from "os";
import Aircraft from "./aircraft";
import User from "./user";

export default interface Flight {
  _id: ObjectId;
  groupId: ObjectId;
  //Might need to become ObjectId
  studentUserId: string;
  instructorUserId: ObjectId;
  aircraftId: ObjectId;
  startTime: Date;
  endTime: Date;
  typeOfFlight: string;
  lessonId?: string;
  date: string;
}
