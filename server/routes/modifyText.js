// server/routes/modifyText.js
const { modifyTextWithGroq } = require('../utils/modifyTextWithGroq');

const modifyText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Не указан текст' });
  }

  try {
    const modifiedText = await modifyTextWithGroq(text);

    // Парсим ответ нейросети (предполагаем, что он в формате списка)
    const lines = modifiedText.split('\n').filter((line) => line.trim());
    let englishTitle = '',
      englishText = '',
      russianTitle = '',
      russianText = '',
      tags = [];

    let currentSection = '';
    for (const line of lines) {
      if (line.startsWith('- English version')) {
        currentSection = 'english';
      } else if (line.startsWith('- Russian translation')) {
        currentSection = 'russian';
      } else if (line.startsWith('- #tags')) {
        currentSection = 'tags';
      } else if (currentSection === 'english') {
        if (line.startsWith('  - Title: ')) {
          englishTitle = line.replace('  - Title: ', '').trim();
        } else if (line.startsWith('  - Text: ')) {
          englishText = line.replace('  - Text: ', '').trim();
        }
      } else if (currentSection === 'russian') {
        if (line.startsWith('  - Заголовок: ')) {
          russianTitle = line.replace('  - Заголовок: ', '').trim();
        } else if (line.startsWith('  - Текст: ')) {
          russianText = line.replace('  - Текст: ', '').trim();
        }
      } else if (currentSection === 'tags' && line.startsWith('  - ')) {
        tags.push(line.replace('  - ', '').trim());
      }
    }

    res.json({
      english: { title: englishTitle, text: englishText },
      russian: { title: russianTitle, text: russianText },
      tags,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { modifyText };
