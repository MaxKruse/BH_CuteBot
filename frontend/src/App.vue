<template>
  <!-- Top Navigation Bar -->
  <Navigation></Navigation>

  <div class="container">
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

<style lang="sass">
@charset "utf-8"
@import "./node_modules/bulma/bulma.sass"

@import "./node_modules/bulma/sass/utilities/functions"
@import "./node_modules/bulma/sass/utilities/derived-variables"

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

.container
  text-align: center
  margin: auto
  margin-top: 1rem
  margin-bottom: 1rem
  padding-top: 1rem
  padding-bottom: 1rem
  width: 60%

.buttonful.columns
  background-color: white
  -webkit-box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
  box-shadow: 0 2px 3px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1)
  color: #4a4a4a

  a.column
    color: #4a4a4a
    /*&:hover
     background: rgba(64, 64, 64, 0.1)*/

  .column
    padding: 1.25rem
    text-align: center
    font-weight: 700

    &:not(:last-child)
      border-right: 1px solid rgba(10, 10, 10, 0.1)

    @each $name, $pair in $colors
      $color: nth($pair, 1)
      $color-invert: nth($pair, 2)
      &.is-#{$name}
        background-color: $color
        color: $color-invert
        &:hover
          background-color: darken($color, 5%)
      &:hover
        background: rgba(64, 64, 64, 0.1)
</style>
