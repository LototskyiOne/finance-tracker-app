export const useRedirectAuth = (url = '/') => {
    const supaUser = useSupabaseUser()

    watch(supaUser, (user) => {
        if(user) {
            return navigateTo(url)
        }
    }, {immediate: true})

    return {supaUser}
} 