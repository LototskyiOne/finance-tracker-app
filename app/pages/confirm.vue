<template>
    <UCard>
        <template #header>
            Wait untill you will be redirected
        </template>

        <div>You will be redirected soon</div>
        <UButton variant="outline" color="neutral" @click="useRedirectAuth()">Redirect by click</UButton>
    </UCard>
</template>
<script setup>
    const supabase = useSupabaseClient()
    onMounted(async () => {
        await supabase.auth.exchangeCodeForSession(window.location.href)
        useRedirectAuth()
        // navigateTo('/')
    })

</script>