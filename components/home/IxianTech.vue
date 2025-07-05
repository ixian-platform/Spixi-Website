<script setup>
const { t } = useI18n()
</script>
<template>
    <div class="bg-[radial-gradient(62.75%_223.69%_at_12.13%_-13.29%,_#97E3F9_0%,_#1394F1_100%)] dark:bg-[radial-gradient(62.75%_223.69%_at_12.13%_-13.29%,_#082444_0%,_#044E83_100%)] rounded-2xl my-32">
        <div class="flex flex-col md:flex-row items-center justify-between py-7 px-10 relative overflow-hidden rounded-2xl">
            <div class="md:w-2/3">
                <NuxtImg src="/img/IxianTechLight.svg" v-show="$colorMode.value === 'light'" />
                <NuxtImg src="/img/IxianTechDark.svg" v-show="$colorMode.value === 'dark'" />
                <h2 class="text-5xl font-lexend font-semibold text-black dark:text-spixi-dark pt-4">
                    {{ t('pages.home.features.tech.title') }}
                </h2>
                <p class="text-base text-spixi dark:text-spixi-dark mt-4">
                    {{ t('pages.home.features.tech.line1') }} <br>
                    {{ t('pages.home.features.tech.line2') }}
                </p>
                <div class="mt-8 mb-4">
                    <NuxtLink to="https://www.ixian.io/" target="_blank" class="border border-spixi dark:border-white text-spixi hover:bg-[#1D2329] hover:text-spixi-dark dark:text-spixi-dark dark:hover:bg-spixi-dark dark:hover:text-[#1D2329] font-medium rounded-lg py-3 px-6">
                        {{ t('pages.home.features.tech.website') }}
                    </NuxtLink>
                </div>
            </div>
            <div class="md:w-1/3 flex justify-center max-md:hidden">
                <NuxtImg src="/img/pattern.png" class="absolute object-cover top-0 right-[-40px] h-full"  />
            </div>
        </div>
    </div>
</template>