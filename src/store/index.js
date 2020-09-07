import Vue from "vue";
import Vuex from "vuex";
import { vuexfireMutations, firestoreAction } from "vuexfire";
import Firebase from "../firebase/firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      loggedIn: false,
      data: null
    },
    saved: []
  },
  getters: {
    user(state) {
      return state.user;
    },
    saved(state) {
      return state.saved;
    }
  },
  mutations: {
    ...vuexfireMutations,
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  actions: {
    bindSavedData: firestoreAction(({ bindFirestoreRef, state }) => {
      return bindFirestoreRef(
        "saved",
        Firebase.db
          .collection("users")
          .doc(`${state.user.data.uid}`)
          .collection("saved")
      );
    }),
    unbindSavedData: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("saved");
    }),
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid
        });
      } else {
        commit("SET_USER", null);
      }
    }
  },
  modules: {}
});
