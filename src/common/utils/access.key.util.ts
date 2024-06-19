import crypto from 'crypto';

export const generateAccessKey: (length?: number) => string = length => {
  length = length || 10;
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);

  crypto.getRandomValues(randomArray);
  randomArray.forEach(number => {
    result += chars[number % chars.length];
  });

  return result;
};
