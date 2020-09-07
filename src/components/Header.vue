<template>
  <div class="h-16 p-3 bg-gray-900">
    <button
      v-if="!user.loggedIn"
      @click="login"
      class="btn bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
    >
      Login
    </button>
    <div class="flex items-center" v-if="user.loggedIn">
      <h1>Hi! {{ user.data.displayName }}</h1>
      <button
        @click="logout"
        class="btn ml-4 bg-transparent hover:bg-blue-500 text-white font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import Firebase from "../firebase/firebase";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Header",
  computed: {
    ...mapGetters({
      user: "user"
    })
  },
  methods: {
    ...mapActions(["fetchUser", "unbindSavedData"]),
    login() {
      Firebase.login();
    },
    logout() {
      this.unbindSavedData();
      Firebase.logout();
    }
  },
  mounted: function() {
    Firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.$router.replace({ name: "Dashboard" });
      } else {
        this.$router.replace({ name: "Login" });
      }

      this.fetchUser(user);
    });
  }
};
</script>
