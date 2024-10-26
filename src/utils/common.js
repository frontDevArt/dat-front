export const toTitleCaseFromSnakeCase = (str) => {
  return str
    .split('_') // Split the string at each underscore
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(' '); // Join the words with spaces
};
