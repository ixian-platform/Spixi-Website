<style>

body * {
    @apply transition-colors duration-300;
}

.page-enter-active,
.page-leave-active {
    transition: opacity 0.3s ease;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
}

nav .router-link-active {
    @apply text-[#24BBFF] dark:text-[#24BBFF];
}
nav .router-link-active:hover {
    /* @apply underline; */
    /* When active, append to the left a > */
    
}

footer .router-link-active {
    @apply underline;
}

</style>

<template>
    <div>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </div>
</template>