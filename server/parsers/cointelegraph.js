// server/parsers/cointelegraph.js
const parseCointelegraph = async (browser) => {
  const page = await browser.newPage();
  try {
    await page.goto('https://cointelegraph.com/category/latest-news', { waitUntil: 'networkidle2' });

    await page.waitForSelector('li[data-testid="posts-listing__item"]', { timeout: 10000 });

    const headlines = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('li[data-testid="posts-listing__item"]'));
      return items.slice(0, 2).map((item) => {
        const titleElement = item.querySelector('.post-card-inline__title');
        const timeElement = item.querySelector('.post-card-inline__date');
        const linkElement = item.querySelector('.post-card-inline__title-link');
        return {
          site: 'Cointelegraph',
          timeAgo: timeElement ? timeElement.textContent.trim() : 'Unknown time',
          title: titleElement ? titleElement.textContent.trim() : 'No title',
          link: linkElement ? linkElement.href : '', // Извлекаем ссылку
        };
      });
    });

    return headlines;
  } catch (error) {
    console.error('Ошибка при парсинге Cointelegraph:', error);
    return [];
  } finally {
    await page.close();
  }
};

module.exports = { parseCointelegraph };
