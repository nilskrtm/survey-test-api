import * as fs from 'fs';
import * as path from 'path';

type PasswordResetEmailProps = {
  passwordResetLink: string;
};

type PasswordResetEmail = {
  html: string;
  subject: string;
};

const PasswordResetEmail: (
  props: PasswordResetEmailProps,
) => PasswordResetEmail = (props: PasswordResetEmailProps) => {
  const subject = 'Ihre angefragte Passwort-Änderung';
  const html = fs.readFileSync(
    path.join(__dirname, 'html', 'password-reset.html'),
    'utf8',
  );

  return {
    html: html
      .replace(/PLACEHOLDER_PASSWORD_RESET_LINK/g, props.passwordResetLink)
      .replace(/PLACEHOLDER_TITLE/g, process.env.EMAIL_TITLE || ''),
    subject: subject,
  };
};

export default PasswordResetEmail;
