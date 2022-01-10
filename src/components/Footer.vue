<template lang="html">
  <div id="section-footer" class="q-py-lg items-center column">
    <div class="section-footer__link--container q-mb-md">
      <a href="https://github.com/genibus/nfts-warmy-donate" target="_blank" class="text-blue-10 row no-wrap items-center q-mr-md">
        <q-avatar class="q-mr-md">
          <img :src="require('src/assets/github-icon.svg')">
        </q-avatar>
        <span>Source code</span>
      </a>
      <a href="https://www.marianr.es/" target="_blank" class="text-blue-10 row no-wrap items-center q-mr-md">
        <q-avatar class="q-mr-md">
          <img :src="require('src/assets/author-icon.svg')">
        </q-avatar>
        <span>NFT artist</span>
      </a>
      <a href="https://explorer.elrond.com/" target="_blank" class="text-blue-10 row no-wrap items-center q-mr-md">
        <q-avatar class="q-mr-md">
          <img :src="require('src/assets/egld-icon.svg')">
        </q-avatar>
        <span>Inspect on Elrond Explorer</span>
      </a>
      <a href="https://youtube.com" target="_blank" class="text-blue-10 row no-wrap items-center ">
        <q-avatar class="q-mr-md">
          <img :src="require('src/assets/youtube-icon.svg')">
        </q-avatar>
        <span>Smart contract deployment</span>
      </a>
      <a href="https://twitter.com/Piupmc" target="_blank" class="text-blue-10 row no-wrap items-center ">
        <q-avatar class="q-mr-md">
          <img :src="require('src/assets/twitter-icon.svg')">
        </q-avatar>
        <span>Contact me @Piupmc</span>
      </a>
    </div>
    <a target="_blank" class="section-footer__elrond-text q-py-lg" href="https://elrond.com/">
      Made with <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="heart" class="svg-inline--fa fa-heart" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="15px"><path fill="currentColor" d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg> by Elrond Fans.</a>
    <div class="d-none">Icon <a href="https://www.flaticon.com/fr/auteurs/roundicons" title="Roundicons">Roundicons</a> from <a href="https://www.flaticon.com/fr/" title="Flaticon">www.flaticon.com</a></div>
  </div>
</template>
<style lang="scss" scoped>
.d-none { display: none; }
.section-footer {
  &__elrond-text {
  font-size: 1rem;
  color: $blue-10;
    & .fa-heart { color: red; }
  }
  &__icon { width: 100%; }
  &__link--container {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    color: $blue-10;
    & a { margin: 5px 0 5px 0; }
    @media screen and (min-width: $breakpoint-sm-max) {
      & a { margin: 5px 25px 5px 25px; }
      flex-direction: row;
    }
  }
}
</style>
