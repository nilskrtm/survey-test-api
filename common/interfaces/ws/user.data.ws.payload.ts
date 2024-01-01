import { User } from '../../../users/daos/users.dao';

export interface UserDataWSPayload
  extends Pick<
    User,
    'username' | 'email' | 'firstname' | 'lastname' | 'permissionLevel'
  > {}
