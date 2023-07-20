import { ObjectId } from "mongodb";
import { type } from "os";
import Aircraft from "./aircraft";
import User from "./user";

export default interface Flight {
  _id: ObjectId;
  groupId: ObjectId;
  studentUserId: ObjectId;
  instructorUserId: ObjectId;
  aircraftId: ObjectId;
  startTime: number;
  endTime: number;
  type: string;
  date: string;
}
