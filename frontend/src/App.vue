<template>
  <!-- Top Navigation Bar -->
  <Navigation></Navigation>

  <div class="content">
    <router-view />
  </div>
  <Footer></Footer>
  <!-- Bottom Footer -->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navigation from "./components/Navigation.vue";
import Footer from "./components/Footer.vue";

export default defineComponent({
  components: {
    Navigation,
    Footer,
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
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  width: 60%;
}
</style>
