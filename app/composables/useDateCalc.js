export const useDateCalc = (period) => {

    const currentPeriod = computed(() => {
        const now = new Date();
        switch(period.value.toString().trim()) {    
             case 'Daily':
                return {
                    from: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())),
                    to: new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1))
                }                

             case 'Monthly':
                return {
                    from: new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)),
                    to: new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0))
                }                
             
             case 'Yearly':
                return {
                    from: new Date(now.getFullYear(), 0, 1),
                    to: new Date(now.getFullYear(), 12, 0)
                }               
        }
    })

    return {currentPeriod}
}