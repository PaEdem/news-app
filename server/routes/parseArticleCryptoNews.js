// routes/parseArticleCryptoNews.js
const parseArticleCryptoNews = async (page) => {
  console.log('Это страница Crypto News, пробуем найти селектор для текста статьи');

  // Используем селектор для контента статьи
  const articleSelector = '.post-detail__content';
  console.log(`Пробуем селектор: ${articleSelector}`);

  try {
    await page.waitForSelector(articleSelector, { timeout: 15000 });
    console.log(`Селектор найден: ${articleSelector}`);
  } catch (error) {
    console.log(`Селектор ${articleSelector} не найден:`, error.message);
    // Логируем HTML страницы для отладки
    const pageContent = await page.evaluate(() => document.documentElement.outerHTML);
    console.log('HTML страницы для отладки:', pageContent.slice(0, 500), '...');
    return 'Не удалось найти подходящий селектор для текста статьи';
  }

  // Добавляем ожидание динамической загрузки
  await page.waitForFunction((selector) => document.querySelector(selector), { timeout: 15000 }, articleSelector);

  return await page.evaluate((selector) => {
    const article = document.querySelector(selector);
    if (!article) return 'Text not found';

    const elements = Array.from(article.children);
    let textParts = [];

    for (const element of elements) {
      // Пропускаем рекламу, связанные статьи, твиты и другие блоки
      if (
        element.classList.contains('cn-block-related-link') ||
        element.classList.contains('wp-block-embed') ||
        element.tagName.toLowerCase() === 'div' // Пропускаем рекламу и другие div
      ) {
        continue;
      }

      // Извлекаем текст из <p>
      if (element.tagName.toLowerCase() === 'p') {
        const text = element.textContent.trim();
        if (text && text !== ' ') {
          textParts.push(text);
        }
      }
    }

    return textParts.length > 0 ? textParts.join(' ') : 'Text not found';
  }, articleSelector);
};

module.exports = { parseArticleCryptoNews };
