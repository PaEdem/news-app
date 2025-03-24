<!-- components/ArticleView.vue -->
<template>
  <div
    v-if="selectedHeadlines && selectedHeadlines.length > 0"
    class="articles-container"
  >
    <div
      v-for="(item, index) in selectedHeadlines"
      :key="index"
      class="article"
      :class="{ saved: item.isSaved }"
    >
      <Loader :is-visible="item.isSaving || (!item.articleText && !item.isFailed)" />
      <template v-if="item.articleText && item.articleText !== 'Failed to load article text'">
        <h3 class="article-title">{{ item.title }}</h3>
        <p class="article-subtitle">{{ item.subtitle }}</p>
        <p class="article-meta">{{ item.site }} • {{ item.timeAgo }}</p>
        <div class="article-text">
          <div
            v-if="item.isModified"
            class="modified-content"
          >
            <p class="modified-title">{{ item.articleText.split('\n')[0] }}</p>
            <p class="modified-text">{{ item.articleText.split('\n')[1] }}</p>
            <p class="russian-title">{{ item.russianTitle }}</p>
            <p class="russian-text">{{ item.russianText }}</p>
          </div>
          <div v-else>
            <p>{{ item.articleText }}</p>
          </div>
        </div>
        <div
          v-if="item.isModified && item.tags"
          class="article-tags"
        >
          <span
            v-for="(tag, tagIndex) in item.tags"
            :key="tagIndex"
            class="tag"
            >{{ tag }}</span
          >
        </div>
        <div class="article-actions">
          <button
            @click="modifyText(index)"
            :disabled="!item.articleText || item.articleText === 'Failed to load article text' || item.isSaved"
            class="modify-button"
          >
            Изменить
          </button>
          <button
            v-if="item.isModified"
            @click="saveText(index, item)"
            :disabled="headlinesStore.isLoading || item.isSaved || item.isSaving"
            class="save-button"
          >
            Сохранить
          </button>
        </div>
      </template>
      <div
        v-else-if="item.isFailed"
        class="article-text-missing"
      >
        <p>Не удалось загрузить текст статьи для "{{ item.title }}".</p>
      </div>
    </div>
  </div>
  <div
    v-else
    class="no-articles"
  >
    <p>Нет выбранных статей для отображения.</p>
  </div>
</template>

<script>
import { useHeadlinesStore } from '../stores/headlines';
import { useArticlesStore } from '../stores/articles';
import { useFileSaverStore } from '../stores/fileSaver';
import Loader from './Loader.vue';

export default {
  name: 'ArticleView',
  props: {
    selectedHeadlines: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  components: {
    Loader,
  },
  setup() {
    const headlinesStore = useHeadlinesStore();
    const articlesStore = useArticlesStore();
    const fileSaverStore = useFileSaverStore();
    return { headlinesStore, articlesStore, fileSaverStore };
  },
  methods: {
    modifyText(index) {
      const headlineIndex = this.headlinesStore.headlines.findIndex(
        (h) => h.link === this.selectedHeadlines[index].link
      );
      if (headlineIndex !== -1) {
        this.articlesStore.modifyArticleText(headlineIndex);
      }
    },
    async saveText(index, headline) {
      const headlineIndex = this.headlinesStore.headlines.findIndex(
        (h) => h.link === this.selectedHeadlines[index].link
      );
      if (headlineIndex === -1) return;

      try {
        const filePath = await this.fileSaverStore.saveTextFile(headlineIndex);
        this.$toast.success(`Файл успешно сохранён: ${filePath}`, {
          position: 'bottom-right',
        });
      } catch (error) {
        console.error('Ошибка при сохранении:', error);
        this.$toast.error(`Не удалось сохранить файл: ${error.message || 'Неизвестная ошибка'}. Попробуйте снова.`, {
          position: 'bottom-right',
        });
      }
    },
  },
};
</script>

<style scoped>
.articles-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  margin: auto;
  margin-top: 40px;
  overflow-x: hidden;
}

.article {
  box-sizing: border-box;
  border: 1px solid #888;
  padding: 15px;
  padding-bottom: 40px;
  border-radius: 5px;
  width: 100%;
  margin: auto;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  overflow-x: hidden;
  position: relative;
}

.article.saved {
  background-color: #e0ffe0;
  border: 2px solid #28a745;
}

.article-title {
  font-size: 1rem;
  font-weight: 600;
  color: #222;
}

.article-subtitle {
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
}

.article-meta {
  font-size: 0.8rem;
  color: #888;
  margin-top: 5px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}

.article-text {
  width: 100%;
  margin-top: 10px;
  overflow-x: hidden;
}

.modified-content {
  margin-bottom: 20px;
}

.modified-title {
  font-weight: bold;
  color: #007bff;
  margin-top: 10px;
}

.modified-text {
  color: #444;
  line-height: 1.6;
  margin-top: 5px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden;
}

.russian-title {
  font-weight: bold;
  color: #ff4500;
  margin-top: 15px;
}

.russian-text {
  color: #444;
  line-height: 1.6;
  margin-top: 5px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-x: hidden;
}

.article-text-missing {
  color: #888;
  font-style: italic;
  margin-top: 10px;
}

.article-tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  background-color: #e0e0e0;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  color: #333;
}

.article-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.modify-button,
.save-button {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.modify-button {
  background-color: #28a745;
  color: white;
}

.modify-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.save-button {
  background-color: #007bff;
  color: white;
}

.save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.no-articles {
  text-align: center;
  margin-top: 20px;
  color: #888;
}
</style>
