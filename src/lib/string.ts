/**
 * Capitalizes the first letter of a string.
 *
 * @example
 * capitalizeFirstLetter("hello") // "Hello"
 */
export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
