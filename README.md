# Firebase + TypeScript + GraphQL + React starter kit

This is a bundled up versionf of my standard Firebase web app setup.

## What’s in the box

- Unified dev experience: TypeScript + webpack in both frontend and backend
- GraphQL and REST API endpoints as cloud functions
- Mock cloud function server with hot reloading

## Get started

- If you haven’t already, create a new project in the [Firebase console][].
- Go to your Project Settings and select "Service Accounts". Generate a new private key, copy it to the root of your project folder, and rename it to `firebase-credentials.json`.
- While you’re in the Firebase console, create a new Firestore database. You’ll be prompted to selected an initial rule ocnfiguration. Pick the production option. Your selection here doesn’t affect anything, as the initial rules be overwritten with the rules at `config/firestore.rules` upon deploy.
- Edit `.firebaserc` and change "typescript-react-example" to the name of your Firebase project.

You can now run the cloud function server with `yarn start-functions`.
In a new terminal, run `yarn start-ui` to run the frontend portion of your application.

## Continuous deployment

This template includes support for continuous deployment via a GitHub action. Some initial setup is required:

1. Generate a deploy token by running `firebase login:ci` from your project folder. You can read more in the [Firebase docs](https://firebase.google.com/docs/cli/#cli-ci-systems).
2. Add the generated token to the Secrets section of your GitHub repository and name it `FIREBASE_TOKEN`.

## Available commands

| Command                | Description                                 |
| :--------------------- | :------------------------------------------ |
| `yarn deploy`          | An alias for `firebase deploy`              |
| `yarn start-ui`        | Run the local frontend dev server           |
| `yarn build-ui`        | Bundle the UI code with webpack             |
| `yarn start-functions` | Run the local cloud function server         |
| `yarn build-functions` | Bundle the cloud function code with webpack |

[firebase console]: https://console.firebase.google.com
