<script setup>
defineProps({
    title: String,
    subtitle: String
})
</script>

<template>
    <div class="bg-[#6bd3ff]/50 dark:bg-[#2C5262]/50 rounded-[24px] my-8 py-4 px-6">
        <h2 class="text-2xl font-lexend font-semibold text-black dark:text-spixi-dark">
            {{ title }}
        </h2>
        <p class="text-base text-spixi dark:text-spixi-dark" v-html="subtitle" />
    </div>
</template>