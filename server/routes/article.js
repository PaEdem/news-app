// routes/article.js
const { parseArticleCryptoSlate } = require('./parseArticleCryptoSlate');
const { parseArticleCointelegraph } = require('./parseArticleCointelegraph');
const { parseArticleCryptoNews } = require('./parseArticleCryptoNews');
const { parseArticleBeInCrypto } = require('./parseArticleBeInCrypto'); // Добавляем новый парсер

const getArticleText = async (req, res) => {
  const { link, site } = req.body;
  if (!link || !site) {
    return res.status(400).json({ error: 'Link and site are required' });
  }

  let browser;
  try {
    console.log('Запускаем Puppeteer...');
    browser = await req.puppeteer.launch({ headless: 'new' });
    console.log('Puppeteer запущен');
    const page = await browser.newPage();
    console.log('Новая страница создана');

    await page.setExtraHTTPHeaders({
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    });

    console.log(`Переходим по ссылке: ${link}`);
    await page.goto(link, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('Страница загружена');

    let articleText = '';

    if (site === 'CryptoSlate') {
      articleText = await parseArticleCryptoSlate(page, link);
    } else if (site === 'Cointelegraph') {
      articleText = await parseArticleCointelegraph(page);
    } else if (site === 'Crypto News') {
      articleText = await parseArticleCryptoNews(page);
    } else if (site === 'BeInCrypto') {
      articleText = await parseArticleBeInCrypto(page); // Добавляем обработку BeInCrypto
    } else {
      return res.status(400).json({ error: 'Unknown site' });
    }

    res.json({ text: articleText });
  } catch (error) {
    console.error(`Error fetching article (${link}):`, error);
    res.status(500).json({ error: 'Failed to fetch article text' });
  } finally {
    if (browser) {
      console.log('Закрываем браузер');
      await browser.close();
    }
  }
};

module.exports = { getArticleText };
