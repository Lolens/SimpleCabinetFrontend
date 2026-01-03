<script setup>
// Можно добавить логику при необходимости
</script>

<template>
  <main class="card-container">
    <div class="card">
      <h1>403 - Доступ запрещен</h1>
      <p>У вас недостаточно прав для доступа к этой странице.</p>
      <div class="actions">
        <router-link to="/cabinet" class="btn">Вернуться в кабинет</router-link>
        <router-link to="/" class="btn">На главную</router-link>
      </div>
    </div>
  </main>
</template>

<style scoped>

.card {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s;
}

</style>