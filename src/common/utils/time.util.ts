export const getDatesBetweenDates: (
  startDate: Date,
  endDate: Date,
) => Array<Date> = (startDate, endDate) => {
  const dates: Array<Date> = [];

  const fixedStartDate = new Date(startDate);
  const fixedEndDate = new Date(endDate);

  fixedStartDate.setHours(0, 0, 0, 0);
  fixedEndDate.setHours(0, 0, 0, 0);

  const iDate = new Date(fixedStartDate);

  while (iDate < fixedEndDate) {
    dates.push(new Date(iDate));
    iDate.setDate(iDate.getDate() + 1);
  }

  dates.push(fixedEndDate);

  return dates;
};

export const getHoursBetweenDates: (
  startDate: Date,
  endDate: Date,
  includeUpperBound?: boolean,
) => Array<Date> = (startDate, endDate, includeUpperBound) => {
  const hours: Array<Date> = [];

  const fixedStartDate = new Date(startDate);
  const fixedEndDate = new Date(endDate);

  fixedStartDate.setMinutes(0, 0, 0);
  fixedEndDate.setHours(fixedEndDate.getHours() + 1, 0, 0, 0);

  const iDate = new Date(fixedStartDate);

  while (iDate < fixedEndDate) {
    hours.push(new Date(iDate));
    iDate.setHours(iDate.getHours() + 1);
  }

  if (includeUpperBound !== undefined && includeUpperBound) {
    hours.push(fixedEndDate);
  }

  return hours;
};

export const formatDateYYYmmdd: (date: Date) => string = date => {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

export const formateDayHH: (date: Date) => string = date => {
  return String(date.getHours()).length === 1
    ? '0' + date.getHours()
    : '' + date.getHours();
};
