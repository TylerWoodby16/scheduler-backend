import { ObjectId } from "mongodb";

export default interface Lesson {
  _id?: ObjectId;
  groupId?: ObjectId;
  items?: Map<string, boolean>;
  sections?: string[];

  hours?: number;
}
