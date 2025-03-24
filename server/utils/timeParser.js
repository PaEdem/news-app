// server/utils/timeParser.js
const parseTimeAgoToMinutes = (timeAgo) => {
  if (!timeAgo || typeof timeAgo !== 'string') return Infinity; // Если время неизвестно, считаем его очень старым

  const timeUnits = {
    second: 1 / 60, // 1 секунда = 1/60 минуты
    minute: 1,
    hour: 60,
    day: 60 * 24,
    week: 60 * 24 * 7,
    month: 60 * 24 * 30,
    year: 60 * 24 * 365,
  };

  // Разбиваем строку, например, "1 hour ago" → ["1", "hour"]
  const match = timeAgo.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago/i);
  if (!match) return Infinity; // Если формат не распознан, считаем новость очень старой

  const value = parseInt(match[1], 10); // Числовое значение (например, 1)
  const unit = match[2].toLowerCase(); // Единица времени (например, "hour")

  return value * (timeUnits[unit] || Infinity); // Переводим в минуты
};

module.exports = { parseTimeAgoToMinutes };
