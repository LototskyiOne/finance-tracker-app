<template>
    <UDropdownMenu variant="ghost" :items="items" class="cursor-pointer"
        :ui="{ item: { disabled: 'cursor-text select-text' }, content: 'w-50' }" v-if="user">
        <UAvatar :src="url" alt="Avatar" />

        <template #account="{ item }">
            <div class="text-left">
                <p>
                    Signed in as
                </p>
                <p class="font-medium text-gray-900 dark:text-white">
                    {{ user.email }}
                </p>
            </div>
        </template>

        <template #item="{ item }">
            <div class="cursor-pointer w-full flex justify-between items-center">
                <span class="truncate">{{ item.label }}</span>
                <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
            </div>
        </template>
    </UDropdownMenu>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const {url} = usePublicAvatarUrl()
const items = [
    [{
        slot: 'account',
        disabled: true
    }], [{
        label: 'Settings',
        icon: 'i-heroicons-cog-8-tooth',
        onSelect: () => navigateTo('/settings/avatar')
    }, {
        label: 'Sign out',
        icon: 'i-heroicons-arrow-left-on-rectangle',
        onSelect: async () => {
            await supabase.auth.signOut()
            return navigateTo('/login')
        }
    }]
]
</script>