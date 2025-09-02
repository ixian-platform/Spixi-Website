<script setup>
import { spixiVersion } from "../constants.ts";

const { setLocale, t, locale, locales } = useI18n()

import { onMounted } from 'vue'
import { Dropdown } from 'flowbite'

const availableLocales = computed(() => {
    let lang = "Unknown";
    switch (locale.value) {
        case "en":
            lang = "English";
            break;
        case "es":
            lang = "Español";
            break;
        case "pt":
            lang = "Português";
            break;
        case "fr":
            lang = "Français";
            break;
        case "it":
            lang = "Italiano";
            break;
        case "de":
            lang = "Deutsch";
            break;
        case "ru":
            lang = "Русский";
            break;
        case "ja":
            lang = "日本語";
            break;
        case "zh":
            lang = "中文";
            break;
        case "id":
            lang = "Bahasa Indonesia";
            break;
        default:
            lang = "Unknown";
            break;
    }
    return locales.value.map(i => ({
        ...i,
        name: (i.code === "en" ? "English" : (i.code === "es" ? "Español" : (i.code === "pt" ? "Português" : (i.code === "fr" ? "Français" : (i.code === "it" ? "Italiano" : (i.code === "de" ? "Deutsch" : (i.code === "ru" ? "Русский" : (i.code === "ja" ? "日本語" : (i.code === "zh" ? "中文" : (i.code === "id" ? "Bahasa Indonesia" : "Unknown")))))))))),
        active: i.code === locale.value
    }))
})

let dropdownLanguage = null;

onMounted(() => {
    // set the dropdown menu element
    const $targetElLanguage = document.getElementById('language-dropdown-menu');
    // set the element that trigger the dropdown menu on click
    const $triggerElLanguage = document.getElementById('dropdownButton');
    // options with default values
    const optionsLanguage = {
        placement: 'bottom',
        offsetSkidding: 0,
        offsetDistance: 10,
        onHide: () => {
            // console.log('dropdown has been hidden');
        },
        onShow: () => {
            // console.log('dropdown has been shown');
        }
    };
    if ($targetElLanguage) {
        /*
        * targetEl: required
        * triggerEl: required
        * options: optional
        */
        dropdownLanguage = new Dropdown($targetElLanguage, $triggerElLanguage, optionsLanguage);
    }

    const $navbarHamburger = document.getElementById('navbar-hamburger');
    const $navbarHamburgerButton = document.querySelector('button[aria-controls="navbar-hamburger"]');
    if ($navbarHamburger && $navbarHamburgerButton) {
        $navbarHamburgerButton.addEventListener('click', () => {
            $navbarHamburger.classList.toggle('hidden');
            $navbarHamburger.classList.toggle('flex');

            // Close the dropdown menu when any link on the hamburger menu is clicked
            $navbarHamburger.querySelectorAll('a').forEach((el) => {
                el.addEventListener('click', () => {
                    $navbarHamburger.classList.add('hidden');
                    $navbarHamburger.classList.remove('flex');
                });
            });
        });

        // Add event listener to the logo to close the hamburger menu
        const $logo = document.getElementById('logo');
        if ($logo) {
            $logo.addEventListener('click', () => {
                $navbarHamburger.classList.add('hidden');
                $navbarHamburger.classList.remove('flex');
            });
        }
    }
})

const toggleDropdownLanguage = () => {
    // Toggle the dropdown menu using the dropdown instance
    if (dropdownLanguage) {
        dropdownLanguage.toggle();
    }
}

</script>
<template>
    <header>
        <nav class="bg-transparent border-gray-200">
            <div class="max-w-screen-xl flex flex-nowrap md:flex-wrap items-center justify-between mx-auto p-4">
                <NuxtLink to="/" activeClass="font-bold" id="logo">
                    <BaseLogo />
                </NuxtLink>

                <div class="flex justify-end items-center">
                    <BaseThemeSwitcher />
                    
                    <button type="button" id="dropdownButton" class="inline-flex items-center font-medium justify-center px-1 md:px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white fill-current fill-spixi dark:fill-white">
                        <svg class="w-5"  style="fill: currentColor;overflow: hidden;" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M513.021956 2.043912C231.268663 2.043912 2.043912 231.27275 2.043912 513.021956s229.22475 510.978044 510.978044 510.978044 510.978044-229.228838 510.978044-510.978044S794.77525 2.043912 513.021956 2.043912z m444.366946 559.473948c-0.061317 0.443529-0.163513 0.870707-0.204391 1.314236q-2.697964 23.349653-7.644232 45.988024v0.012263h-154.131417a915.323146 915.323146 0 0 0 0-191.616766h154.131417v0.012263q4.936048 22.6118 7.644232 45.988024c0.040878 0.443529 0.143074 0.870707 0.204391 1.314236a430.721788 430.721788 0 0 1 0 96.98772zM683.688623 926.096607c47.929741-62.096096 84.25006-149.920958 102.808782-253.400144h143.646148a0.028615 0.028615 0 0 1-0.020439 0.022483A449.078164 449.078164 0 0 1 683.688623 926.096607z m246.434491-572.783904a0.030659 0.030659 0 0 1 0.020439 0.016351H786.497405c-18.558723-103.479186-54.879042-191.31018-102.808782-253.400144a449.07612 449.07612 0 0 1 246.434491 253.389924z m-199.117924 63.894738a825.321517 825.321517 0 0 1 0 191.616767h-186.057326v-191.616767h186.057326z m-186.057326-63.872255V71.248735c79.610379 23.999617 146.957285 135.259976 176.062595 282.092582h-176.062595z m0 319.361277h176.062595c-29.105309 146.832607-96.452216 258.090922-176.062595 282.092583V672.702595z m-449.027066 0.022483a0.028615 0.028615 0 0 0-0.020439-0.016351h143.646148c18.558723 103.479186 54.879042 191.31018 102.808782 253.400144A449.078164 449.078164 0 0 1 95.920798 672.725078zM342.355289 99.947305c-47.929741 62.096096-84.25006 149.920958-102.808782 253.400144H95.900359a0.044966 0.044966 0 0 0 0.020439-0.022483A449.07612 449.07612 0 0 1 342.355289 99.947305z m-47.316566 508.889166a825.321517 825.321517 0 0 1 0-191.616766h186.036886v191.616766h-186.036886z m186.036886 63.872256v282.086451c-79.58994-24.001661-146.936846-135.259976-176.042156-282.092583h176.042156z m0-319.361278h-176.042156c29.105309-146.832607 96.452216-258.090922 176.042156-282.092583v282.086451zM68.675449 464.507657c0.040878-0.386299 0.122635-0.762379 0.163513-1.152767a463.820902 463.820902 0 0 1 7.664671-46.129054v-0.012263h154.131417a911.637972 911.637972 0 0 0 0 191.616766H76.503633v-0.012263a463.820902 463.820902 0 0 1-7.664671-46.129054c-0.040878-0.390387-0.122635-0.762379-0.163513-1.152767a427.874619 427.874619 0 0 1 0-97.028598z"  /></svg>
                    </button>
                    <div class="z-50 hidden my-4 text-base list-none bg-white dark:bg-spixi divide-y divide-gray-100 rounded-lg shadow" id="language-dropdown-menu">
                        <ul class="py-2 font-medium" role="none">
                            <li v-for="locale in availableLocales" :key="locale.code">
                                <div
                                    @click="setLocale(locale.code); toggleDropdownLanguage();"
                                    :class="{
                                        'bg-spixi text-white dark:bg-[#24BBFF]': locale.active,
                                        'hover:bg-spixi hover:text-white dark:hover:bg-[#24BBFF]': !locale.active
                                    }"
                                    class="block px-4 py-2 text-sm text-spixi dark:text-white">
                                    <div class="inline-flex items-center transition-none">
                                        <NuxtImg 
                                            :src="`/img/countries/${locale.code}.svg`" 
                                            class="me-2"
                                            width="20" />
                                        {{ locale.name }}
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="flex justify-center items-center mx-1 md:mx-6 text-sm rounded-lg">
                      <NuxtLink to='/download'>
                         <span class="rounded bg-[#6BFCC8] text-xs max-[400px]:text-[8px] md:text-base text-spixi font-medium px-1 md:px-4 py-2 text-center hover:opacity-90">
                            {{ t('menu.newversion', { version: spixiVersion }) }}
                        </span>
                      </NuxtLink>
                    </div>
                    <button 
                        type="button" 
                        class="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
                        aria-controls="navbar-hamburger" 
                        aria-expanded="false">
                        <span class="sr-only">
                            {{ $t('menu.misc.hamburger.screenreader') }}
                        </span>
                        <client-only>
                            <svg v-if="$colorMode.value === 'dark'" width="21" height="18" viewBox="0 0 21 18" fill="#FFFFFF" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                <rect y="0.5" width="17" height="3" rx="1" />
                                <rect y="7.5" width="19" height="3" rx="1" />
                                <rect y="14.5" width="21" height="3" rx="1" />
                            </svg>
                            <svg v-else width="21" height="18" viewBox="0 0 21 18" fill="#17334F" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                <rect y="0.5" width="17" height="3" rx="1" />
                                <rect y="7.5" width="19" height="3" rx="1" />
                                <rect y="14.5" width="21" height="3" rx="1" />
                            </svg>
                        </client-only>
                    </button>
                </div>
            </div>
            <div class="hidden w-full bg-gradient-to-b from-[#00000000] to-[#1A6FBD59] dark:to-[#3770a659] h-svh justify-center" id="navbar-hamburger">
                <div class="flex flex-col md:flex-row font-medium mt-4 rounded-lg max-w-4xl h-[calc(100%-10rem)] justify-center md:gap-40">
                    <ul class="flex flex-col justify-center">
                        <li class="py-3">
                            <NuxtLink 
                                to="/" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.home') }}
                            </NuxtLink>
                        </li>
                      <li class="py-3">
                        <NuxtLink
                            to="/spixi-mini-apps"
                            class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                          {{ t('menu.mini-apps') }}
                        </NuxtLink>
                      </li>
                        <li class="py-3">
                            <NuxtLink 
                                to="/download" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.download') }}
                            </NuxtLink>
                        </li>
                        <li class="py-3">
                            <NuxtLink 
                                to="/howitworks" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.howitworks') }}
                            </NuxtLink>
                        </li>
                        <li class="py-3">
                            <NuxtLink 
                                to="/howitworks#faq" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                FAQ
                            </NuxtLink>
                        </li>
                    </ul>
                    <ul class="flex flex-col justify-center">
                        <li class="py-3">
                            <NuxtLink 
                                to="/privacy" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.privacy') }}
                            </NuxtLink>
                        </li>
                        <li class="py-3">
                            <NuxtLink 
                                to="/terms" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.terms') }}
                            </NuxtLink>
                        </li>
                        <li class="py-3">
                            <a 
                                href="https://www.ixian.io/" 
                                target="_blank" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.ixian') }}
                            </a>
                        </li>
                        <li class="py-3">
                            <a 
                                href="https://www.ixilabs.co.uk/" 
                                target="_blank" 
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.ixilabs') }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>
