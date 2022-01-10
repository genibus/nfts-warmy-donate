<template lang="html">
  <q-dialog v-bind="$attrs" maximized>
    <q-card>
      <div class="container navbar-menu__header row justify-end" ref="navbarHeader">
        <q-icon
        name="close"
        class="q-py-lg"
        size="4rem"
        @click="$emit('update:modelValue', false)"
        />
      </div>
      <div
      class="text-center navbar-menu__items"
      ref="headerMenuItems"
      >
      {{userAddress}}
        <q-list class="column justify-around" :style="{'height': `${menuInnerHeight}px`}">
          <q-item clickable>
            <q-item-section>DONATE</q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section>
              <q-item-label>EXPLANATION</q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable>
            <q-item-section>
              <q-item-label @click="redirectToMaiarLogin">CONNECT MY WALLET</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, defineComponent, computed } from 'vue'
import { isNil, not } from 'rambda'
import axios from 'axios'
import { useRouter } from 'vue-router'
  export default defineComponent({
    setup () {
      // data
      const navbarHeader = ref()
      const headerMenuItems = ref()
      const elrondWalletURL = 'https://wallet.elrond.com/hook'
      const baseLocation = 'http://localhost:8080'
      const router = useRouter
      // methods
      const elementAndValueAreSet = el => not(isNil(el)) && not(isNil(el.value))

      const setItemsMaxHeight = function (header, menuItems) {
        if (not(elementAndValueAreSet(header)) && not(elementAndValueAreSet(menuItems))) {
          return ''
        }
        const headerElHeight = header.value.offsetHeight
        menuItems.value.style.height = window.innerHeight - headerElHeight
        return window.innerHeight - headerElHeight
      }

      // computed
      const menuInnerHeight = computed(() => setItemsMaxHeight(navbarHeader, headerMenuItems))


      return {
        navbarHeader,
        headerMenuItems,
        menuInnerHeight,
        redirectToMaiarLogin
      }
    }
  })
</script>

<style lang="scss" scoped>
.navbar-menu__items {
  & :deep(.q-focus-helper){
    visibility: hidden;
  }
}
</style>
