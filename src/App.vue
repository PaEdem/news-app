<!-- App.vue -->
<template>
  <div class="app">
    <Loader :is-visible="store.isLoading" />
    <header class="navbar">
      <div class="navbar-left">
        <span class="date">{{ currentDate }}</span>
      </div>
      <div class="navbar-center">
        <span class="counter">Loaded: {{ store.loadedCount }} / Selected: {{ store.selectedCount }}</span>
      </div>
      <div class="navbar-right">
        <button
          class="btn"
          @click="handleFetchHeadlines"
          :disabled="store.isLoading"
        >
          Headlines
        </button>
        <button
          class="btn"
          @click="handleProcessHeadlines"
          :disabled="store.selectedCount === 0 || store.isLoading"
        >
          Articles
        </button>
      </div>
    </header>

    <main class="content">
      <div class="cards-container">
        <HeadlineCard
          v-for="(headline, index) in store.headlines"
          :key="index"
          :site="headline.site"
          :time-ago="headline.timeAgo"
          :title="headline.title"
          :subtitle="headline.subtitle"
          :index="index"
          :is-selected="headline.isSelected"
        />
      </div>
      <ArticleView
        v-if="store.isProcessed"
        :selected-headlines="store.headlines.filter((h) => h.isSelected)"
      />
    </main>
  </div>
</template>

<script>
import HeadlineCard from './components/HeadlineCard.vue';
import ArticleView from './components/ArticleView.vue';
import Loader from './components/Loader.vue';
import { useHeadlinesStore } from './stores/headlines';
import { useArticlesStore } from './stores/articles';

export default {
  name: 'App',
  components: {
    HeadlineCard,
    ArticleView,
    Loader,
  },
  data() {
    return {
      currentDate: new Date().toLocaleDateString('ru-RU'),
    };
  },
  setup() {
    const store = useHeadlinesStore();
    const articlesStore = useArticlesStore();
    return { store, articlesStore };
  },
  methods: {
    async handleFetchHeadlines() {
      try {
        await this.store.fetchHeadlines();
        this.$toast.success(`Успешно загружено ${this.store.loadedCount} заголовков!`, {
          position: 'bottom-right',
        });
      } catch (error) {
        console.error('Ошибка в handleFetchHeadlines:', error);
        this.$toast.error('Не удалось загрузить заголовки. Попробуйте снова.', {
          position: 'bottom-right',
        });
      }
    },
    async handleProcessHeadlines() {
      console.log('Кнопка Articles нажата, вызываем processHeadlines');
      console.log('selectedCount:', this.store.selectedCount);
      console.log('isLoading:', this.store.isLoading);
      console.log(
        'Selected headlines:',
        this.store.headlines.filter((h) => h.isSelected)
      );
      try {
        await this.articlesStore.processHeadlines();
        this.$toast.success(`Успешно загружено ${this.store.selectedCount} статей!`, {
          position: 'bottom-right',
        });
      } catch (error) {
        console.error('Ошибка в handleProcessHeadlines:', error);
        this.$toast.error(error.message || 'Произошла ошибка при загрузке статей. Попробуйте снова.', {
          position: 'bottom-right',
        });
      }
    },
  },
  mounted() {
    console.log('Initial headlines:', this.store.headlines);
  },
};
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #3c5a6e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  z-index: 999;
}

.navbar-left,
.navbar-center,
.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-left {
  flex: 1;
}

.navbar-center {
  flex: 2;
  justify-content: center;
}

.navbar-right {
  flex: 1;
  justify-content: flex-end;
}

.date {
  font-weight: bold;
  color: #ccc;
}

.counter {
  white-space: nowrap;
  color: #ddd;
}

.btn {
  padding: 8px 16px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: 1px solid #0056b3;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.btn:hover {
  background-color: #0056b3;
  border: 1px solid #007bff;
}

.btn:disabled {
  color: #999;
  background-color: #3c5a6e;
  border: 1px solid #717b82;
  cursor: not-allowed;
}

.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 60px;
  padding: 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

@media (max-width: 600px) {
  .navbar {
    flex-direction: column;
    padding: 10px;
  }
  .navbar-left,
  .navbar-center,
  .navbar-right {
    justify-content: center;
    margin: 5px 0;
  }
  .btn {
    margin-left: 5px;
  }
}
</style>
