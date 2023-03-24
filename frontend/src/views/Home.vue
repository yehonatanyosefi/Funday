<template>
  <section class="container home">
    <header class="main-header">
      <div class="left-container">
        <a href="/">
          <img class="logo" src="/src/assets/funday.png" alt="" />
          <h1>Funday</h1>
        </a>
      </div>

      <nav class="right-container">
        <div class="login-signup-container">
          <router-link to="/login">
            <button class="login-btn" @click="showModal = true">Log in</button>
          </router-link>
        </div>

        <router-link :to="'/board/'">
          <button class="cta-btn">
            <span>Get started</span>
            <span>→</span>
          </button>
        </router-link>
      </nav>
    </header>

    <section class="body">
      <link
        href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
        rel="stylesheet"
        type="text/css"
      />
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="title">
        <div>
          <span>A platform built for a new way of working</span>
          <br />
          <span> What would you like to manage with Funday today? </span>
        </div>
        <nav>
          <router-link :to="'/board/'">
            <button class="cta-btn big">
              <span>Get started</span>
              <span>→</span>
            </button>
          </router-link>
        </nav>
      </div>
    </section>
    <!-- <video
      class="cover-video"
      src="../assets/stars.mp4"
      autoplay=""
      loop=""
    ></video>

    <h1 class="hero-title">Make it your new thing for working<br />and turn</h1>
    <p class="hero-subtitle">
      Monday into a Funday with the easiest workflow system ever.
    </p>
    <div class="home-nav-btns flex column center">
      <router-link :to="'/board/' + board._id">
        <button class="hero-btn">
          <p>Have a look</p>
        </button>
      </router-link>
    </div> -->
  </section>
</template>

<script>
export default {
  name: 'home',
  computed: {
    board() {
      return this.$store.getters.board
    },
    vw() {
      return window.innerWidth
    },
  },
  data() {
    return {
      signedIn: false,
      profile: null,
      login: null,
      videoBG: 'stars.mp4',
    }
  },
  methods: {
    callback(response) {
      // This callback will be triggered when the user selects or login to
      // his Google account from the popup
      const userData = decodeCredential(response.credential)
      // try {
      //     console.log(`userCreds:`, userCreds)
      //     // await this.$store.dispatch({ type: 'loginGoogle', userCreds })
      //     // this.$router.push('/board/' + this.board._id)
      //   }
      //   catch (err) {
      //     console.log('Something went wrong', err);
      //   }
    },
    async handleCredentialResponse(ev) {
      gapi.auth2.GoogleAuth.then((res) => console.log(res))
    },
  },
}
</script>
