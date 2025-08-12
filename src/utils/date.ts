export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().slice(0, 10); // "YYYY-MM-DD"
};

export const getPastYearString = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 1); // subtract 1 year
  today.setDate(today.getDate() + 1);
  return today.toISOString().slice(0, 10); // "YYYY-MM-DD"
};

export function calculateAge(birthdate: string | Date): number {
  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}
