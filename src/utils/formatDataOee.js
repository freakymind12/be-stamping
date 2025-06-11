const processDailyOee = (dateRange, queryResult) => {
  // Inisialisasi data OEE harian
  const initializeDailyData = () =>
    ["oee", "availability", "productivity", "quality"].reduce((acc, key) => {
      acc[key] = dateRange.map(() => 0);
      return acc;
    }, {});

  // Struktur data yang akan dikembalikan
  const data = {
    date_range: dateRange,
    daily_oee: initializeDailyData(),
  };

  // Proses data menggunakan reduce
  queryResult.reduce((acc, { date, oee, availability, productivity, quality }) => {
    const index = dateRange.indexOf(date);
    if (index !== -1) {
      acc.oee[index] += Number(oee);
      acc.availability[index] += Number(availability);
      acc.productivity[index] += Number(productivity);
      acc.quality[index] += Number(quality);
    }
    return acc;
  }, data.daily_oee);

  return data;
};

module.exports = processDailyOee;