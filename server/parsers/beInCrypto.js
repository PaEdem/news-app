// server/parsers/beInCrypto.js
const parseBeInCrypto = async (browser) => {
  const page = await browser.newPage();
  const headlines = [];
  let pageNumber = 1;
  const maxPages = 3;

  try {
    while (headlines.length < 2 && pageNumber <= maxPages) {
      const url = pageNumber === 1 ? 'https://beincrypto.com/news/' : `https://beincrypto.com/news/page/${pageNumber}/`;
      console.log(`Парсим страницу BeInCrypto: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2' });

      await page.waitForSelector('div[data-el="bic-c-news-big"]', { timeout: 10000 });
      await page.waitForFunction(() => document.querySelectorAll('div[data-el="bic-c-news-big"] h5 a').length > 0, {
        timeout: 10000,
      });

      const pageHeadlines = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('div[data-el="bic-c-news-big"]'));
        return items.map((item) => {
          const titleElement = item.querySelector('h5 a');
          const timeElement = item.querySelector('time.date');
          const linkElement = item.querySelector('h5 a');
          return {
            site: 'BeInCrypto',
            timeAgo: timeElement ? timeElement.textContent.trim() : 'Unknown time',
            title: titleElement ? titleElement.textContent.trim() : 'No title',
            link: linkElement ? linkElement.href : '',
          };
        });
      });

      console.log(`Собрано ${pageHeadlines.length} новостей с текущей страницы`);
      const validHeadlines = pageHeadlines.filter((headline) => headline.title !== 'No title');
      console.log(`Из них валидных (с заголовком): ${validHeadlines.length}`);
      headlines.push(...validHeadlines);
      console.log(`Всего собрано ${headlines.length} валидных новостей`);
      pageNumber++;
    }

    return headlines.slice(0, 2);
  } catch (error) {
    console.error('Ошибка при парсинге BeInCrypto:', error);
    return headlines.length > 0 ? headlines.slice(0, 2) : [];
  } finally {
    await page.close();
  }
};

module.exports = { parseBeInCrypto };
