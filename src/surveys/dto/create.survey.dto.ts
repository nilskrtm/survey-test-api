export interface CreateSurveyDTO {
  id?: string;
  name?: string;
  description?: string;
  owner?: string;
  created?: Date;
  edited?: Date;
  draft?: boolean;
  archived?: boolean;
  questions?: [];
}
