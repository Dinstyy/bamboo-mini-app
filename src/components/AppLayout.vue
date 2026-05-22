<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      <Header />
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #f8f9fa;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  min-height: 100vh;
  background: #f8f9fa;
}

.content-wrapper {
  padding: 32px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>