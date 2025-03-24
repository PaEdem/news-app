// routes/parseArticleCryptoSlate.js
const parseArticleCryptoSlate = async (page, link) => {
  const isPressRelease = link.includes('/press-releases/');

  if (isPressRelease) {
    console.log('Это страница press-release, используем селектор .post-box.clearfix article');
    await page.waitForSelector('.post-box.clearfix article', { timeout: 10000 });

    return await page.evaluate(() => {
      const article = document.querySelector('.post-box.clearfix article');
      if (!article) return 'Text not found';

      const elements = Array.from(article.children);
      let textParts = [];

      for (const element of elements) {
        if (element.tagName.toLowerCase() === 'h5') {
          break;
        }

        if (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase() === 'blockquote') {
          const text = element.textContent.trim();
          if (text && text !== ' ') {
            textParts.push(text);
          }
        }
      }

      return textParts.length > 0 ? textParts.join('\n\n') : 'Text not found';
    });
  } else {
    console.log('Это обычная новость, используем селектор .full-article');
    await page.waitForSelector('.full-article', { timeout: 10000 });

    return await page.evaluate(() => {
      const article = document.querySelector('.full-article');
      if (!article) return 'Text not found';

      const elements = Array.from(article.children);
      let textParts = [];

      for (const element of elements) {
        if (element.tagName.toLowerCase() === 'h6') {
          break;
        }

        if (element.tagName.toLowerCase() === 'p' || element.tagName.toLowerCase() === 'blockquote') {
          const text = element.textContent.trim();
          if (text) {
            textParts.push(text);
          }
        }
      }

      return textParts.length > 0 ? textParts.join(' ') : 'Text not found';
    });
  }
};

module.exports = { parseArticleCryptoSlate };
