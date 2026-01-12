<template>
  <UModal
    title="Add new transaction"
    v-model:open="isOpen"
  >
    <template #body>
      <UForm class="space-y-2" :state="state" :schema="schema" ref="formRef" @submit="sendForm">

        <UFormField label="Type of the transaction" name="type" :required="true">
          <USelect :disabled="!!props.transaction" :items="transactionTypes" class="w-full" placeholder="Choose transaction type" v-model="state.type"/>
        </UFormField>

        <UFormField label="Amount" name="amount" :required="true">
          <UInput class="w-full" type="number" placeholder="Enter amount..." v-model="state.amount"/>
        </UFormField>

        <UFormField label="Transaction date" name="created_at" :required="true">
          <UInput class="w-full" type="date" placeholder="Enter date..." v-model="state.created_at"/>
        </UFormField>      
        
        <UFormField label="Description" name="description">
          <UInput class="w-full" type="text" placeholder="Enter description..." v-model="state.description"/>
        </UFormField>        

        <UFormField label="Category of the transaction" name="category" :required="true" v-if="state.type == 'Expense'">
          <USelect :items="transactionCategories" class="w-full" placeholder="Choose transaction category" v-model="state.category"/>
        </UFormField>

        <UButton  class="mt-4" :loading="isLoading" type="submit">
          Submit
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script setup>
import { transactionCategories, transactionTypes } from '~~/constants';
import z from 'zod';

const props = defineProps({
    open: Boolean,
    refresh: Function,
    transaction: {
      type: Object,
      required: false
    }
  })

const emit = defineEmits(['update:open'])

const isLoading = ref(false)
const isEditing = computed(() => !!props.transaction)
const supabase = useSupabaseClient()
const {toastAddSuccess, toastAddError} = useAppToast()
const baseSchema = z.object({
  description: z.string().optional(),
  amount: z.number().positive('Amount must be more than 0'),
  created_at: z.string('Choose date!')
})
const incomeSchema = z.object({
  type: z.literal('Income')
})
const expenseSchema = z.object({
  type: z.literal('Expense'),
  category: z.enum(transactionCategories, 'Select some option!')
})
const savingsSchema = z.object({
  type: z.literal('Savings')
})
const investmentSchema = z.object({
  type: z.literal('Investment')
})
const schema = z.intersection(
  z.discriminatedUnion('type', [incomeSchema, expenseSchema, savingsSchema, investmentSchema]),
  baseSchema
)
const formRef = ref()
const initialState = {
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined
}
const state = ref({
  ...initialState
})

watch(() => props.transaction, (newValue) => {
  if(newValue && Object.keys(newValue).length > 0) {
    state.value = {
      type: newValue.type,
      amount: newValue.amount || 0,
      created_at: newValue.created_at,
      description: newValue.description,
      category: newValue.category
    }
  } else {
    state.value = {...initialState}
  }
}, {immediate: true})

const resetForm = async () => {
  state.value = {...initialState}
  formRef.value.clear();
}
const sendForm = async () => {
  if(formRef.value.errors.length) return

  isLoading.value = true
  try {
    const {error} = await supabase.from('Transactions').upsert({...state.value, id: props.transaction?.id})
    if(error) throw error

    toastAddSuccess({title: 'Transaction added'})

    isOpen.value = false
    props?.refresh()
  } catch (e) {
    console.log("ERROR:", e)
          toastAddError({title: 'Error while adding transaction', description: e})  
  } finally {
    isLoading.value = false
  }
}
const isOpen = computed({
  get() {
    return props.open
  },
  set(newValue) {
    resetForm();
    emit('update:open', newValue)
  }
})

</script>