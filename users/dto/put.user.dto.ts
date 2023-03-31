import {PermissionLevel} from '../../common/enums/common.permissionlevel.enum';

export interface PutUserDTO {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  accessKey: string;
  permissionLevel: PermissionLevel;
}
