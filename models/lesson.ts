import { ObjectId } from "mongodb";

export default interface Lesson {
  _id?: ObjectId;
  groupId?: ObjectId;
  // does this need to be object id ??
  certificationOrRatingId?: number;

  items?: Map<string, boolean>;
  sections?: string[];

  hours?: number;
}
