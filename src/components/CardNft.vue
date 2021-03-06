<template lang="html">
  <div class="col-12 q-ml-auto col-md-5">
    <q-card class="app-card">
      <q-card-section class ="card-section__image" :style="{backgroundImage: `url('${pictureUrl}')`}" @click="openPictureUrl"></q-card-section>
      <q-card-section class="q-pa-lg" v-if="NFTData">
        <div class="row justify-between">
          <div class="column">
            <h3 class="q-my-none text-bold">{{NFTData.name}}</h3>
            <h4 class="q-my-none text-h5 text-medium">{{collectionID}}</h4>
          </div>
          <span class="self-end">
            <img
            :src="require('src/assets/egld-icon.svg')"
            class="q-mr-sm"
            style="height: 16px"
            >
            <span class="text-h2 text-bold q-mr-xs">{{egldPrice}}</span>
          </span>
        </div>
        <q-linear-progress :value="progress" class="q-mt-md" />
        <div class="q-mb-md text-grey">{{amount}}/{{divider}}</div>
        <div class="row items-end">
          <template v-if="walletIsConnected">
            <q-input
            v-model="donatedAmount"
            class="q-mx-auto q-gutter-md-md col-12 col-md-6 q-mb-md q-mb-md-none"
            placeholder="Amount in EGLD"
            type="number"
            outlined
            square
            dense
            bg-color="white"
            />
            <q-btn
            label="make a donation"
            class="text-bold self-start col-md-6 q-md-mt-auto q-my-mb-none q-md-ml-auto q-mx-auto"
            outline
            size="1rem"
            padding="sm"
            color="primary"
            @click="donate"
            />
          </template>
          <template v-else>
            <q-btn
            label="connect my wallet"
            class="text-bold self-start col col-md-6 q-md-mt-auto q-my-mb-none q-md-ml-auto q-mx-auto"
            outline
            size="1rem"
            padding="sm"
            color="primary"
            @click="connectWallet"
            />
          </template>
        </div>
      </q-card-section>
    </q-card>
    <div class="q-mt-md text-h4">Total amount raised:
      <span class="q-ml-md">
        {{amountRaised}}
        <img
        :src="require('src/assets/egld-icon.svg')"
        style="height: 23px"
        >
      </span>
    </div>
  </div>
</template>

<script>
import { isNil, equals, pick } from 'rambda'
import { LocalStorage } from 'quasar'
import axios from 'axios'
export default {
  data () {
    return {
      amount: 0,
      amountRaised: 0,
      divider: 1000,
      egldPrice: 0.05,
      NFTData: null,
      progress: 0,
      transactionData: 'donate',
      donatedAmount: 0,
      fundToGive: 0
    }
  },
  methods: {
    removeFromLocalStorage (key) {
      return LocalStorage.remove(key)
    },

    getProgress (divider, balance) {
      return (divider - balance) / 1000
    },

    async getNFTData () {
      try {
        const { data } = await axios.get(`${this.elrondGatewayUrl}/address/${this.smartContractAddress}/nft/${this.collectionID}/nonce/1`)
        return data.data.tokenData
      } catch (e) {
        throw new Error(`error: ${e.message}`)
      }
      return window.history.replaceState(null, document.title, this.baseUrl)
    },

    connectWallet () {
      const url = `${this.elrondNetworkUrl}login?callbackUrl=${this.baseUrl}`
      location.assign(url)
    },

    positiveNotify () {
      const message = 'Your transaction has been successfully completed. <br> Many thanks from the bottom of our heart ❤️'
      return this.displayNotify('positive', message, window.history.replaceState(null, document.title, this.baseUrl))
    },

    warningNotify () {
      const message = 'The field cannot be empty or equal to 0, please enter a valid amount.'
      return this.displayNotify('warning', message)
    },

    negativeNotify () {
      const message = 'We\'re sorry seems like the transaction has failed, please try again...'
      return this.displayNotify('negative', message, window.history.replaceState(null, document.title, this.baseUrl))
    },

    displayNotify (type, message, callback = () => {}) {
      this.$q.notify({
        type,
        message,
        timeout: 6000,
        html: true
      })
      return callback()
    },
    async getAmountRaised () {
      try {
        const { data } = await axios.get(`${this.elrondGatewayUrl}/address/${this.smartContractAddress}`)
        return data.data.account.balance / Math.pow(10, 18)
      } catch (e) {
        throw new Error(`error: ${e.message}`)
      }
    },

    getRouteParams () {
      const params = this.$router.currentRoute.value.query
      if (equals(params, {})) {
        return
      } else {
        if (LocalStorage.has('txHash')) {
          return this.removeFromLocalStorage('txHash')
        } else {
          if (params.status) {
            LocalStorage.set('txHash', params.txHash)
            return !!params.status && equals(params.status, 'success') ? this.positiveNotify() : this.negativeNotify()
          }
        }
      }
    },
    openPictureUrl () {
      window.open(`${this.pictureUrl}`, '_blank')
    },

    donate ()  {
      if (equals(this.donatedAmount, 0)) { return this.warningNotify() }
      if (this.donatedAmount >= 0.0001) {
        this.fundToGive = this.donatedAmount * Math.pow(10, 18)
        const url = `${this.elrondNetworkUrl}transaction?receiver=${this.smartContractAddress}&value=${this.fundToGive}&gasLimit=${this.transactionGasLimit}&data=${this.transactionData}&callbackUrl=${this.baseUrl}`
        location.assign(url)
      }
    }
  },
  computed: {
    walletIsConnected () {
      const { address } = pick(['address'],this.$router.currentRoute.value.query)
      return !isNil(address)
    },
    baseUrl () { return 'https://warmy-donation.herokuapp.com/' },
    collectionID () { return 'WARMY-111ba7' },
    elrondNetworkUrl () { return 'https://wallet.elrond.com/hook/' },
    elrondGatewayUrl () { return 'https://gateway.elrond.com'},
    pictureUrl () { return 'https://ipfs.io/ipfs/QmaTjALTzsFgDFUs9Wy8PhFVUZ7ARbm2pPVEQkQmHiLJDm' },
    smartContractAddress () { return 'erd1qqqqqqqqqqqqqpgqdq0arumjsvfxuvx4lvmprq6yh449vgfjq6nq96kat3' },
    transactionGasLimit () { return 250000000 }
  },
  async created () {
    try {
      this.removeFromLocalStorage('txHash')
      await this.getRouteParams()
      this.NFTData = await this.getNFTData()
      this.amountRaised = await this.getAmountRaised()
      if (!isNil(this.NFTData)) {
        this.progress = this.getProgress(1000, this.NFTData.balance)
        this.amount = 1000 - this.NFTData.balance
      }

    } catch (e) {
      throw new Error('error detected: ', e.message)
    }

  },

  beforeRouteLeave(to, from) {
    this.removeFromLocalStorage('txHash')
  }
}
</script>
