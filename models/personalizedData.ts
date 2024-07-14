import { ObjectId } from "mongodb";

export default interface PersonalizedData {
  _id: ObjectId;

  // Might be objectId but unsure atm
  userId: string;
  lessonId: string;
  personalizedContent: object;
}
