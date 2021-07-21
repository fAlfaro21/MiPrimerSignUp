# MiPrimerSignUp

Program to implement the necessary backend layers (business logic and database) to register a new user with email and password.

The following steps are followed:

1) Sending by POST an object with the user's data: {email: "...", pass: "..."}

2) When collecting this POST request, check:

- Validate the email and password with regexp, and if not return a "validation error" message (and which one?).

- If the user was not already present in the DB, their email and password hashed through MD5 (or another) will be stored and an OK message will be returned, and also generate a secret and store it for that user.

- If the user was in the DB, a KO message will be returned for "you're done" (or better a redirection to login).

-
NOTE: All http requests must be generated via Postman.