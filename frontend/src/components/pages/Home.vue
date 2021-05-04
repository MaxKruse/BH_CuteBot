<template>
  <h1>Liste aller Channels</h1>
  <div v-if="state.channels && state.channels.length > 0">
    <div v-for="channel in state.channels" :key="channel.id">
      <h2>{{ channel.name }}</h2>
      <h3>{{ channel.description }}</h3>
      <br />
    </div>
  </div>
  <div v-else>
    <h2>No Channels found :(</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import backend from "../../util/backend";

export default defineComponent({
  setup() {
    const state = reactive({
      channels: Array<any>(),
    });

    // update Channels
    function getChannels() {
      backend.getChannels((res: any[]) => {
        res.map((channel) => {
          channel.name = channel.name[0].toUpperCase() + channel.name.slice(1);
        });
        state.channels = res;
      });
    }

    getChannels();

    return {
      state,
      getChannels,
    };
  },
});
</script>
