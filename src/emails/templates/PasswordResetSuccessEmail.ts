import * as fs from 'fs';
import * as path from 'path';

type PasswordResetSuccessEmail = {
  html: string;
  subject: string;
};

const PasswordResetSuccessEmail: () => PasswordResetSuccessEmail = () => {
  const subject = 'Ihr Passwort wurde geändert';
  const html = fs.readFileSync(
    path.join(__dirname, 'html', 'password-reset-success.html'),
    'utf8',
  );

  return {
    html: html.replace(/PLACEHOLDER_TITLE/g, process.env.EMAIL_TITLE || ''),
    subject: subject,
  };
};

export default PasswordResetSuccessEmail;
