const dayjs = require("dayjs");

const generateDateRange = ({ dateStart, dateEnd, year, month }) => {
  let startDate, endDate;

  if (year && month) {
    startDate = dayjs(`${year}-${String(month).padStart(2, "0")}-01`);
    endDate = startDate.endOf("month");
  } else if (dateStart && dateEnd) {
    startDate = dayjs(dateStart);
    endDate = dayjs(dateEnd);
  } else {
    throw new Error("Harap berikan dateStart & dateEnd atau year & month.");
  }

  // Inisialisasi array tanggal
  const dateRange = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    dateRange.push(currentDate.format("YYYY-MM-DD"));
    currentDate = currentDate.add(1, "day");
  }

  return dateRange;
};

module.exports = generateDateRange;
