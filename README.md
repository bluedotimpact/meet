# meet ![deployment automatic](https://img.shields.io/badge/deployment-automatic-success)

An app for hosting meetings, e.g. facilitated sessions on our courses.

## How it works

The app presents a user interface where people can join via links like:

```
meet.bluedot.org/?cohortId=rec1234
```

Behind the scenes, we make API calls to Airtable to get information regarding that cohort, the cohort classes and the participants in that cohort. Once we find the nearest cohort class, we present the participants in it so people can choose to login as that participant. In case someone else is joining, we give users an escape hatch to enter a custom name.

We then render the Zoom meeting with the [Zoom Meeting SDK](https://developers.zoom.us/docs/meeting-sdk/web/).

Once in the meeting, the facilitator can claim host with the host key.

## Future potential changes

We may change from having a concept 'cohorts' / 'cohort classes' etc., and make another service responsible for that. Then this service would just be for hosting the actual meeting itself.

## Developer setup

1. Clone this repository
2. Install Node
3. Install dependencies with `npm install`
4. Create an [Airtable personal access token](https://support.airtable.com/docs/creating-and-using-api-keys-and-access-tokens) with the scopes 'data.records:read', 'data.records:write', 'schema.bases:read'.
5. Set the environment variables in [`.env.local`](./.env.local)
6. Run the server with `npm start`

## Deployment

This app is deployed using Vercel and uses an Airtable base as a database. API keys are stored safely in Vercel environment variables. GitHub Actions hits the scheduler endpoint.

To deploy a new version, simply commit to the master branch. GitHub Actions automatically handles CD, via `npm run deploy:prod`.
