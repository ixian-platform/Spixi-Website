<script setup>
let shouldAddWordBreak = false;
// If language is Russian, change shouldAddWordBreak to true, get it from useI18n()
const { locale } = useI18n();
if (locale.value === 'ru') {
    shouldAddWordBreak = true;
}
</script>

<template>
    <div class="bg-[#F0F2F4] dark:bg-[#0D141C]"
        :class="shouldAddWordBreak ? 'break-all' : ''">
        <AppHeader />
        <slot />
        <AppFooter />
    </div>
</template>
