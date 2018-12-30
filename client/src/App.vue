<template>
  <fragment>
    <div class="header">
      <div class="border"></div>
      <div class="center">
        <span class="musical">🎶</span>
        <div class="text">
          <span class="hs">HackerSpace</span> <span class="mga">Maringá</span>
          <span class="jukebox">Jukebox</span>
        </div>
        <span class="musical">🎶</span>
      </div>
      <div class="border"></div>
    </div>
    <div class="form">
      <label>
        {{ "Adicionar" }}
        <input v-model="url" type="text" v-bind:disabled="lock.url" />
      </label>
      <button v-on:click="postUrl" type="submit">+</button>
    </div>
    <div class="form">
      <label>
        {{ "Volume" }}
        <input
          v-model="volume"
          type="number"
          min="0"
          max="100"
          size="4"
          v-bind:disabled="lock.volume"
        />
      </label>
      <button v-on:click="postVolume" type="submit">SET</button>
    </div>
    <div class="users">{{ userCount }}</div>
    <QueueList v-bind:playlist="playlist" />
  </fragment>
</template>

<script>
import axios from "axios";
import QueueList from "./components/QueueList.vue";
const baseUrl = "/api";
const api = url => `${baseUrl}${url}`;

export default {
  name: "app",
  data: function() {
    return {
      playlist: [],
      volume: 50,
      users: 0,
      url: "",
      token: null,
      lock: {
        url: false,
        volume: false
      },
      clear: {
        playlist: null,
        volume: null,
        users: null,
        token: null
      }
    };
  },
  computed: {
    userCount: function() {
      if (this.users === 1) return "1 usuário ativo";
      return `${this.users} usuários ativos`;
    }
  },
  components: { QueueList },
  methods: {
    getPlaylists: function() {
      if (this.clear.playlist !== null) clearInterval(this.clear.playlist);
      axios
        .get(api("/playlist"))
        .then(response => (this.playlist = response.data.playlist))
        .catch(error => console.log(error))
        .finally(
          () => (this.clear.playlist = setTimeout(this.getPlaylists, 5 * 1000))
        );
    },
    postUrl: function() {
      this.lock.url = true;
      axios
        .post(api("/enqueue"), {
          url: this.url
        })
        .then(response => {
          this.playlist.concat(response.data.items);
        })
        .catch(error => console.log(error))
        .finally(() => (this.lock.url = false));
    },
    getVolume: function() {
      if (this.clear.volume !== null) clearInterval(this.clear.volume);
      axios
        .get(api("/volume"))
        .then(response => (this.volume = response.data.volume))
        .catch(error => console.log(error))
        .finally(
          () => (this.clear.volume = setTimeout(this.getVolume, 5 * 1000))
        );
    },
    postVolume: function() {
      this.lock.volume = true;
      axios
        .post(api("/volume"), {
          volume: parseInt(this.volume)
        })
        .catch(error => console.log(error))
        .finally(() => (this.lock.volume = false));
    },
    getUsers: function() {
      if (this.clear.users !== null) clearInterval(this.clear.users);
      axios
        .get(api("/identify"))
        .then(response => (this.users = response.data.users))
        .catch(error => console.log(error))
        .finally(
          () => (this.clear.users = setTimeout(this.getUsers, 5 * 1000))
        );
    },
    postUser: function() {
      if (this.clear.token !== null) clearInterval(this.clear.token);
      const data =
        this.token !== null
          ? {
              token: this.token
            }
          : {};
      axios
        .post(api("/identify"), data)
        .then(response => (this.token = response.data.token))
        .catch(error => {
          console.log(error);
          if (error.response.status === 401) {
            this.token = null;
          }
        })
        .finally(
          () => (this.clear.users = setTimeout(this.postUser, 30 * 1000))
        );
    }
  },
  mounted: function() {
    this.getPlaylists();
    this.getVolume();
    this.postUser();
  },
  beforeDestroy: function() {
    clearInterval(this.clear.playlist);
    clearInterval(this.clear.volume);
    clearInterval(this.clear.users);
  }
};
</script>

<style lang="scss">
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

@import url("https://fonts.googleapis.com/css?family=Oldenburg|Raleway");

html {
  min-width: 600px;
}

body {
  max-width: 66%;
}

html,
body {
  height: 100vh;
  margin: 0;
  padding: 0;
  font-family: "Raleway", sans-serif;
  background-color: $black;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
  margin: 1rem 0;
  user-select: none;
  font-size: 2em;
  font-weight: bold;
  font-family: "Oldenburg", sans-serif;
  text-transform: uppercase;
  align-self: start;

  .border {
    margin: 0.5rem auto;
    padding: 0;
    border: 1.5px solid $pink;
    border-radius: 8px;
    box-shadow: 0 0 8px 1px $pink;
  }

  .center {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    text-align: center;

    .musical {
      color: $pink;
      text-shadow: 0 0 8px $pink;
    }
    .text {
      display: flex;
      flex-direction: row;
      align-items: center;
      .hs {
        color: $cyan;
        text-shadow: 0 0 8px $cyan;
      }
      .mga {
        color: $green;
        text-shadow: 0 0 8px $green;
      }
      .jukebox {
        color: $yellow;
        text-shadow: 0 0 8px $yellow;
      }
    }
  }
}

.users {
  margin-bottom: 1rem;
  color: $form;
  text-shadow: 0 0 8px $form;
  text-transform: lowercase;
  font-weight: bold;
  font-size: 0.75em;
}

.form {
  margin-bottom: 1rem;

  label {
    color: $form;
    text-shadow: 0 0 8px $form;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.75em;

    input {
      margin-left: 1rem;
      padding: 0.25rem 0.75rem;
      color: whitesmoke;
      text-shadow: 0 0 8px whitesmoke;
      outline: none;
      background-color: transparent;
      border: 1px solid $form;
      box-shadow: 0 0 4px 0 $form, inset 0 0 4px 0 $form;
      border-radius: 12px;
    }
  }

  button {
    margin-left: 1rem;
    padding: 0.25rem 0.75rem;
    color: $form;
    text-shadow: 0 0 8px $form;
    outline: none;
    background-color: transparent;
    border: 1px solid $form;
    box-shadow: 0 0 4px 0 $form, inset 0 0 4px 0 $form;
    border-radius: 12px;

    position: relative;
    overflow: hidden;
    transform: translate3d(0, 0, 0);

    &:after {
      content: "";
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, $form 10%, transparent 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform 0.5s, opacity 1s;
    }

    &:active:after {
      transform: scale(0, 0);
      opacity: 0.2;
      transition: 0s;
    }
  }
}

@media (max-width: 1110px) {
  .header .center {
    justify-content: space-around;
    .text {
      flex-direction: column;
    }
  }
}
</style>
