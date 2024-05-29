import { PutPasswordRequestDTO } from './put.password.request.dto';

export interface PatchPasswordRequestDTO
  extends Partial<PutPasswordRequestDTO> {}
