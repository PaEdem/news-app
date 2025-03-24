// stores/headlines.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useHeadlinesStore = defineStore('headlines', {
  state: () => {
    const savedHeadlines = localStorage.getItem('headlines');
    const lastFetch = localStorage.getItem('lastFetch') || 0;
    return {
      headlines: savedHeadlines ? JSON.parse(savedHeadlines) : [],
      isLoading: false,
      isProcessed: false,
      lastFetch: parseInt(lastFetch, 10),
    };
  },
  getters: {
    loadedCount: (state) => state.headlines.length,
    selectedCount: (state) => state.headlines.filter((h) => h.isSelected).length,
  },
  actions: {
    async fetchHeadlines() {
      console.log('Начало загрузки, isLoading:', this.isLoading);

      const now = Date.now();
      const cacheDuration = 5 * 60 * 1000; // 5 минут
      if (this.lastFetch && now - this.lastFetch < cacheDuration && this.headlines.length > 0) {
        console.log('Используем кэшированные заголовки, последний запрос был менее 5 минут назад');
        return;
      }

      this.isLoading = true;
      try {
        const response = await axios.get('http://localhost:3000/headlines');
        const formattedHeadlines = response.data.map((item) => ({
          site: item.site,
          title: item.title,
          subtitle: item.subtitle,
          timeAgo: item.timeAgo,
          link: item.link,
          isSelected: false,
          articleText: '',
          originalArticleText: '',
          russianTitle: '',
          russianText: '',
          tags: [],
          isModified: false,
          isSaved: false,
          isSaving: false,
          isFailed: false,
          lastFetched: null,
        }));
        this.headlines = formattedHeadlines;
        this.isProcessed = false;
        this.lastFetch = now;
        localStorage.setItem('headlines', JSON.stringify(this.headlines));
        localStorage.setItem('lastFetch', this.lastFetch.toString());
      } catch (error) {
        console.error('Ошибка при загрузке заголовков:', error);
        throw error;
      } finally {
        this.isLoading = false;
        console.log('Загрузка завершена, isLoading:', this.isLoading);
      }
    },
    toggleSelection(index) {
      console.log(`Переключаем выбор для индекса ${index}, текущий headlines:`, this.headlines);
      const newHeadlines = [...this.headlines];
      newHeadlines[index] = { ...newHeadlines[index], isSelected: !newHeadlines[index].isSelected };
      this.headlines = newHeadlines;
      console.log('Обновлённый headlines:', this.headlines);
      localStorage.setItem('headlines', JSON.stringify(this.headlines));
    },
  },
});
