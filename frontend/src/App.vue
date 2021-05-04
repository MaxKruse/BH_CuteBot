<template>
  <!-- Top Navigation Bar -->
  <Navigation></Navigation>

  <div class="content">
    <router-view />
  </div>
  <!-- Bottom Footer -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navigation from "./components/Navigation.vue";

export default defineComponent({
  components: {
    Navigation,
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.content {
  text-align: center;
  margin: auto;
  margin-top: 2rem;
  width: 60%;
}
</style>
