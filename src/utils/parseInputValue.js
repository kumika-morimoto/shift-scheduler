export const parseInputValue = (val) => {
  if (val === '') return '';
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? 0 : parsed;
};
