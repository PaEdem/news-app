// server/parsers/cryptoSlate.js
const parseCryptoSlate = async (browser) => {
  const page = await browser.newPage();
  const headlines = [];
  let pageNumber = 1;
  const maxPages = 3;

  try {
    while (headlines.length < 2 && pageNumber <= maxPages) {
      const url =
        pageNumber === 1 ? 'https://cryptoslate.com/news/' : `https://cryptoslate.com/news/page/${pageNumber}/`;
      console.log(`Парсим страницу CryptoSlate: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2' });

      await page.waitForSelector('.list-post article', { timeout: 10000 });
      await page.waitForFunction(() => document.querySelectorAll('.list-post article .content .title h2').length > 0, {
        timeout: 10000,
      });

      const pageHeadlines = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.list-post article'));
        return items.map((item) => {
          const titleElement = item.querySelector('.content .title h2');
          const metaElement = item.querySelector('.content .post-meta');
          const timeElement = metaElement ? metaElement.querySelector('span:last-child') : null;
          const linkElement = item.querySelector('a');
          return {
            site: 'CryptoSlate',
            timeAgo: timeElement ? timeElement.textContent.trim() : 'Unknown time',
            title: titleElement ? titleElement.textContent.trim() : 'No title',
            link: linkElement ? linkElement.href : '', // Извлекаем ссылку
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
    console.error('Ошибка при парсинге CryptoSlate:', error);
    return headlines.length > 0 ? headlines.slice(0, 2) : [];
  } finally {
    await page.close();
  }
};

module.exports = { parseCryptoSlate };
