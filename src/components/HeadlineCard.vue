<template>
  <div
    class="card"
    :class="{ selected: isSelected }"
    @click="toggleSelection"
  >
    <div class="card-header">
      <span class="site-name">{{ site }}</span>
      <span class="time-ago">{{ timeAgo }}</span>
    </div>
    <h3 class="title">{{ title }}</h3>
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script>
import { useHeadlinesStore } from '../stores/headlines';

export default {
  name: 'HeadlineCard',
  props: {
    site: { type: String, required: true },
    timeAgo: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    index: { type: Number, required: true },
    isSelected: { type: Boolean, default: false },
  },
  setup() {
    const store = useHeadlinesStore();
    return { store };
  },
  methods: {
    toggleSelection() {
      this.store.toggleSelection(this.index);
    },
  },
};
</script>

<style scoped>
.card {
  width: 300px;
  padding: 10px;
  line-height: 1.2;
  background-color: #e4f8dd;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}
.card.selected {
  background-color: #e0f7fa;
  border-color: #00acc1;
}
.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.site-name {
  font-weight: bold;
  color: #777;
  font-size: 0.7em;
}
.time-ago {
  color: #777;
  font-size: 0.7em;
}
.title {
  margin: 0 0 4px;
  font-size: 0.8em;
  color: #222;
}
.subtitle {
  margin: 0;
  font-size: 0.8em;
  color: #555;
}
@media (max-width: 600px) {
  .card {
    width: 100%;
  }
}
</style>
