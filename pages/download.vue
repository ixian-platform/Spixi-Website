<script setup>

import { spixiVersion } from "~/constants.ts";

const { t } = useI18n()

useHead({
    title: t('pages.download.title') + " | Spixi",
    meta: [
        {
            name: 'description',
            content: t('pages.download.subtitle1')
        }
    ]
})

const downloads = {
    'android': 'https://github.com/ixian-platform/Spixi/releases/download/v0.9.6.1/Spixi-v0.9.6.1-Android.apk',
    'windows': 'https://github.com/ixian-platform/Spixi/releases/download/v0.9.6.1/Spixi-v0.9.6.1-Win.zip'
}
</script>

<template>
    <div class="pt-[4em] pb-4 px-[2em] max-w-7xl mx-auto">

        <div class="bg-white dark:bg-[#1B232B] rounded-2xl">
            <div class="flex flex-col md:flex-row items-center justify-between py-7 px-10 gap-10">
                <div class="md:w-1/2 inline-flex flex-col h-52 justify-between item">
                    <h2 class="text-5xl font-lexend font-semibold text-black dark:text-spixi-dark pt-4">
                        {{ t('pages.download.title') }}
                    </h2>
                    <p class="text-base text-spixi dark:text-spixi-dark mt-4">
                        {{ t('pages.download.subtitle1') }} <br>
                        {{ t('pages.download.subtitle2') }}
                    </p>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <NuxtImg src="/img/DownloadLight.svg" v-show="$colorMode.value === 'light'" class="w-64" />
                    <NuxtImg src="/img/DownloadDark.svg" v-show="$colorMode.value === 'dark'" class="w-64" />
                </div>
            </div>
        </div>

        <Helper 
            :title="t('pages.download.thankyou')"
            :subtitle="t('pages.download.thankyouaux')"
            />

        <div class="flex mt-8 mb-32" :class="{
            'flex-col': $device.isMobile,
            'flex-col-reverse': $device.isDesktop
        }">
            <div id="mobile">
                <h2 class="text-3xl font-lexend text-black dark:text-spixi-dark py-4 mt-10">
                    {{ t('pages.download.formobile') }}
                </h2>
                <div class="flex flex-col md:flex-row gap-10">
                    <Download 
                        title="Android"
                        :description="t('pages.download.availableandroid')"
                        :version="t('pages.download.version.android', { version: spixiVersion })"
                        :store="{ 
                            image: '/img/stores/googleplay.svg', 
                            url: 'https://play.google.com/store/apps/details?id=com.ixilabs.spixi' 
                        }"
                        :link="{ 
                            url: downloads.android,
                            text: t('pages.download.androidapk')
                        }" />
        
                    <Download 
                        title="iOS"
                        :description="t('pages.download.availableios')"
                        :version="t('pages.download.version.ios', { version: spixiVersion })"
                        :store="{ 
                            image: '/img/stores/appstore.svg', 
                            url: 'https://apps.apple.com/app/spixi-private-chat-wallet/id6667121792' 
                        }" />
                </div>
            </div>
            
            <div id="desktop">
                <h2 class="text-3xl font-lexend text-black dark:text-spixi-dark py-4 mt-10">
                    {{ t('pages.download.fordesktop') }}
                </h2>
                <div class="flex flex-col md:flex-row gap-10">
                    <Download 
                        title="Windows"
                        :description="t('pages.download.availablewindows')"
                        :version="t('pages.download.version.windows', { version: spixiVersion })"
                        :link="{ 
                            url: downloads.windows,
                            text: t('pages.download.windowsdownload')
                        }" />
        
                    <Download 
                        title="macOS"
                        :description="t('pages.download.availablemacos')"
                        :version="t('pages.download.version.macos', { version: spixiVersion })"
                        :store="{ 
                            image: '/img/stores/appstore.svg', 
                            url: 'https://apps.apple.com/app/spixi-private-chat-wallet/id6667121792' 
                        }" />
                </div>
            </div>
        </div>
    </div>
</template>
