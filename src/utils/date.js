import moment, {duration} from "moment";

const addLeadingRank = (value) => String(value).padStart(2, `0`);

const dateToString = (date) => moment(date).format(`DD/MM/YY HH:mm`);

const timeToString = (date) => moment(date).format(`HH:mm`);

const formatDateToISOString = (date) => moment(date).format();

const formatDayDate = (date) => moment(date).format(`DD/MM/YYYY`);

const formatMonthDate = (date) => moment(date).format(`MMM D`);

const getDatesDifference = (startDate, endDate) => {
  const {days, hours, minutes} = duration(endDate - startDate)._data;

  return `${
    days > 0 ? addLeadingRank(days) + `D ` : ``
  }${
    days > 0 || hours > 0 ? addLeadingRank(hours) + `H ` : ``
  }${
    addLeadingRank(minutes) + `M`
  }`;
};

export {
  addLeadingRank,
  getDatesDifference,
  dateToString,
  timeToString,
  formatDateToISOString,
  formatDayDate,
  formatMonthDate
};
