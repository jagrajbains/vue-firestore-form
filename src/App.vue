<template>
  <div id="app" class="bg-gray-800 w-full h-full text-gray-200">
    <Header />
    <div class="p-3 max-h-full">
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  name: "App",
  components: {
    Header
  }
};
</script>
