<template>
    <section class="flex items-center justify-between my-10">
        <h1 class="text-4xl font-extrabold">
            Summary
        </h1>
        <div>
            <USelectMenu v-model="selectedView" :items="transactionViewOptions" class="w-30"/>
        </div>
    </section>

    <section>
        <div class="grid items-center cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-x-16 sm:gap-y-4 mb-10">
            <Trend title="Income" :amount="incomeTotal" :lastAmount="12000" :loading="pending"/>
            <Trend title="Expences" :amount="expenseTotal" :lastAmount="4000" :loading="pending"/>
            <Trend title="Investments" :amount="4000" :lastAmount="3500" :loading="pending"/>
            <Trend title="Savings" :amount="4000" :lastAmount="4400" :loading="pending"/>
        </div>
    </section>
    <section>
        <div class="w-full mb-8 flex items-center justify-between">
            <div class="text-xs text-gray-300">For this period you had <strong>{{ incomeTransactions.length }} income</strong>  transactions and <strong>{{ expenseTransactions.length}} expense</strong> transactions</div>
            <div>
                <TransactionModal 
                    v-model:open="isTransactionModalOpen" 
                    :transaction="transactionToEdit" 
                    :refresh="refreshTransactions"
                    />
                <UButton icon="i-heroicons-plus-circle" color="neutral" variant="ghost" label="Add" @click="toggleTransactionModal"/>
            </div>
        </div>
    </section>   

    <section v-if="!pending">
        <div v-for="(transactionsOnDay, date) in groupedTransactions" :key="date">
            <DailyTransactions :date="date" :transactions="transactionsOnDay"/>
            <Transaction v-for="transaction in transactionsOnDay" 
                :transaction="transaction" 
                :key="transaction.id" 
                @delete="refreshTransactions()" 
                @edit="setTransactionToEdit(transaction)"
                />
        </div>
    </section>
    <section v-else>
        <USkeleton class="w-max h-4" v-for="i in 3" :key="i"></USkeleton>
    </section>

</template>

<script setup>
import {transactionViewOptions} from '~~/constants';

const user = await useSupabaseUser()
const selectedView = ref(user.value?.user_metadata?.default_view ? user.value.user_metadata.default_view : transactionViewOptions[0]);
const {currentPeriod} = useDateCalc(selectedView)
const {pending, refreshTransactions, incomeTotal, expenseTotal, incomeTransactions, expenseTransactions, groupedTransactions} = useTransactions(currentPeriod)
const isTransactionModalOpen = ref(false)
const transactionToEdit = ref({}) 

const toggleTransactionModal = () => {
    isTransactionModalOpen.value = !isTransactionModalOpen.value
    transactionToEdit.value = null
}
const setTransactionToEdit = (t) => {
    toggleTransactionModal()
    transactionToEdit.value  = typeof t === 'object' ? t : {}
}
await refreshTransactions();
</script>