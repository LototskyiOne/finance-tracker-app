<template>
    <span class="text-xs font-semibold">Update your default transactions preview</span>
    <UForm :state="state" @submit="updateDefaultTransactionsView" class="flex flex-col gap-4 items-start">
        <USelectMenu v-model="state.default_view" :items="transactionViewOptions"  class="w-50"/>

        <UButton color="success" type="submit" :loading="pending">Update default view</UButton>
    </UForm>
</template>

<script setup>
import {transactionViewOptions} from '~~/constants';

const pending = ref(false)
const {toastAddError, toastAddSuccess} = useAppToast()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const state = ref({
    default_view: user.value?.user_metadata.default_view || transactionViewOptions[0]
})
const updateDefaultTransactionsView = async () => {
    pending.value = true
    try {
        const {error} = await supabase.auth.updateUser({
            data: {
                default_view: state.value.default_view
            }         
        })
        await supabase.auth.refreshSession()
        if(error) throw error
        toastAddSuccess({title: 'Updated default view for transactions'})
        
    } catch (e) {
        toastAddError({title: 'Errof while updating default transactions view', description: e.message})
    } finally {
        pending.value = false
    }
}
</script>