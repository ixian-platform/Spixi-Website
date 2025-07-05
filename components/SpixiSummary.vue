<script setup>
const { t } = useI18n()
</script>
<template>
    <div class="bg-[radial-gradient(62.75%_223.69%_at_12.13%_-13.29%,_#97E3F9_0%,_#1394F1_100%)] dark:bg-[radial-gradient(62.75%_223.69%_at_12.13%_-13.29%,_#082444_0%,_#044E83_100%)] rounded-2xl my-32">
        <div class="flex flex-col md:flex-row items-center justify-between pt-5 px-10">
            <div class="md:w-1/2 flex flex-col">
                <h2 class="text-5xl font-lexend font-semibold text-black dark:text-white">
                    {{ t('pages.home.features.start') }}
                </h2>
                
                <div class="my-4">
                    <p class="text-base text-black dark:text-white" v-html="t('pages.home.features.starthelp')"></p>
                </div>
                
                <div class="my-4">
                    <NuxtLink to="/download" class="border border-spixi dark:border-white text-black dark:text-white hover:bg-[#24BBFF] font-medium rounded-lg py-3 px-8">
                        {{ t('pages.home.features.downloadnow') }}
                    </NuxtLink>
                </div>
            </div>
            <div class="md:w-1/2 flex justify-end">
                <NuxtImg class="w-[432px]" src="/img/SpixiSummaryLight.png" v-show="$colorMode.value === 'light'" />
                <NuxtImg class="w-[432px]" src="/img/SpixiSummaryDark.png" v-show="$colorMode.value === 'dark'" />
            </div>
        </div>
    </div>
</template>