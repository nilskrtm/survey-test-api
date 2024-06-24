import crypto from 'crypto';

const ACCESS_KEY_LENGTH = 10;

export const generateAccessKey: () => string = () => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(ACCESS_KEY_LENGTH);

  crypto.getRandomValues(randomArray);
  randomArray.forEach(number => {
    result += chars[number % chars.length];
  });

  return result;
};
