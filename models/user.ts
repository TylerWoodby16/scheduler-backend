export default interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;

  // TODO: User permissions or security levels, etc.

  // Create a structure (intentionally vague) that the frontend and backend will
  // use to differentiate users.
  // i.e. one user will be able to do all actions, but another can only POST (no UPDATE).

  // this is NOT the same as just HIDING the update page from the other user.
  // the other user WILL BE ABLE TO SEE THE UPDATE PAGE, BUT WHEN THEY TRY TO USE
  // IT, IT WILL FAIL.

  // should probably use a middleware in the backend (similar-ish to the auth middleware)
}
