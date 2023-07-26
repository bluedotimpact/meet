import env from '../env';
import { Table, Item } from './common/mapping/types';

export interface Cohort extends Item {
  'Cohort sessions': string[],
  'Facilitator': string,
  'Zoom account': string
  'Iteration (link) (from Facilitator)': string,
  'Enable embedded meetings': boolean,
}

export const cohortTable: Table<Cohort> = {
  name: 'cohort',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_COHORT_TABLE_ID,
  schema: {
    'Cohort sessions': 'string[]',
    'Facilitator': 'string',
    'Zoom account': 'string',
    'Iteration (link) (from Facilitator)': 'string',
    'Enable embedded meetings': 'boolean',
  },
};

export interface CohortClass extends Item {
  'Participants (Expected)': string[],
  'Participants (Attended) BETA': string[],
  'Start date/time': number | null,
  'Cohort': string,
}

export const cohortClassTable: Table<CohortClass> = {
  name: 'cohort class',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_COHORT_CLASS_TABLE_ID,
  schema: {
    'Participants (Expected)': 'string[]',
    'Participants (Attended) BETA': 'string[]',
    'Start date/time': 'number | null',
    'Cohort': 'string',
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
    'Name': 'string',
  },
};

export interface ZoomAccount extends Item {
  'Meeting link': string,
}

export const zoomAccountTable: Table<ZoomAccount> = {
  name: 'zoom account',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_ZOOM_ACCOUNT_TABLE_ID,
  schema: {
    'Meeting link': 'string',
  },
};

export interface Iteration extends Item {
  'Courses': string,
}

export const iterationTable: Table<Iteration> = {
  name: 'iteration',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_ITERATION_TABLE_ID,
  schema: {
    'Courses': 'string',
  },
};

export interface Course extends Item {
  'Course Site': string,
}

export const courseTable: Table<Course> = {
  name: 'course',
  baseId: env.AIRTABLE_BASE_ID,
  tableId: env.AIRTABLE_COURSE_TABLE_ID,
  schema: {
    'Course Site': 'string',
  },
};
