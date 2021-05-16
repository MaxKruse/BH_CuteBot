<template>
  <section class="section" v-if="state.channels && state.channels.length > 0">
    <div v-for="channel in state.channels" :key="channel.id">
      {{ channel.name }}
      <div class="buttonful">
        <router-link :to="`/user/${channel.id}/edit`">Edit</router-link>
      </div>
    </div>
  </section>
  <section v-else>
    <div>
      <h2>No Channels found :(</h2>
    </div>
  </section>
</template>

<style scoped>
</style>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
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

    onMounted(() => {
      getChannels();
    });

    return {
      state,
    };
  },
});
</script>
