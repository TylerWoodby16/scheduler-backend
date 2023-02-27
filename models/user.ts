import { ObjectId } from "mongodb";

export default interface User {
  _id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  groupId: ObjectId;

  // TODO: THIS IS WIP
  role: "Admin" | "CFI" | "User";

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
