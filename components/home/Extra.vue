<script setup>
const props = defineProps({
    image: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    comingSoon: {
        type: Boolean,
        default: false
    }
})

let images = {
    light: props.image.replace('.svg', 'Light.svg'),
    dark: props.image.replace('.svg', 'Dark.svg')
}
</script>
<template>
    <div class="bg-white dark:bg-[#090B0D] p-6 rounded-[40px] w-full flex flex-col justify-between">
        <div>
            <h3 class="text-2xl font-lexend font-semibold text-black dark:text-spixi-dark flex flex-col md:flex-row gap-3">
                {{ title }} 
                <span v-if="comingSoon" class="text-sm bg-[#6BFCC8] py-1 px-2 font-normal items-center rounded text-spixi">New</span>
            </h3>
            <p class="text-base text-spixi dark:text-spixi-dark my-4">
                {{ description }}
            </p>
        </div>
        <NuxtImg v-if="images.light" :src="images.light" v-show="$colorMode.value === 'light'" class="w-40" />
        <NuxtImg v-if="images.dark" :src="images.dark" v-show="$colorMode.value === 'dark'" class="w-40" />
    </div>
</template>