export const useTransactions = (currentPeriod) => {
    const supabase = useSupabaseClient();
    const transactions = ref([])
    const pending = ref(false)

    watch(currentPeriod, async () => await refreshTransactions())

    const fetchTransactions = async () => {
        pending.value = true
        try {
            const {data, error} = await supabase
            .from('Transactions')
            .select()
            .gte('created_at', currentPeriod.value.from.toISOString().split('T')[0])
            .lt('created_at', currentPeriod.value.to.toISOString().split('T')[0])
            .order('created_at', {ascending: false});
            return error ? [] : data
        } finally {
            pending.value = false
        }
    }
    const refreshTransactions = async () => {
        transactions.value = await fetchTransactions();
    }
    const groupedTransactions = computed(() => {
        let grouped = {};
        for(const transaction of transactions.value) {
            const date = transaction.created_at.split('T')[0];
            if(!grouped[date]) {
                grouped[date] = [];
            }

            grouped[date].push(transaction);
        }
        return grouped
    })
    const incomeTransactions = computed(() => transactions.value.filter((t) => t?.type.toLowerCase() === 'income'))
    const expenseTransactions = computed(() => transactions.value.filter((t) => t?.type.toLowerCase() === 'expense'))

    const incomeTotal = computed(() => incomeTransactions.value.reduce((acc, t) => acc + Number(t.amount || 0), 0))
    const expenseTotal = computed(() => expenseTransactions.value.reduce((acc, t) => acc + Number(t.amount || 0), 0)) 
    
    return {
        transactions,
        groupedTransactions,
        incomeTransactions,
        expenseTransactions,
        incomeTotal,
        expenseTotal,
        refreshTransactions,
        pending
    }
}