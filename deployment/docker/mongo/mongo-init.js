db.createCollection('users');

db.users.insertOne({
  _id: '93ae77c2-5be2-4ead-9f36-abe3b32eca11',
  username: 'admin',
  email: 'admin@test.local',
  firstname: 'Admin',
  lastname: 'Admin',
  // 'password'
  password:
    '$argon2id$v=19$m=65536,t=3,p=4$/dneKfLX455msXi/F3SOkg$1FB26hCXERM9HmyuwrIdRJQIMKE+QqskVWZXoYWSnHQ',
  accessKey: '123456789',
  permissionLevel: 1,
});
