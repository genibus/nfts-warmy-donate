<!-- <template lang="html">
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
          label="MAKE A DONATION"
          class="text-bold self-start col-md-6 q-md-mt-auto q-my-mb-none q-md-ml-auto q-mx-auto"
          outline
          size="1.1rem"
          padding="sm"
          color="primary"
          @click="donate"
          />

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
import { ref, onRenderTracked } from 'vue'
import { useRouter, onBeforeRouteLeave, onBeforeRouteEnter,  } from 'vue-router'
import { LocalStorage, useQuasar } from 'quasar'
import { isNil, equals } from 'rambda'
import axios from 'axios'
export default {
setup (props) {
  let amount = ref(0)
  let amountRaised = ref(0)
  const divider = ref(1000)
  const egldPrice = 0.05
  let NFTData = {}
  let progress = ref(0)
  const route = useRouter()
  const transactionData = 'donate'
  const $q = useQuasar()
  let pictureUrl = process.env.NFT_PICTURE_URL
  let smartContractAddress = process.env.SMART_CONTRACT_ADDRESS
  let elrondNetworkUrl = `${process.env.ELROND_NETWORK}/hook/transaction?`
  let elrondGatewayUrl = process.env.ELROND_GATEWAY
  let baseUrl = process.env.BASE_URL
  let collectionID = process.env.COLLECTION_ID
  let transactionGasLimit = process.env.GAS_FEE
  let donatedAmount = ref()
  let fundToGive = 0

  const deleteFromLocalStorage = (key) => {
    return LocalStorage.remove('txHash')
  }

  const getProgress = (divider, balance) => {
    return (divider - balance) / 1000
  }

  const getNFTData = async () => {
    try {
      console.log(`${elrondGatewayUrl}/address/${smartContractAddress}/nft/${collectionID}/nonce/1`);
      const { data } = await axios.get(`${elrondGatewayUrl}/address/${smartContractAddress}/nft/${collectionID}/nonce/1`)
      return data.data.tokenData
    } catch (e) {
      throw new Error(`error: ${e.message}`)
    }
    return window.history.replaceState(null, document.title, baseUrl)
  }

  const positiveNotify =  () => {
    const message = 'Your transaction has been successfully completed. <br> You will receive your NFT soon, Many thanks from the bottom of our heart ❤️'
    return displayNotify('positive', message, window.history.replaceState(null, document.title, baseUrl))
  }

  const negativeNotify =  () => {
    const message = 'We\'re sorry seems like the transaction has failed, please try again...'
    return displayNotify('negative', message, window.history.replaceState(null, document.title, baseUrl))
  }

  const displayNotify = (type, message, callback = () => {}) => {
    $q.notify({
      type,
      message,
      timeout: 6000,
      html: true
    })
    return callback()
  }

  const getAmountRaised = async () => {
    try {
      console.log(`${elrondGatewayUrl}/address/${smartContractAddress}`);
      const { data } = await axios.get(`${elrondGatewayUrl}/address/${smartContractAddress}`)
      return data.data.account.balance / Math.pow(10, 18)
    } catch (e) {
      throw new Error(`error: ${e.message}`)
    }
  }

  const getRouteParams = () => {
    const params = route.currentRoute.value.query
    if (isNil(params)) {
      return
    } else {
      if (LocalStorage.has('txHash')) {
        return  deleteFromLocalStorage('txHash')
      } else {
        if (params.status) {
          LocalStorage.set('txHash', params.txHash)
          return !!params.status && equals(params.status, 'success') ? positiveNotify() : negativeNotify()
        }
      }
    }
  }

  const openPictureUrl =  () => {
    window.open(`${pictureUrl}`, '_blank')
  }

  const donate = () => {
    if (donatedAmount.value >= 0.01) {
      fundToGive = donatedAmount.value * Math.pow(10, 18)
      const url = `${elrondNetworkUrl}receiver=${smartContractAddress}&value=${fundToGive}&gasLimit=${transactionGasLimit}&data=${transactionData}&callbackUrl=${baseUrl}`
      location.assign(url)
    }
  }

  onRenderTracked (async () => {

    baseUrl = process.env.BASE_URL
    collectionID = process.env.COLLECTION_ID
    elrondNetworkUrl = `${process.env.ELROND_NETWORK}/hook/transaction?`
    elrondGatewayUrl = process.env.ELROND_GATEWAY
    pictureUrl = process.env.NFT_PICTURE_URL
    smartContractAddress = process.env.SMART_CONTRACT_ADDRESS
    transactionGasLimit = process.env.GAS_FEE

    try {
      deleteFromLocalStorage('txHash')
      await getRouteParams()
      NFTData = await getNFTData()
      amountRaised = await getAmountRaised()
      if (!equals(NFTData, {})) {
        progress = getProgress(1000, NFTData.balance)
        amount = 1000 - NFTData.balance
        console.log('nftData: ', NFTData)
        console.log('amountRaised: ', amountRaised)
        console.log('progress: ', progress)
        console.log('progress: ', amount)
        console.log('NFTData is set')
      }

    } catch (e) {
      throw new Error('error detected: ', e.message)
    }

  })

  onBeforeRouteLeave((to, from) => {
    deleteFromLocalStorage('txHash')
  })

    return {
     amount,
     amountRaised,
     collectionID,
     deleteFromLocalStorage,
     divider,
     donate,
     donatedAmount,
     egldPrice,
     fundToGive,
     NFTData,
     openPictureUrl,
     pictureUrl,
     progress
    }
  }
}
</script> -->
