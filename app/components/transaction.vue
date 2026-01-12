<template>
    <div class="grid grid-cols-2 mb-4 border-b-1 border-gray-700">
        <div class="flex items-center justify-between">
            <div class="flex items-center justify-between text-sm">
                <div class="w-5 h-5">
                    <UIcon :name="icon" :class="[iconColor]" class="w-5 h-5" />
                </div>
                <div>
                    {{ props.transaction.description }}
                </div>
            </div>
            <div v-if="props.transaction.type">
                <UBadge color="info" icon="i-lucide-rocket" class="w-24 justify-center">{{ props.transaction.type }}</UBadge>
            </div>
        </div>

        <div class="flex items-center justify-end space-x-2 text-sm">
            <div :class="[iconColor]">{{ currency }}</div>
            <div>
                <UDropdownMenu
                    :items="items"
                    :content="{
                        align: 'start',
                        side: 'bottom',
                        sideOffset: 2
                    }"
                    :ui="{
                    content: 'w-48'
                    }"
                >
                    <UButton icon="i-heroicons-ellipsis-horizontal-16-solid" color="neutral" variant="ghost" :loading="isLoading"/>
                </UDropdownMenu>                                
            </div>
        </div>
    </div>
</template>
<script setup>
const emit = defineEmits(['delete', 'edit'])
const props = defineProps({
    transaction: Object
})
const currencyAmountRef = computed(() => props.transaction.amount)
const { currency } = useCurrency(currencyAmountRef)
const supabase = useSupabaseClient();
const {toastAddSuccess, toastAddError} = useAppToast()
const isLoading = ref(false);
const deleteTransaction = async () => {
    isLoading.value = true
    try {
        await supabase.from('Transactions').delete().eq('id', props.transaction.id);
          toastAddSuccess({title: 'Transaction deleted'})
        emit('delete');
    } catch (err) {
        console.log(err)
        toastAddError({title: 'Transaction not deleted'})      
    } finally {
        isLoading.value = false
    }
}
const items = [
    [
        {
            label: 'Edit',
            icon: 'i-heroicons-pencil-square-solid',
            onSelect() {
                emit('edit')
            }                    
        },                     
        {
            label: 'Delete',
            icon: 'i-heroicons-trash-16-solid',
            onSelect() {
                deleteTransaction();
            }                      
        }
    ]
]
const isIncome = props.transaction.type.toLowerCase() !== 'expense'
const icon = computed(() => isIncome ? 'i-heroicons-arrow-up-right-16-solid' : 'i-heroicons-arrow-down-left-16-solid')
const iconColor = computed(() => isIncome ? 'text-green-500' : 'text-red-500')
</script>