import type { NextApiRequest, NextApiResponse } from 'next';
import { apiRoute } from '../../../lib/api/apiRoute';
import jsonwebtoken from 'jsonwebtoken';
import db from '../../../lib/api/db';
import { cohortClassTable, cohortTable, zoomAccountTable } from '../../../lib/api/db/tables';
import env from '../../../lib/api/env';

export type MeetingJwtRequest = {
  cohortClassId: string,
  password?: string,
}

export type MeetingJwtResponse = {
  type: 'success',
  meetingSdkJwt: string,
  meetingNumber: string,
  meetingPassword: string,
} | {
  type: 'error',
  message: string,
};

export default apiRoute(async (
  req: NextApiRequest,
  res: NextApiResponse<MeetingJwtResponse>,
) => {
  const cohortClass = await db.get(cohortClassTable, req.body.cohortClassId);
  const cohort = await db.get(cohortTable, cohortClass.Cohort);
  const zoomAccount = await db.get(zoomAccountTable, cohort['Zoom account']);
  const meetingLink = zoomAccount['Meeting link'];
  const matches = meetingLink.match(/\/j\/(\d+)\?pwd=([a-zA-Z0-9]+)/)
  if (!matches) {
    res.status(404).json({
      type: 'error',
      message: 'No zoom link found for this cohort.'
    });
    return;
  }
  const [, meetingNumber, meetingPassword] = matches;

  const issuedAt = Math.round(Date.now() / 1000);
  const expiresAt = issuedAt + 3600 * 4 /* 4 hours */;
  const oPayload = {
    sdkKey: env.NEXT_PUBLIC_ZOOM_CLIENT_ID,
    mn: meetingNumber,
    role: 0,
    iat: issuedAt,
    exp: expiresAt,
    tokenExp: expiresAt
  }

  const meetingSdkJwt = jsonwebtoken.sign(oPayload, env.ZOOM_CLIENT_SECRET, { algorithm: 'HS256' })
  
  res.status(200).json({
    type: 'success',
    meetingSdkJwt,
    meetingNumber,
    meetingPassword,
  });
}, 'insecure_no_auth');
