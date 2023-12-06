import type { NextApiRequest, NextApiResponse } from 'next';
import createHttpError from 'http-errors';
import db from '../../../lib/api/db';
import {
  cohortClassTable, cohortTable, participantTable, zoomAccountTable,
} from '../../../lib/api/db/tables';
import { apiRoute } from '../../../lib/api/apiRoute';

export type MeetingParticipantsRequest = {
  cohortId: string,
};

export type MeetingParticipantsResponse = {
  type: 'success',
  cohortClassId: string,
  participants: {
    id: string,
    name: string,
    role: 'host' | 'participant',
  }[],
  joinWithAppUrl: string,
} | {
  type: 'redirect',
  to: string,
} | {
  type: 'error',
  message: string,
};

export default apiRoute(async (
  req: NextApiRequest,
  res: NextApiResponse<MeetingParticipantsResponse>,
) => {
  const cohort = await db.get(cohortTable, req.body.cohortId);

  const allCohortClasses = await db.scan(cohortClassTable);
  const cohortCohortClasses = allCohortClasses.filter((cohortClass) => (
    cohortClass.Cohort === req.body.cohortId && cohortClass['Start date/time'] !== null
  ));
  const cohortClassesWithDistance = cohortCohortClasses.map((cohortClass) => ({
    cohortClass,
    distance: Math.abs((Date.now() / 1000) - cohortClass['Start date/time']!),
  }));
  if (cohortClassesWithDistance.length === 0) {
    res.status(404).json({
      type: 'error',
      message: 'No cohort classes found for this cohort.',
    });
    return;
  }

  let nearestCohortClassWithDistance = cohortClassesWithDistance[0];
  cohortClassesWithDistance.forEach((cohortClassWithDistance) => {
    if (cohortClassWithDistance.distance < nearestCohortClassWithDistance.distance) {
      nearestCohortClassWithDistance = cohortClassWithDistance;
    }
  });
  const { cohortClass } = nearestCohortClassWithDistance;

  if (!cohortClass['Zoom account']) {
    throw new createHttpError.InternalServerError(`Cohort class ${cohortClass.id} missing Zoom account`);
  }
  const zoomAccount = await db.get(zoomAccountTable, cohortClass['Zoom account']);
  const facilitator = await db.get(participantTable, cohort.Facilitator);
  const participants = await Promise.all(
    cohortClass['Participants (Expected)']
      .map((participantId) => db.get(participantTable, participantId)),
  );

  res.status(200).json({
    type: 'success',
    cohortClassId: cohortClass.id,
    participants: [
      { id: facilitator.id, name: facilitator.Name, role: 'host' as const },
      ...participants.map((participant) => ({ id: participant.id, name: participant.Name, role: 'participant' as const })),
    // eslint-disable-next-line no-nested-ternary
    ].sort((a, b) => ((a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0)),
    joinWithAppUrl: zoomAccount['Meeting link'],
  });
}, 'insecure_no_auth');
