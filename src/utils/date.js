const MILLISECOND_IN_MINUTE = 60000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;


const addLeadingRank = (number) => {
  if (number < 10) {
    return `0` + number;
  }
  return number;
};

const timeToString = (date = new Date()) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${hours < 10 ? `0` + hours : hours}:${minutes < 10 ? `0` + minutes : minutes}`;
};

const timeToDateString = (date = new Date(), needShowTime = true) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDay();

  return `${year}-${month < 10 ? `0` + month : month}-${day < 10 ? `0` + day : day}${needShowTime ? `T${timeToString(date)}` : ``}`;
};

const getDatesDifference = (startDate = new Date(), endDate = new Date()) => {
  let difference = endDate - startDate;
  difference -= difference % MILLISECOND_IN_MINUTE;
  difference = difference / MILLISECOND_IN_MINUTE;
  const minutes = difference % MINUTES_IN_HOUR;
  difference -= minutes;
  difference = difference / MINUTES_IN_HOUR;
  const hours = difference % HOURS_IN_DAY;
  difference -= hours;
  const days = difference / HOURS_IN_DAY;

  let formattedTime = ``;

  if (days > 0) {
    formattedTime = addLeadingRank(days) + `D `;
  }

  if (days > 0 || hours > 0) {
    formattedTime = formattedTime + addLeadingRank(hours) + `H `;
  }

  formattedTime = formattedTime + addLeadingRank(minutes) + `M`;

  return formattedTime;
};

export {
  addLeadingRank,
  getDatesDifference,
  timeToDateString,
  timeToString
};
