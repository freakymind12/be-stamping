const dayjs = require("dayjs");

const generateFiscalMonths = (year) => {
  const start = dayjs(`${year}-04-01`)
  const fiscal = []
  for (let i = 0; i < 12; i++) {
    const ym = start.add(i, 'month')
    fiscal.push(`${ym.year()}-${ym.month() + 1}`)
  }
  return fiscal
}

module.exports = generateFiscalMonths
