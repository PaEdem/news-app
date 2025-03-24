// stores/fileSaver.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useHeadlinesStore } from './headlines';

export const useFileSaverStore = defineStore('fileSaver', {
  actions: {
    async saveTextFile(index) {
      const headlinesStore = useHeadlinesStore();
      const headline = headlinesStore.headlines[index];
      if (!headline.isModified) {
        console.log(`Текст для ${headline.title} ещё не изменён, сохранение невозможно.`);
        throw new Error('Текст статьи ещё не изменён.');
      }

      headline.isSaving = true;
      try {
        // Формируем содержимое файла
        const englishTitle = headline.articleText.split('\n')[0];
        const englishText = headline.articleText.split('\n')[1];
        const russianTitle = headline.russianTitle;
        const russianText = headline.russianText;

        const fileContent = [
          'English Title:',
          englishTitle,
          '\nEnglish Text:',
          englishText,
          '\nRussian Title:',
          russianTitle,
          '\nRussian Text:',
          russianText,
        ].join('\n');

        // Отправляем запрос на сервер для сохранения файла
        const response = await axios.post('http://localhost:3000/save-text-file', {
          title: englishTitle,
          content: fileContent,
        });

        if (response.data.status === 'success') {
          console.log(`Файл сохранён: ${response.data.path}`);
          headline.isSaved = true;
          localStorage.setItem('headlines', JSON.stringify(headlinesStore.headlines));
          return response.data.path; // Возвращаем путь для уведомления
        } else {
          throw new Error('Не удалось сохранить файл на сервере');
        }
      } catch (error) {
        console.error('Ошибка при сохранении файла:', error);
        throw error;
      } finally {
        headline.isSaving = false;
      }
    },
  },
});
