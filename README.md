# Firebase + TypeScript + GraphQL + React starter kit

This is a bundled up version of my standard Firebase web app setup.

## What’s in the box

- **Unified dev experience**: TypeScript and webpack in both frontend and backend
- **GraphQL and REST API endpoints** as cloud functions
- **Hot reloading local cloud function server** that provides the shortest possible feedback loop for backend changes

## Get started

- If you haven’t already, **create a new project** in the [Firebase console][].
- In the Firebase console, go to _[Gear menu] → Project Settings → Service Accounts_ and **generate a new private key** for Node.js. Copy the generated JSON file to the root of your project folder and rename it to `firebase-credentials.json`.
- While you’re in the Firebase console, **create a new Firestore database**. You’ll be prompted to selected an initial rule ocnfiguration. Pick the production option. Your selection here doesn’t affect anything, as the initial rules be overwritten with the rules at `config/firestore.rules` upon deploy.
- In your project folder, edit `.firebaserc` and **change "typescript-react-example" to the name of your Firebase project**.

## Local development

Local development is comprised of two parts—the cloud function server and the webpack dev server that serves the UI. This kinda sucks and I’d like to make this a single command at some point in the near future. Until then, we’re stuck with this two command combo.

1. Run `yarn start-functions` from the project root to start the local cloud function server. This will start a lightweight express server that approximates the production cloud function environment. Changes made to `functions/src` will cause the server process to be killed and restarted.

2. Run `yarn start-ui` from the project root to start `webpack-dev-server`, the UI server. By default the server runs on port 3003, but you can change that default by modifying the `start` script in `ui/package.json`. Any changes in `ui/src` will cause the page to refresh. Additionally, webpack has been configured to proxy requests to `/api` and `/graphql` through to the local cloud function server, so absolute references to those paths should work as expected both locally and in production.

Your project should be running at http://localhost:3003.

## Continuous deployment

This template includes support for continuous deployment via a GitHub action. Some initial setup is required:

1. Generate a deploy token by running `firebase login:ci` from your project folder. You can read more in the [Firebase docs](https://firebase.google.com/docs/cli/#cli-ci-systems).
2. Add the generated token to the Secrets section of your GitHub repository (_Settings → Secrets_) and name it `FIREBASE_TOKEN`.

## Available commands

| Command                | Description                                 |
| :--------------------- | :------------------------------------------ |
| `yarn deploy`          | An alias for `firebase deploy`              |
| `yarn start-ui`        | Run the local frontend dev server           |
| `yarn build-ui`        | Bundle the UI code with webpack             |
| `yarn start-functions` | Run the local cloud function server         |
| `yarn build-functions` | Bundle the cloud function code with webpack |

[firebase console]: https://console.firebase.google.com
