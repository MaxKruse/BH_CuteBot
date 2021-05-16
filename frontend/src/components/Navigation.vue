<template>
  <ul>
    <li><router-link class="link" to="/features">Features</router-link></li>
    <li><router-link class="link" to="/users">Users</router-link></li>
    <li><router-link class="link" to="/">Home</router-link></li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style scoped>
ul {
  list-style: none;
  position: sticky;
}
li {
  margin: 1rem;
  float: right;
}
</style>