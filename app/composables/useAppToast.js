export const useAppToast = () => {
    const toast = useToast()

    return {
    toastAddSuccess: ({title, description = null}) => {
        toast.add({
            title,
            description,
            icon: 'i-heroicons-check-circle',
            color: 'success'
        })  
    },
    toastAddError: ({title, description = null}) => {
        toast.add({
            title,
            description,
            icon: 'i-heroicons-exclamation-circle',
            color: 'error'
        })        
    }
    }


}