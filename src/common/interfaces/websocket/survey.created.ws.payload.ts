import { Survey } from '../../../surveys/daos/surveys.dao';

export type SurveyCreatedWSPayload = Pick<Survey, '_id'>;
