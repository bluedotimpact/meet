import createHttpError from 'http-errors';

export const parseZoomLink = (link: string): { meetingNumber: string, meetingPassword: string } => {
  const matches = link.match(/\/j\/(\d+)\?pwd=([a-zA-Z0-9]+)/);
  if (!matches) {
    throw new createHttpError.InternalServerError('Invalid or missing zoom link for this cohort');
  }
  const [, number, password] = matches;
  return { meetingNumber: number, meetingPassword: password };
};
