// server/parsers/cryptoNews.js
const parseCryptoNews = async (browser) => {
  const page = await browser.newPage();
  try {
    await page.goto('https://crypto.news/news/', { waitUntil: 'networkidle2' });

    await page.waitForSelector('.post-loop', { timeout: 10000 });

    const headlines = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.post-loop'));
      return items.slice(0, 2).map((item) => {
        const titleElement = item.querySelector('.post-loop__title a');
        const timeElement = item.querySelector('.post-loop__date');
        const linkElement = item.querySelector('.post-loop__link');
        return {
          site: 'Crypto News',
          timeAgo: timeElement ? timeElement.textContent.trim() : 'Unknown time',
          title: titleElement ? titleElement.textContent.trim() : 'No title',
          link: linkElement ? linkElement.href : '', // Извлекаем ссылку
        };
      });
    });

    return headlines;
  } catch (error) {
    console.error('Ошибка при парсинге Crypto News:', error);
    return [];
  } finally {
    await page.close();
  }
};

module.exports = { parseCryptoNews };
