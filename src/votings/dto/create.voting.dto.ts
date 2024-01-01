export interface CreateVotingDTO {
  _id?: string;
  survey: string;
  date: Date;
  votes: { [question: string]: string }[];
}
