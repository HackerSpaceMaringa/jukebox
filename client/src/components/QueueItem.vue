<template>
  <div class="item">
    <div class="content">
      <span class="title">{{ title }}</span>
      <span class="length">{{ length }}</span>
      <button v-on:click="vote">
        <span v-bind:class="{ skip: true, voted: votes }">≫</span>
      </button>
    </div>
    <div class="label">
      <span class="title">{{ "título" }}</span>
      <span class="length">{{ "duração" }}</span>
      <span class="skip">{{ "skip" }}</span>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "QueueItem",
  props: {
    title: String,
    length: String,
    votes: Boolean,
    id: String
  },
  methods: {
    vote: function() {
      axios
        .post("/api/skip", { id: this.id })
        .catch(error => console.log(error));
    }
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

.item {
  padding: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:first-of-type {
    margin-bottom: 1rem;
  }

  .content {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .title {
      color: $other-green;
      text-shadow: 0 0 8px $other-green;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
    }

    .length {
      color: $length-content;
      text-shadow: 0 0 8px $length-content;
      margin-left: 2rem;
    }

    .skip {
      color: $length-content;
      text-shadow: 0 0 8px $length-content;
      margin-left: 2rem;
    }

    .voted {
      color: $other-green;
    }
  }

  .label {
    visibility: hidden;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .title,
    .skip,
    .length {
      user-select: none;
      font-size: 0.6em;
      position: relative;
      color: $label;
      text-shadow: 0 0 8px $label;
    }
  }

  &:hover {
    .label {
      visibility: visible;
    }
  }
}
</style>
