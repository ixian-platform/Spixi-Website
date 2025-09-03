<script setup>
import { ref } from 'vue'

const {t} = useI18n()

useHead({
  title: t('pages.mini-apps.title') + " | Spixi",
  meta: [
    {
      name: 'description',
      content: t('pages.mini-apps.subtitle1')
    }
  ]
})

const dialogRef = ref(null)
const modalTitle = ref('')
const modalAppUrl = ref('')
const modalQrCode = ref('')

function openModal(title, appUrl, qrCode) {
  modalTitle.value = title
  modalAppUrl.value = appUrl
  modalQrCode.value = qrCode
  dialogRef.value?.showModal()
}

function closeModal() {
  dialogRef.value?.close()
}

function handleOutsideClick(e) {
  const dialog = dialogRef.value
  if (!dialog) return

  const rect = dialog.getBoundingClientRect()
  const clickInside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom

  if (!clickInside) {
    closeModal()
  }
}

</script>

<template>
  <div class="pt-[4em] pb-4 px-[2em] max-w-7xl mx-auto">

    <div class="bg-white dark:bg-[#090B0D] rounded-2xl">
      <div class="flex flex-col md:flex-row items-center justify-between gap-10">
        <div class="md:w-1/2 inline-flex flex-col gap-4 justify-between item p-10">
          <h2 class="text-5xl font-lexend font-semibold text-black dark:text-spixi-dark pt-4">
            {{ t('pages.mini-apps.title') }}
          </h2>
          <p class="text-base text-spixi dark:text-spixi-dark mt-4">
            {{ t('pages.mini-apps.subtitle1') }} <br>
            {{ t('pages.mini-apps.subtitle2') }}
          </p>
        </div>
        <div class="md:w-1/2 flex justify-center pr-8">
          <NuxtImg src="/img/mini-l.png" v-show="$colorMode.value === 'light'"/>
          <NuxtImg src="/img/mini-d.png" v-show="$colorMode.value === 'dark'"/>
        </div>
      </div>
    </div>

    <div class="flex mt-8 mb-32">
      <div>
        <h2 class="text-3xl font-lexend text-black dark:text-spixi-dark py-4 mt-10">
          {{ t('pages.mini-apps.try') }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Download
              :title="t('pages.mini-apps.tictac.title')"
              :description="t('pages.mini-apps.tictac.desc')"
              :version="t('pages.mini-apps.tictac.tag')"
              isMiniApp :miniAppCta="{
              game: 'tic-tac',
              text: t('pages.mini-apps.tryNow'),
              onclick: () => openModal('TicTacToe', 'https://Resources.ixian.io/tic-tac-toe.spixi', '/img/miniApps/tictac-qr.png')
              }" miniAppImg="/img/miniApps/tictactoe.png" />

          <Download
              :title="t('pages.mini-apps.whiteboard.title')"
              :description="t('pages.mini-apps.whiteboard.desc')"
              :version="t('pages.mini-apps.whiteboard.tag')"
               isMiniApp :miniAppCta="{
              game: 'whiteboard',
              text: t('pages.mini-apps.tryNow'),
              onclick: () => openModal('Whiteboard', 'https://resources.ixian.io/whiteboard.spixi', '/img/miniApps/whiteboard-qr.png')
              }" miniAppImg="/img/miniApps/whiteboard.png" />

          <Download
              :title="t('pages.mini-apps.miniAppsTest.title')"
              :description="t('pages.mini-apps.miniAppsTest.desc')"
              :version="t('pages.mini-apps.miniAppsTest.tag')"
              isMiniApp :miniAppCta="{
              game: 'app-test',
              text: t('pages.mini-apps.tryNow'),
              onclick: () => openModal('Mini Apps Test', 'Https://Resources.ixian.io/mini-apps-test.spixi', '/img/miniApps/app-test-qr.png')
              }" miniAppImg="/img/miniApps/app-test.png" />
        </div>
      </div>
    </div>

    <SpixiSummary />
  </div>
  <dialog
      ref="dialogRef"
      class="backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-2xl p-6 w-[90%] max-w-md bg-white dark:bg-[#090B0D]"
      @click="handleOutsideClick"
  >
    <div class="text-black dark:text-[#F0F2F4] flex flex-col items-center gap-3">
      <h2 class="text-xl font-semibold mb-4">{{t('pages.mini-apps.modalTitle1')}} {{ modalTitle }} {{t('pages.mini-apps.modalTitle2')}}</h2>
      <div class="bg-[#f0f0f0] dark:bg-[#0D141C] p-4 rounded-lg w-full flex flex-col items-center gap-1">
        <h3>{{t('pages.mini-apps.scanQr')}}</h3>
        <img :src="modalQrCode" alt="QR Code" class="w-48 h-48 mx-auto my-4 rounded-lg" />
        <p>{{t('pages.mini-apps.addFromUrl')}}</p>
        <p>{{ modalAppUrl }}</p>
      </div>
      <button
          class="mt-2 border-[#24BBFF] border text-black dark:text-white rounded-lg px-4 py-2 hover:bg-[#24BBFF] hover:text-black"
          @click="closeModal"
      >
        {{t('pages.mini-apps.close')}}
      </button>
    </div>
  </dialog>
</template>
