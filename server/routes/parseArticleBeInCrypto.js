// server/routes/parseArticleBeInCrypto.js
const parseArticleBeInCrypto = async (page) => {
  console.log('Это страница BeInCrypto, пробуем найти селектор для текста статьи');

  const articleSelector = '.entry-content .entry-content-inner';
  console.log(`Пробуем селектор: ${articleSelector}`);

  try {
    await page.waitForSelector(articleSelector, { timeout: 15000 });
    console.log(`Селектор найден: ${articleSelector}`);
  } catch (error) {
    console.log(`Селектор ${articleSelector} не найден:`, error.message);
    const pageContent = await page.evaluate(() => document.documentElement.outerHTML);
    console.log('HTML страницы для отладки:', pageContent.slice(0, 500), '...');
    return 'Не удалось найти подходящий селектор для текста статьи';
  }

  await page.waitForFunction((selector) => document.querySelector(selector), { timeout: 15000 }, articleSelector);

  return await page.evaluate((selector) => {
    const article = document.querySelector(selector);
    if (!article) return 'Text not found';

    const elements = Array.from(article.children);
    let textParts = [];

    for (const element of elements) {
      // Пропускаем рекламу, связанные статьи, информацию об авторе и другие ненужные блоки
      if (
        element.classList.contains('ad-wrapper') ||
        element.classList.contains('related_posts') ||
        element.classList.contains('in-brief-block') ||
        element.closest('[data-el="bic-c-about-author"]') ||
        element.closest('[data-speechify_ignore="true"]')
      ) {
        continue;
      }

      // Извлекаем текст из <p> и <blockquote>
      if (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase() === 'blockquote') {
        const text = element.textContent.trim();
        if (text && text !== ' ') {
          textParts.push(text);
        }
      }
    }

    return textParts.length > 0 ? textParts.join(' ') : 'Text not found';
  }, articleSelector);
};

module.exports = { parseArticleBeInCrypto };
