<template lang="html">
  <div class="bg-white text-white container">
    <div class="row no-wrap q-my-lg items-center">
      <img :src="require('src/assets/wd-logo.svg')" class="logo">
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue'
export default {
  setup () {
    const isNavbarOpened = ref(false)

    const handleNavbarState = () => {
      isNavbarOpened.value = !isNavbarOpened.value
    }
    return {
      isNavbarOpened,
      handleNavbarState
    }
  }
}

</script>
