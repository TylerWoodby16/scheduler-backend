import { ObjectId } from "mongodb";

export default interface PersonalizedData {
  _id: ObjectId;
  name: string;
  // Might be objectId but unsure atm
  userId: string;
  lessonId: string;
}
