import fs from 'fs';
import path from 'path';

const bootstrapBody = {
  bootstrapKey: 'local-bootstrap-key',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@example.com',
  phone: '01234567890',
  nic: '1234567890123',
  dob: '1990-01-01',
  gender: 'Male',
  password: 'password123',
};

const bootstrapRes = await fetch('http://127.0.0.1:4000/api/v1/user/admin/bootstrap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bootstrapBody),
});
const bootstrapText = await bootstrapRes.text();
console.log('BOOTSTRAP_STATUS', bootstrapRes.status);
console.log('BOOTSTRAP_BODY', bootstrapText);

const loginBody = {
  email: 'admin@example.com',
  password: 'password123',
  role: 'Admin',
};

const loginRes = await fetch('http://127.0.0.1:4000/api/v1/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(loginBody),
});
const loginText = await loginRes.text();
console.log('LOGIN_STATUS', loginRes.status);
console.log('LOGIN_BODY', loginText);

if (loginRes.status !== 200) process.exit(1);

const setCookie = loginRes.headers.get('set-cookie');
console.log('SET_COOKIE', setCookie);

const formData = new FormData();
formData.append('firstName', 'Tushar');
formData.append('lastName', 'Doctor');
formData.append('email', 'tushar@gmail.com');
formData.append('phone', '01234567890');
formData.append('nic', '1234567890123');
formData.append('dob', '1990-01-01');
formData.append('gender', 'Male');
formData.append('password', '7746');
formData.append('doctorDepartment', 'General');
const avatarPath = path.resolve('./tmp/avatar.txt');
formData.append('docAvatar', fs.createReadStream(avatarPath));

const createRes = await fetch('http://127.0.0.1:4000/api/v1/user/doctor/addnew', {
  method: 'POST',
  headers: {
    Cookie: setCookie,
  },
  body: formData,
});
const createText = await createRes.text();
console.log('CREATE_STATUS', createRes.status);
console.log('CREATE_BODY', createText);
