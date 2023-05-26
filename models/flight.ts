import { ObjectId } from "mongodb";
import { type } from "os";
import Aircraft from "./aircraft";
import User from "./user";

export default interface Flight {
  _id: ObjectId;
  groupId: ObjectId;
  userStudent: User;
  userInstructor: User;
  aircraft: Aircraft;
  time: number;
  type: string;
}
