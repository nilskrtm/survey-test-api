export interface PutQuestionDTO {
  _id: string;
  question: string;
  timeout: number;
  order: number;
  answerOptions: any[];
}
