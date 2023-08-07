import {
  AirtableTypeString, FromAirtableTypeString, FromTsTypeString, TsTypeString,
} from './types';

type Mapper = {
  [T in TsTypeString]?: {
    [A in AirtableTypeString]?: {
      toAirtable: (value: FromTsTypeString<T>) => FromAirtableTypeString<A>,
      fromAirtable: (value: FromAirtableTypeString<A> | null | undefined) => FromTsTypeString<T>,
    }
  }
};

const required = <T>(value: T): NonNullable<T> => {
  if (value === null || value === undefined) {
    throw new Error('missing required value');
  }
  return value;
};

const fallbackMapperPair = <T, F1, F2>(toFallback: F1, fromFallback: F2) => ({
  toAirtable: (value: T | null | undefined) => value ?? toFallback,
  fromAirtable: (value: T | null | undefined) => value ?? fromFallback,
});

const requiredMapperPair = {
  toAirtable: <T>(value: T | null | undefined) => required(value),
  fromAirtable: <T>(value: T | null | undefined) => required(value),
};

export const fieldMappers: Mapper = {
  string: {
    singleLineText: fallbackMapperPair('', ''),
    email: fallbackMapperPair('', ''),
    url: fallbackMapperPair('', ''),
    multilineText: fallbackMapperPair('', ''),
    richText: fallbackMapperPair('', ''),
    phoneNumber: fallbackMapperPair('', ''),
    multipleRecordLinks: {
      toAirtable: (value) => {
        return [value];
      },
      fromAirtable: (value) => {
        if (!value) {
          throw new Error('Failed to coerce multipleRecordLinks type field to a single string, as it was blank');
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleRecordLinks to a single string, as there were ${value?.length} entries`);
        }
        return value[0];
      },
    },
    dateTime: {
      toAirtable: (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime string');
        }
        return date.toJSON();
      },
      fromAirtable: (value) => {
        const date = new Date(value ?? '');
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime string');
        }
        return date.toJSON();
      },
    },
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!value) {
          throw new Error('Failed to coerce multipleLookupValues type field to a single string, as it was blank');
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleLookupValues to a single string, as there were ${value?.length} entries`);
        }
        if (typeof value[0] !== 'string') {
          throw new Error(`Can't coerce singular multipleLookupValues to a single string, as it was of type ${typeof value[0]}`);
        }
        return value[0];
      },
    },
  },
  'string | null': {
    singleLineText: fallbackMapperPair(null, null),
    email: fallbackMapperPair(null, null),
    url: fallbackMapperPair(null, null),
    multilineText: fallbackMapperPair(null, null),
    richText: fallbackMapperPair(null, null),
    phoneNumber: fallbackMapperPair(null, null),
    multipleRecordLinks: {
      toAirtable: (value) => {
        return value ? [value] : [];
      },
      fromAirtable: (value) => {
        if (!value || value.length === 0) {
          return null;
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleRecordLinks to a single string, as there were ${value?.length} entries`);
        }
        return value[0];
      },
    },
    dateTime: {
      toAirtable: (value) => {
        if (value === null) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime');
        }
        return date.toJSON();
      },
      fromAirtable: (value) => {
        if (value === null || value === undefined) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime');
        }
        return date.toJSON();
      },
    },
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!value || value.length === 0) {
          return null;
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleLookupValues to a single string, as there were ${value?.length} entries`);
        }
        if (typeof value[0] !== 'string') {
          throw new Error(`Can't coerce singular multipleLookupValues to a single string, as it was of type ${typeof value[0]}`);
        }
        return value[0];
      },
    },
  },
  boolean: {
    checkbox: fallbackMapperPair(false, false),
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!value) {
          throw new Error('Failed to coerce multipleLookupValues type field to a single boolean, as it was blank');
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleLookupValues to a single boolean, as there were ${value?.length} entries`);
        }
        if (typeof value[0] !== 'boolean') {
          throw new Error(`Can't coerce singular multipleLookupValues to a single boolean, as it was of type ${typeof value[0]}`);
        }
        return value[0];
      },
    },
  },
  'boolean | null': {
    checkbox: fallbackMapperPair(null, null),
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!value || value.length === 0) {
          return null;
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleLookupValues to a single boolean, as there were ${value?.length} entries`);
        }
        if (typeof value[0] !== 'boolean') {
          throw new Error(`Can't coerce singular multipleLookupValues to a single boolean, as it was of type ${typeof value[0]}`);
        }
        return value[0];
      },
    },
  },
  number: {
    number: requiredMapperPair,
    percent: requiredMapperPair,
    currency: requiredMapperPair,
    rating: requiredMapperPair,
    duration: requiredMapperPair,
    count: {
      toAirtable: () => { throw new Error('count type field is readonly'); },
      fromAirtable: (value) => required(value),
    },
    autoNumber: {
      toAirtable: () => { throw new Error('autoNumber type field is readonly'); },
      fromAirtable: (value) => required(value),
    },
    // Number assumed to be unix time in seconds
    dateTime: {
      toAirtable: (value) => {
        const date = new Date(value * 1000);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime');
        }
        return date.toJSON();
      },
      fromAirtable: (value) => {
        const date = new Date(value ?? '');
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime');
        }
        return Math.floor(date.getTime() / 1000);
      },
    },
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!value) {
          throw new Error('Failed to coerce multipleLookupValues type field to a single number, as it was blank');
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleLookupValues to a single number, as there were ${value?.length} entries`);
        }
        if (typeof value[0] !== 'number') {
          throw new Error(`Can't coerce singular multipleLookupValues to a single number, as it was of type ${typeof value[0]}`);
        }
        return value[0];
      },
    },
  },
  'number | null': {
    number: fallbackMapperPair(null, null),
    percent: fallbackMapperPair(null, null),
    currency: fallbackMapperPair(null, null),
    rating: fallbackMapperPair(null, null),
    duration: fallbackMapperPair(null, null),
    count: {
      fromAirtable: (value) => value ?? null,
      toAirtable: () => { throw new Error('count type field is readonly'); },
    },
    autoNumber: {
      fromAirtable: (value) => value ?? null,
      toAirtable: () => { throw new Error('autoNumber field is readonly'); },
    },
    // Number assumed to be unix time in seconds
    dateTime: {
      toAirtable: (value) => {
        if (value === null) return null;
        const date = new Date(value * 1000);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime');
        }
        return date.toJSON();
      },
      fromAirtable: (value) => {
        if (value === null || value === undefined) return null;
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          throw new Error('Invalid dateTime');
        }
        return Math.floor(date.getTime() / 1000);
      },
    },
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!value || value.length === 0) {
          return null;
        }
        if (value.length !== 1) {
          throw new Error(`Can't coerce multipleLookupValues to a single number, as there were ${value?.length} entries`);
        }
        if (typeof value[0] !== 'number') {
          throw new Error(`Can't coerce singular multipleLookupValues to a single number, as it was of type ${typeof value[0]}`);
        }
        return value[0];
      },
    },
  },
  'string[]': {
    multipleRecordLinks: fallbackMapperPair([], []),
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!Array.isArray(value)) {
          throw new Error('Failed to coerce multipleLookupValues type field to a string array, as it was not an array');
        }
        if (value.some((v) => typeof v !== 'string')) {
          throw new Error('Can\'t coerce multipleLookupValues to a string array, as it had non string type');
        }
        return value as string[];
      },
    },
  },
  'string[] | null': {
    multipleRecordLinks: fallbackMapperPair(null, null),
    multipleLookupValues: {
      toAirtable: () => { throw new Error('multipleLookupValues type field is readonly'); },
      fromAirtable: (value) => {
        if (!value && !Array.isArray(value)) {
          return null;
        }
        if (!Array.isArray(value)) {
          throw new Error('Failed to coerce multipleLookupValues type field to a string array, as it was not an array');
        }
        if (value.some((v) => typeof v !== 'string')) {
          throw new Error('Can\'t coerce multipleLookupValues to a string array, as it had non string type');
        }
        return value as string[];
      },
    },
  },
};
