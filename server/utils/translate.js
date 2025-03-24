// server/utils/translate.js
const fetch = require('node-fetch');

const translateText = async (text, source = 'en', target = 'ru') => {
  try {
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: 'text',
      }),
    });
    const data = await response.json();
    console.log(`Ответ от API для "${text}":`, data);
    return data.translatedText || text;
  } catch (error) {
    console.error(`Ошибка перевода "${text}":`, error);
    return text;
  }
};

module.exports = { translateText };
