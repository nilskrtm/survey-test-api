import { PermissionLevel } from '../../common/enums/common.permissionlevel.enum';

export interface PutUserDTO {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  accessKey: string;
  permissionLevel: PermissionLevel;
}
