<template>
  <div class="queue">
    <p class="empty" v-if="!displayHead && !displayTail">
      {{ "A playlist está vazia!" }}
    </p>
    <fragment v-if="displayHead">
      <span class="now">{{ "TOCANDO AGORA" }}</span>
      <QueueItem v-bind:title="head.title" v-bind:length="head.length" />
    </fragment>
    <fragment v-if="displayTail">
      <span class="next">{{ "PRÓXIMAS" }}</span>
      <QueueItem
        v-for="(item, index) in tail"
        v-bind:title="item.title"
        v-bind:length="item.duration"
        v-bind:key="index"
      />
    </fragment>
  </div>
</template>

<script>
import QueueItem from "./QueueItem";

export default {
  name: "QueueList",
  props: {
    playlist: Array
  },
  computed: {
    displayHead: function() {
      return this.playlist.length > 0;
    },
    displayTail: function() {
      return this.playlist.length > 1;
    },
    head: function() {
      return this.playlist[0];
    },
    tail: function() {
      return this.playlist.slice(1);
    }
  },
  components: {
    QueueItem
  }
};
</script>

<style scoped lang="scss">
$cyan: #4deeea;
$green: #74ee15;
$yellow: #ffe700;
$pink: #f000ff;
$blue: #001eff;
$black: #2d1524;
$other-green: #fd5f00;
$label: #fbf8fd;
$other-pink: #d80062;
$length-content: #7d12ff;
$form: #00ff85;

.queue {
  min-width: 100%;
  width: 100%;
  max-width: 100%;
  font-weight: bold;
  font-size: 1.25em;

  .empty {
    margin-top: 2rem;
    text-align: center;
  }

  .empty,
  .now,
  .next {
    user-select: none;
    color: $other-pink;
    font-weight: bold;
    font-size: 0.75em;
    text-shadow: 0 0 8px $other-pink;
  }
}
</style>
