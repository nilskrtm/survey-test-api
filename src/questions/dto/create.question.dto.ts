import { Survey } from '../../surveys/daos/surveys.dao';

export interface CreateQuestionDTO {
  _id?: string;
  question?: string;
  timeout?: number;
  order?: number;
  answerOptions?: [];

  // other

  survey: Survey;
}
