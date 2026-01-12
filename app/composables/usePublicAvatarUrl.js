export const usePublicAvatarUrl = () => {
    const supabase = useSupabaseClient()
    const user = useSupabaseUser()

    const getPublicUrl = async () => {
        if(!user.value?.user_metadata?.avatar_url) return
        const {data} = await supabase.storage.from('avatars').createSignedUrl(user.value.user_metadata.avatar_url, 60*60)
        return data?.signedUrl ?? null
    }
    
    const url = ref(null)

    watch(user, async () => {
        return url.value = await getPublicUrl()
    }, {immediate: true})

    return {url}
}