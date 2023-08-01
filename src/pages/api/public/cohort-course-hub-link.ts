import type { NextApiRequest, NextApiResponse } from 'next';
import jsonwebtoken from 'jsonwebtoken';
import { apiRoute } from '../../../lib/api/apiRoute';
import db from '../../../lib/api/db';
import { cohortTable, courseTable, iterationTable } from '../../../lib/api/db/tables';

export type CohortCourseHubLinkRequest = {
  cohortId: string,
};

export type CohortCourseHubLinkResponse = {
  type: 'success',
  url: string,
} | {
  type: 'error',
  message: string,
};

export default apiRoute(async (
  req: NextApiRequest,
  res: NextApiResponse<CohortCourseHubLinkResponse>,
) => {
  const cohort = await db.get(cohortTable, req.body.cohortId);
  const iteration = await db.get(iterationTable, cohort['Iteration (link) (from Facilitator)']);
  const course = await db.get(courseTable, iteration.Courses);

  res.status(200).json({
    type: 'success',
    url: course['Course Site'],
  });
}, 'insecure_no_auth');
