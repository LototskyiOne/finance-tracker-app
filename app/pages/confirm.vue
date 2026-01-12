<template>
    <UCard>
        <template #header>
            Wait untill you will be redirected
        </template>

        <div>You will be redirected soon</div>
        <UButton variant="outline" color="neutral">Redirect by click</UButton>
    </UCard>
</template>
<script setup>
    useRedirectAuth()
</script>