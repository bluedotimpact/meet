export type PageState =
  | { name: 'select' }
  | { name: 'custom', cohortClassId: string }
  | { name: 'room', jwt: string, participantName: string, meetingNumber: string, meetingPassword: string }
