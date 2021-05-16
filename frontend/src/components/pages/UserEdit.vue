<template>
  <section class="section">
    <div>
      {{ state.channelName }} has features:
      {{ state.channelFeatures.map((f) => f.name).join(", ") }}
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import backend from "../../util/backend";
import { useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const route = useRoute();

    const state = reactive({
      channelName: "",
      channelDescription: "",
      channelFeatures: Array<any>(),
    });

    backend.getChannel(Number(route.params.id), (data: any) => {
      state.channelName = data.name;
      state.channelDescription = data.description;
      state.channelFeatures = data.features;
    });

    return {
      state,
      route,
    };
  },
});
</script>


<style scoped>
</style>