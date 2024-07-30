import { PutBucketOwnershipControlsCommandInput } from "@aws-sdk/client-s3";
import { ObjectId } from "mongodb";
import Lesson from "./lesson";

export default interface User {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  groupId: ObjectId;
  emergencyContact?: EmergencyContact;
  photoId?: PhotoId;
  commercialLicense?: CommercialLicense;
  medicalCertificate?: MedicalCertificate;
  flightInstructorCertificate?: FlightInstructorCertifcate;
  tsaCitizenship?: TSACitizenship;
  tsaSecurity?: TSASecurity;
  currency141?: Currency141;
  endorsements?: Endorsements;
  aircraftCheckout?: AircraftCheckOut;
  lessonId?: string;
  mapOfLessons?: MapOfLessons;
  lesson?: any;

  // TODO: THIS IS WIP
  roles: Role[];

  // TODO: User permissions or security levels, etc.

  // Create a structure (intentionally vague) that the frontend and backend will
  // use to differentiate users.
  // i.e. one user will be able to do all actions, but another can only POST (no UPDATE).

  // this is NOT the same as just HIDING the update page from the other user.
  // the other user WILL BE ABLE TO SEE THE UPDATE PAGE, BUT WHEN THEY TRY TO USE
  // IT, IT WILL FAIL.

  // should probably use a middleware in the backend (similar-ish to the auth middleware)

  // TODO: Add groupId concept. Users are associated with groups. Actions are based on group, not userId.
  // Step 1 - add groupId to user during login.
  // ----- as a first pass, add a field to the user signup flow.
  // Step 2 - Add groupId to planes. All planes must be associated with a group.
  // When we perform ANY operation (post, put, get, delete), they should be "associated"/"restricted" based on groupId.
  // HINT: Remember that we can add more headers in the auth middleware if we want.
}

export interface MapOfLessons {
  mapOfLessons: Map<string, Lesson[]>;
}
export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface PhotoId {
  idnumber: number;
  experationdate: Date;
  //TODO add Image s3 HELP ME OVER LORD BEZOS SELL ME A SHOVEL ON MY WAY TO MINE THE GOLD
  //Image Later
  //Image Later
}

export interface CommercialLicense {
  certificateType: string;
  certification: number;
  issuedDate: string;
  noLongerCurrentDate: string;
  // below  could possibly be an array
  categoryClass: string;
  // below  could possibly be an array
  ratingsEndorsements: string;
  // below  could possibly be an array
  restrictionsLimitations: string;
}

export interface MedicalCertificate {
  class: string;
  number: number;
  dateOfBirth: string;
  examDate: string;
  firstClassPrivExp: string;
  secondClassPrivExp: string;
  thirdClassPrivExp: string;
  restrictionsLimitations: string;
}

export interface FlightInstructorCertifcate {
  number: number;
  issuedDate: string;
  expiration: string;
  categoryClass: string;
  ratingsEndorsements: string;
  restrictionsLimitations: string;
}

export interface TSACitizenship {
  type: string;

  //TODO add Image s3 HELP ME OVER LORD BEZOS SELL ME A SHOVEL ON MY WAY TO MINE THE GOLD
  //Image Later
  //Image Later
}

export interface TSASecurity {
  date: number;
  expiration: string;
  employeId: number;
  trainer: string;
}

export interface Currency141 {
  expiration: string;
  //Image Later
}

export interface Endorsements {
  date: string;
  nameOfEndorsments: string;
}

export interface AircraftCheckOut {
  makeModel: string;
}

export type Role = "Admin" | "CFI" | "Student";
