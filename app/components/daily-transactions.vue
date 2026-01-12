<template>
    <div class="grid grid-cols-2 mb-4 border-b-1 border-gray-700">
        <div class="flex items-center justify-start">
            {{ props.date }}
        </div>

        <div class="flex items-center justify-end text-sm">
            {{ currency }}
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    date: String,
    transactions: Array
})
const sum = computed(() => {
    let sum = 0;
    for(const transaction of props.transactions) {
        if(transaction.type === 'Income') {
            sum += Number(transaction.amount)
        } else {
            sum -= Number(transaction.amount)
        }
    }
    return sum;
})
const {currency} = useCurrency(sum);

</script>