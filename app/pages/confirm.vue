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
        const {data, error} = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) {
            console.error(error)
            return
        }
        await nextTick()

        navigateTo('/')        
        // useRedirectAuth()
    })

</script>