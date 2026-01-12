<template>
    <UForm :state="state" :schema="schema" @submit="updateData">
        <UFormField label="Name" name="name">
            <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Email" name="email" class="mt-4">
            <UInput v-model="state.email" />
        </UFormField>

        <UButton color="success" type="submit" class="mt-4" :loading="pending">Update data</UButton>
    </UForm>
</template>

<script setup>
import z from 'zod'

const pending = ref(false)
const {toastAddError, toastAddSuccess} = useAppToast()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const state = ref({
    name: user.value?.user_metadata.full_name,
    email: user.value?.email
})
const schema = z.object({
    name: z.string().min(3, 'To short name').optional(),
    email: z.email()
})
const updateData = async () => {
    pending.value = true
    try {
        const {error} = await supabase.auth.updateUser({
            data: {
                full_name: state.value.name,
                hello: 'greeting'
            },
            ...(user.value.email !== state.value.email && { email: state.value.email })            
        })
        await supabase.auth.refreshSession()
        if(error) throw error
        toastAddSuccess({title: 'Updated profile info'})
        
    } catch (e) {
        toastAddError({title: 'Erro while updating data', description: e.message})
    } finally {
        pending.value = false
    }
}
</script>