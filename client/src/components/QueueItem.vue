<template>
  <div class="item">
    <div class="content">
      <span class="title">{{ title }}</span>
      <span class="length">{{ paddedLength }}</span>
    </div>
    <div class="label">
      <span class="title">{{ "título" }}</span>
      <span class="length">{{ "duração" }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "QueueItem",
  props: {
    title: String,
    length: String
  },
  computed: {
    paddedLength: function() {
      if (this.length.split(":").length === 1)
        return `00:${
          parseInt(this.length) > 9 ? this.length : `0${this.length}`
        }`;
      return this.length
        .split(":")
        .map(n => (parseInt(n) > 9 ? n : `0${n}`))
        .join(":");
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
  }

  .label {
    visibility: hidden;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .title,
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
