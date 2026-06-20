export const ADMIN_EMAILS = [
  'admin@angilu.com',
  'saiswaroop.mukkanti1999@gmail.com',
  'manikantas0180@gmail.com',
  'angilu.info@gmail.com'
];

export const isAdminEmail = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === email.toLowerCase().trim());
};
