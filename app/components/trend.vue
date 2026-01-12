<template>
    <div v-if="loading">
        <USkeleton class="h-6 w-full mb-2" />
        <USkeleton class="h-8 w-full" />
    </div>
    <div v-else class="flex flex-col">
        <div :class="{'green' : isTrendingUp, 'red': !isTrendingUp}" class="text-sm">{{ title }}</div>
        <div class="font-bold text-xl">{{ currency }}</div>
        <div class="flex items-center justify-start space-x-1">
            <div>
                <UIcon :name="icon" class="w-4 h-4" :class="{'green' : isTrendingUp, 'red': !isTrendingUp}"/>
            </div>
            <div class="text-xs">
                {{trendingPrecentage}} % in period
            </div>
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    title: String,
    amount: Number,
    lastAmount: Number,
    color: String,
    loading: Boolean
})
const currencyAmountRef = toRef(props, 'amount');
const {currency} = useCurrency(currencyAmountRef);
const isTrendingUp = computed(() => props.amount >= props.lastAmount ? true : false)
const trendingPrecentage = computed(() => {
    const min = Math.min(props.amount, props.lastAmount);
    const max = Math.max(props.amount, props.lastAmount);
    const diff = Math.ceil(((max - min) / max) * 100);
    return diff;
})
const icon = computed(() => isTrendingUp.value ? 'i-heroicons-arrow-trending-up-16-solid' : 'i-heroicons-arrow-trending-down-16-solid')

</script>
<style scoped>
@reference '@/assets/css/tailwind.css';
.green {
    @apply text-green-600 dark:text-green-500
}
.red {
    @apply text-red-600 dark:text-red-500
}
</style>