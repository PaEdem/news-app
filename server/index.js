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

app.get('/headlines', getHeadlines);
app.post('/article', getArticleText);
app.post('/modify-text', modifyText);

// Маршрут для сохранения файла
app.post('/save-text-file', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    console.log('Ошибка: Недостаточно данных для сохранения файла');
    return res.status(400).json({ error: 'Недостаточно данных для сохранения файла' });
  }

  try {
    // Формируем имя подкаталога на основе текущей даты (например, 2025_03_23)
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '_'); // 2025_03_23
    const baseDir = 'C:\\projects\\news-downloads'; // Базовая папка
    const dateDir = path.join(baseDir, currentDate); // Папка с датой: C:\projects\news-downloads\2025_03_23

    // Очищаем название файла от недопустимых символов и ограничиваем длину
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 50);
    let fileName = `${sanitizedTitle}.txt`;
    let filePath = path.join(dateDir, fileName); // Полный путь: C:\projects\news-downloads\2025_03_23\EthereumWhalesDropMillionsonETH.txt

    // Создаём базовую директорию и подкаталог, если они не существуют
    console.log(`Создаём директорию: ${dateDir}`);
    await fs.mkdir(dateDir, { recursive: true });

    // Проверяем, существует ли файл, и добавляем суффикс при необходимости
    let counter = 1;
    while (true) {
      try {
        await fs.access(filePath); // Проверяем, существует ли файл
        // Если файл существует, добавляем суффикс (_1, _2 и т.д.) и пробуем снова
        fileName = `${sanitizedTitle}_${counter}.txt`;
        filePath = path.join(dateDir, fileName);
        counter++;
      } catch (error) {
        // Если файл не существует, выходим из цикла
        break;
      }
    }

    // Сохраняем файл
    console.log(`Сохраняем файл по пути: ${filePath}`);
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Файл успешно сохранён: ${filePath}`);

    res.json({ status: 'success', path: filePath });
  } catch (error) {
    console.error('Ошибка при сохранении файла:', error);
    res.status(500).json({ error: 'Не удалось сохранить файл' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
