// routes/parseArticleCointelegraph.js
const parseArticleCointelegraph = async (page) => {
  console.log('Это страница Cointelegraph, пробуем найти селектор для текста статьи');

  // Используем правильный селектор
  const articleSelector = '.post-content';
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
      // Останавливаем парсинг перед формой подписки
      if (
        element.tagName.toLowerCase() === 'form' &&
        element.classList.contains('newsletter-subscription-form_k9oQq')
      ) {
        break;
      }

      // Извлекаем текст из <p> и <em>
      if (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase() === 'em') {
        const text = element.textContent.trim();
        if (text && text !== ' ') {
          textParts.push(text);
        }
      }
    }

    return textParts.length > 0 ? textParts.join(' ') : 'Text not found';
  }, articleSelector);
};

module.exports = { parseArticleCointelegraph };
