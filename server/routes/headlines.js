// routes/headlines.js
const { parseCointelegraph } = require('../parsers/cointelegraph');
const { parseCryptoNews } = require('../parsers/cryptoNews');
const { parseCryptoSlate } = require('../parsers/cryptoSlate');
const { parseBeInCrypto } = require('../parsers/beInCrypto'); // Добавляем новый парсер
const { translateText } = require('../utils/translate');
const { parseTimeAgoToMinutes } = require('../utils/timeParser');

const getHeadlines = async (req, res) => {
  let browser;
  try {
    browser = await req.puppeteer.launch({ headless: 'new' });

    const cointelegraphHeadlines = await parseCointelegraph(browser);
    const cryptoNewsHeadlines = await parseCryptoNews(browser);
    const cryptoSlateHeadlines = await parseCryptoSlate(browser);
    const beInCryptoHeadlines = await parseBeInCrypto(browser); // Добавляем вызов парсера

    const allHeadlines = [
      ...cointelegraphHeadlines,
      ...cryptoNewsHeadlines,
      ...cryptoSlateHeadlines,
      ...beInCryptoHeadlines,
    ];

    const translatedHeadlines = [];
    for (const item of allHeadlines) {
      console.log(`Отправляем на перевод: ${item.title}`);
      const subtitle = await translateText(item.title);
      translatedHeadlines.push({ ...item, subtitle });
    }

    translatedHeadlines.sort((a, b) => {
      const minutesA = parseTimeAgoToMinutes(a.timeAgo);
      const minutesB = parseTimeAgoToMinutes(b.timeAgo);
      return minutesA - minutesB;
    });

    res.json(translatedHeadlines);
  } catch (error) {
    console.error('Общая ошибка:', error);
    res.status(500).json({ error: 'Failed to fetch headlines' });
  } finally {
    if (browser) await browser.close();
  }
};

module.exports = { getHeadlines };
