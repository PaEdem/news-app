// stores/articles.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useHeadlinesStore } from './headlines';

export const useArticlesStore = defineStore('articles', {
  actions: {
    async fetchArticleText(index) {
      const headlinesStore = useHeadlinesStore();
      const headline = headlinesStore.headlines[index];
      if (!headline.link || !headline.site) {
        console.log(`Нет ссылки или сайта для статьи: ${headline.title}`);
        headline.isFailed = true;
        return;
      }

      const now = Date.now();
      const cacheDuration = 10 * 60 * 1000; // 10 минут
      if (
        headline.articleText &&
        headline.articleText !== 'Failed to load article text' &&
        headline.lastFetched &&
        now - headline.lastFetched < cacheDuration
      ) {
        console.log(`Используем кэшированный текст для ${headline.title}, последний запрос был менее 10 минут назад`);
        return;
      }

      console.log(`Запрос текста статьи: ${headline.link} (${headline.site})`);
      try {
        const response = await axios.post(
          'http://localhost:3000/article',
          {
            link: headline.link,
            site: headline.site,
          },
          {
            timeout: 60000,
          }
        );
        console.log('Ответ от сервера:', response.data);
        headline.articleText = response.data.text;
        headline.originalArticleText = response.data.text;
        headline.isModified = false;
        headline.isFailed = false;
        headline.lastFetched = now;
        console.log(`Текст статьи загружен: ${headline.articleText.slice(0, 100)}...`);
        localStorage.setItem('headlines', JSON.stringify(headlinesStore.headlines));
      } catch (error) {
        console.error(`Ошибка при загрузке текста статьи (${headline.link}):`, error.message);
        headline.articleText = 'Failed to load article text';
        headline.originalArticleText = 'Failed to load article text';
        headline.isFailed = true;
        headline.lastFetched = now;
        localStorage.setItem('headlines', JSON.stringify(headlinesStore.headlines));
        throw error;
      }
    },
    async processHeadlines() {
      const headlinesStore = useHeadlinesStore();
      const selected = headlinesStore.headlines.filter((h) => h.isSelected);
      console.log('Выбранные заголовки для обработки:', selected);

      if (selected.length === 0) {
        console.log('Нет выбранных заголовков для обработки');
        headlinesStore.isProcessed = false;
        throw new Error('Пожалуйста, выберите хотя бы одну новость.');
      }

      headlinesStore.isLoading = true;
      console.log('Устанавливаем isLoading = true');

      try {
        selected.forEach((headline) => {
          headline.isFailed = false;
          headline.isSaving = false;
        });

        const promises = selected.map(async (headline, idx) => {
          const index = headlinesStore.headlines.findIndex((h) => h.link === headline.link);
          if (index === -1) return;

          console.log(`Обрабатываем заголовок: ${headline.title}`);
          await this.fetchArticleText(index);
        });

        await Promise.all(promises);
        console.log('Устанавливаем isProcessed = true');
        headlinesStore.isProcessed = true;
      } catch (error) {
        console.error('Ошибка при обработке заголовков:', error);
        console.log('Устанавливаем isProcessed = false из-за ошибки');
        headlinesStore.isProcessed = false;
        throw error;
      } finally {
        headlinesStore.isLoading = false;
        console.log('Устанавливаем isLoading = false');
      }
    },
    async modifyArticleText(index) {
      const headlinesStore = useHeadlinesStore();
      const headline = headlinesStore.headlines[index];
      if (!headline.articleText || headline.articleText === 'Failed to load article text') {
        console.log(`Нет текста для обработки: ${headline.title}`);
        throw new Error('Текст статьи не загружен. Попробуйте снова.');
      }

      headlinesStore.isLoading = true;
      try {
        const response = await axios.post('http://localhost:3000/modify-text', {
          text: headline.originalArticleText,
        });
        headline.articleText = `${response.data.english.title}\n${response.data.english.text}`;
        headline.russianTitle = response.data.russian.title;
        headline.russianText = response.data.russian.text;
        headline.tags = response.data.tags;
        headline.isModified = true;
        console.log(`Текст статьи изменён: ${headline.articleText.slice(0, 100)}...`);
        localStorage.setItem('headlines', JSON.stringify(headlinesStore.headlines));
      } catch (error) {
        console.error(`Ошибка при изменении текста статьи (${headline.link}):`, error);
        headline.articleText = 'Не удалось изменить текст статьи. Попробуйте снова позже.';
        localStorage.setItem('headlines', JSON.stringify(headlinesStore.headlines));
        throw error;
      } finally {
        headlinesStore.isLoading = false;
      }
    },
  },
});
