<template>
  <div class="flex flex-row max-h-full">
    <div class="w-1/2">
      <h1 class="text-4xl mb-5">Dashboard</h1>
      <p>Progress</p>
      <div class="relative pt-1 max-w-sm">
        <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            :style="{ width: percent * 20 + '%' }"
            class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
          ></div>
        </div>
      </div>
      <div v-if="state === 'synced'">
        Form is synced with Firestore
      </div>
      <div v-else-if="state === 'modified'">
        From data changed, will sync with Firebase
      </div>
      <div v-else-if="state === 'revoked'">
        From data and Firebase revoked to original data
      </div>
      <div v-else-if="state === 'error'">
        Failed to save to Firestore. {{ errorMessage }}
      </div>
      <div v-else-if="state === 'loading'">Loading...</div>
      <form
        @submit.prevent="saveToFirebase"
        @input="fieldUpdate"
        class="bg-white shadow-md max-w-2xl rounded px-8 pt-6 pb-3"
      >
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            v-model="formData.name"
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="your@email.com"
            v-model="formData.email"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="designation"
          >
            Designation
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="designation"
            type="text"
            placeholder="Designation"
            v-model="formData.designation"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="feedback"
          >
            Feedback
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="feedback"
            type="text"
            placeholder="Feedback"
            v-model="formData.feedback"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="location"
          >
            Location
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="location"
            type="text"
            placeholder="Location"
            v-model="formData.location"
          />
        </div>
        <div class="flex items-center justify-between">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      <div
        v-if="formError"
        class="bg-orange-100 w-1/2 border-l-4 border-orange-500 text-orange-700 p-4"
        role="alert"
      >
        <p class="font-bold">{{ formError }}</p>
      </div>
    </div>
    <div v-if="showSaved" class="ml-10">
      <h3>Saved Data</h3>
      <div class="overflow-scroll" style="maxHeight: 500px;">
        <div v-for="(s, index) in saved" :key="index" class="bg-gray-900 p-5">
          <div>name: {{ s.name }}</div>
          <div>email: {{ s.email }}</div>
          <div>designation: {{ s.designation }}</div>
          <div>feedback: {{ s.feedback }}</div>
          <div>location: {{ s.location }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import { mapGetters, mapActions } from "vuex";
import Firebase from "../firebase/firebase";
import { debounce } from "debounce";

export default {
  name: "Dashboard",
  created: async function() {
    const docRef = Firebase.db.doc(`users/${this.user.data.uid}`);

    let data = (await docRef.get()).data();

    if (!data) {
      data = {
        name: "",
        email: "",
        designation: "",
        feedback: "",
        location: ""
      };
      docRef.set(data);
    }

    this.formData = data;
    this.state = "synced";
  },
  data() {
    return {
      state: "loading", // synced, modified, revoked, error
      firebaseData: null,
      formData: {},
      errorMessage: "",
      formError: ""
    };
  },
  methods: {
    ...mapActions(["bindSavedData"]),
    async saveToFirebase() {
      if (this.percent !== 5) {
        this.formError = "Please complete the form to save";
        return;
      }
      try {
        await Firebase.db
          .doc(`users/${this.user.data.uid}`)
          .collection("saved")
          .add(this.formData);
        this.formData = {
          name: "",
          email: "",
          designation: "",
          feedback: "",
          location: ""
        };
        this.updateFirebase();
      } catch (error) {
        console.log(error);
        this.errorMessage = JSON.stringify(error);
        this.state = "error";
      }
    },
    async updateFirebase() {
      try {
        await Firebase.db.doc(`users/${this.user.data.uid}`).set(this.formData);
        this.state = "synced";
      } catch (error) {
        console.log(error);
        this.errorMessage = JSON.stringify(error);
        this.state = "error";
      }
    },
    fieldUpdate() {
      this.formError = "";
      this.state = "modified";
      this.debouncedUpdate();
    },
    debouncedUpdate: debounce(function() {
      this.updateFirebase();
    }, 2500)
  },
  firestore() {
    return {
      firebaseData: Firebase.db.doc(`users/${this.user.data.uid}`)
    };
  },
  computed: {
    ...mapGetters({
      user: "user",
      saved: "saved"
    }),
    showSaved() {
      return this.saved.length > 0;
    },
    percent() {
      const d = Object.keys(this.formData).filter(
        key => this.formData[key] !== ""
      );
      return d.length;
    }
  },
  mounted() {
    if (!this.user.loggedIn) {
      this.$router.replace({ name: "Login" });
    }

    this.bindSavedData();
  }
};
</script>
