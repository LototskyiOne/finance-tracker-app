<template>
    <UCard v-if="!success" class="mt-8">
        <template #header>
            Sign-in to the finance tracker
        </template>

        <form @submit.prevent="signIn">
            <UFormField label="Email" name="email" class="mb-4" :required="true">
                <UInput placeholder="Enter your email" type="email" required v-model="email"/>
            </UFormField>

            <UButton type="submit" variant="solid" color="primary" :disabled="pending" :loading="pending">Sign-in</UButton>
        </form>
    </UCard>
    <UCard v-else class="mt-8">
        <template #header>
            Email has been sent
        </template>
        <div>Link will expire in 5 min</div>    
    </UCard>
</template>

<script setup>
    const success = ref(false)
    const email = ref('')
    const pending = ref(false)
    const supabase = useSupabaseClient()
    const {toastAddError} = useAppToast()
    const redirectUrl = useRuntimeConfig().public.baseUrl

useRedirectAuth()

const signIn = async () => {
    pending.value = true;

    try {
        const {error} = await supabase.auth.signInWithOtp({
            email: email.value,
            options: {
                emailRedirectTo: `${redirectUrl}/confirm`
            }
        })

        if(!error) {
            success.value = true
        }
    } catch(e) {
        console.log('Error: ', e);
        toastAddError({title: 'Error occured while login'});
    } finally {
        pending.value = false
    }    
}



</script>
