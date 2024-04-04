import { AirtableTs, Table, Item } from 'airtable-ts';
import env from './env';

export default new AirtableTs({
  apiKey: env.AIRTABLE_PERSONAL_ACCESS_TOKEN,
});

export interface Cohort extends Item {
  'Cohort sessions': string[],
  'Iteration (link) (from Facilitator)': string,
}

export const cohortTable: Table<Cohort> = {
  name: 'cohort',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_COHORT_TABLE_ID,
  schema: {
    'Cohort sessions': 'string[]',
    'Iteration (link) (from Facilitator)': 'string',
  },
};

export interface CohortClass extends Item {
  'Facilitator': string,
  'Participants (Expected)': string[],
  'Attendees': string[],
  'Start date/time': number | null,
  'Cohort': string,
  'Zoom account': string | null,
}

export const cohortClassTable: Table<CohortClass> = {
  name: 'cohort class',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_COHORT_CLASS_TABLE_ID,
  schema: {
    Facilitator: 'string',
    'Participants (Expected)': 'string[]',
    Attendees: 'string[]',
    'Start date/time': 'number | null',
    Cohort: 'string',
    'Zoom account': 'string | null',
  },
  mappings: {
    Facilitator: '[>] Facilitator',
    'Participants (Expected)': '[>] Participants (Expected)',
    Attendees: '[>] Attendees',
    'Start date/time': 'Start date/time',
    Cohort: '[>] Cohort',
    'Zoom account': '[>] Zoom account',
  },
};

export interface Participant extends Item {
  'Name': string,
}

export const participantTable: Table<Participant> = {
  name: 'participant',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_PARTICIPANT_TABLE_ID,
  schema: {
    Name: 'string',
  },
};

export interface ZoomAccount extends Item {
  'Meeting link': string,
  'Host key': string,
}

export const zoomAccountTable: Table<ZoomAccount> = {
  name: 'zoom account',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_ZOOM_ACCOUNT_TABLE_ID,
  schema: {
    'Meeting link': 'string',
    'Host key': 'string',
  },
};

export interface Iteration extends Item {
  'Course': string,
}

export const iterationTable: Table<Iteration> = {
  name: 'iteration',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_ITERATION_TABLE_ID,
  schema: {
    Course: 'string',
  },
};

export interface Course extends Item {
  'Course site': string,
}

export const courseTable: Table<Course> = {
  name: 'course',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_COURSE_TABLE_ID,
  schema: {
    'Course site': 'string',
  },
};
