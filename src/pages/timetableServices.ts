export const checkMatchMinute = (
  date: Date | string,
  minutes: number[]
): boolean => {
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  const targetMinute = targetDate.getMinutes();
  return minutes.includes(targetMinute);
};

export const getGridTemplateColumns = (repeat: number, minWidth?: number) => {
  return minWidth
    ? `repeat(${repeat}, minmax(${minWidth}rem, 1fr))`
    : `repeat(${repeat}, minmax(0, 1fr))`;
};
