export interface PutSurveyDTO {
  id: string;
  name: string;
  description: string;
  owner: string;
  created: Date;
  edited: Date;
  draft: boolean;
  archived: boolean;
  questions: any[];
}
