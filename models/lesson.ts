import { ObjectId } from "mongodb";

export default interface Lesson {
  _id?: string;
  groupId?: string;
  items?: Map<string, boolean>;
  sections?: string[];

  hours?: number;
}
