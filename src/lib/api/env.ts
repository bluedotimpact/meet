import { validateEnv } from '../validateEnv';

const envVars = [
  'AIRTABLE_PERSONAL_ACCESS_TOKEN',
  'AIRTABLE_BASE_ID',
  'AIRTABLE_PARTICIPANT_TABLE_ID',
  'AIRTABLE_COHORT_TABLE_ID',
  'AIRTABLE_COHORT_CLASS_TABLE_ID',
  'AIRTABLE_ZOOM_ACCOUNT_TABLE_ID',
  'AIRTABLE_ITERATION_TABLE_ID',
  'AIRTABLE_COURSE_TABLE_ID',

  'NEXT_PUBLIC_ZOOM_CLIENT_ID',
  'ZOOM_CLIENT_SECRET',

  'ALERTS_SLACK_CHANNEL_ID',
  'ALERTS_SLACK_BOT_TOKEN',
] as const;

export type Env = Record<(typeof envVars)[number], string>;

const env: Env = validateEnv(process.env, envVars);

export default env;
