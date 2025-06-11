const processProduction = (dateRange, queryResult) => {
  const metrics = [
    'ok', 'ng', 'reject_setting', 'dummy', 
    'production_time', 'stop_time', 'dandori_time', 
    'kadoritsu', 'bekidoritsu'
  ];

  const initializeShiftData = () => 
    Object.fromEntries(metrics.map(metric => [metric, Array(dateRange.length).fill(0)]));

  const updateShiftData = (shiftData, result, index) => {
    metrics.forEach(metric => {
      shiftData[metric][index] += Number(result[metric]) || 0;
    });
  };

  const data = {
    date_range: dateRange,
    shift1: initializeShiftData(),
    shift2: initializeShiftData(),
  };

  queryResult.forEach(({ date, shift, ...result }) => {
    const index = dateRange.indexOf(date.slice(0, 10));
    if (index !== -1) {
      updateShiftData(data[`shift${shift}`], result, index);
    }
  });

  return data;
};

module.exports = processProduction;
