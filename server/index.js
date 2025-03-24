// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const { getHeadlines } = require('./routes/headlines');
const { getArticleText } = require('./routes/article');
const { modifyText } = require('./routes/modifyText');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Middleware для добавления Puppeteer в каждый запрос
app.use(async (req, res, next) => {
  req.puppeteer = puppeteer;
  next();
});

// Маршруты для получения заголовков, текста статьи и модификации текста
app.get('/headlines', getHeadlines);
app.post('/article', getArticleText);
app.post('/modify-text', modifyText);

// Маршрут для сохранения файла
app.post('/save-text-file', async (req, res) => {
  const { title, content } = req.body;

  // Проверка на наличие необходимых данных
  if (!title || !content) {
    return res.status(400).json({ error: 'Недостаточно данных для сохранения файла' });
  }

  try {
    // Очищаем название файла от недопустимых символов и ограничиваем длину
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
    let fileName = `${sanitizedTitle}.txt`;
    let filePath = path.join(__dirname, 'saved_files', fileName);

    // Создаём директорию saved_files, если она не существует
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    // Проверяем, существует ли файл, и добавляем суффикс при необходимости
    let counter = 1;
    while (true) {
      try {
        await fs.access(filePath); // Проверяем, существует ли файл
        // Если файл существует, добавляем суффикс (_1, _2 и т.д.) и пробуем снова
        fileName = `${sanitizedTitle}_${counter}.txt`;
        filePath = path.join(__dirname, 'saved_files', fileName);
        counter++;
      } catch (error) {
        // Если файл не существует, выходим из цикла
        break;
      }
    }

    // Сохраняем файл с уникальным именем
    await fs.writeFile(filePath, content, 'utf8');

    // Возвращаем успешный ответ с путём к файлу
    res.json({ status: 'success', path: filePath });
  } catch (error) {
    console.error('Ошибка при сохранении файла:', error);
    res.status(500).json({ error: 'Не удалось сохранить файл' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
