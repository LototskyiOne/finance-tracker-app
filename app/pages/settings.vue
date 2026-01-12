<template>
    <div class="grid grid-cols-6 gap-4 mt-6">
        <div class="col-span-2">
            <UNavigationMenu :items="items" class="w-full justify-center" orientation="vertical" />
        </div>
        <div class="col-span-4">
            <NuxtPage></NuxtPage>
        </div>
    </div>
</template>

<script setup>
const items = ref([
    {
        label: 'Avatar',
        to: '/settings/avatar'
    },
    {
        label: 'Profile',
        to: '/settings/profile'
    },
    {
        label: 'Settings',
        to: '/settings/settings'
    }        
])
</script>