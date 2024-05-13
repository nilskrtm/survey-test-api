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

export const formatDateYYYmmdd: (date: Date) => string = date => {
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  const year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};
