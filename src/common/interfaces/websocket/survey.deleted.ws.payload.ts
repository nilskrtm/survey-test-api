import { Survey } from '../../../surveys/daos/surveys.dao';

export type SurveyDeletedWSPayload = Pick<Survey, '_id'>;
