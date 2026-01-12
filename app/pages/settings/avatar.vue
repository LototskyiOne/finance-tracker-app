<template>
  <div>
    <div class="mb-4 flex items-center gap-4">
        <UAvatar :src="url" size="3xl" :key="url" />
    </div>

    <div class="mb-4">
        <UInput type="file" ref="fileInput" class="border-red-300" @change="getFiles" v-model="fileModel"/>        
    </div>

    <UButton type="submit" color="success" variant="solid" label="Save avatar" :loading="pending" :disabled="pending"
      @click="uploadAvatar" />

  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const fileInput = ref()
const file = ref()
const fileModel = ref()
const pending = ref(false)
const {url} = usePublicAvatarUrl()
const {toastAddSuccess, toastAddError} = useAppToast()

const getFiles = (ev) => {
    file.value = ev.target.files ? ev.target.files[0] : null  
}
const uploadAvatar = async () => {
    pending.value = true
    if(!file.value) {
         pending.value = false;
         return
    }
    const ext = file.value.name.split('.').pop()
    const name = `${Math.random()}.${ext}`

    try {
        const {error} = await supabase.storage.from('avatars').upload(name, file.value)
        
        if(error) throw error
        
        await supabase.auth.updateUser({
            data: {
                avatar_url: name
            }
        })
        toastAddSuccess({title:"The avatar was updated"})
        const {err} = await supabase.storage.from('avatars').remove(user.value?.user_metadata?.avatar_url)
        await supabase.auth.refreshSession()
        fileModel.value = null
    } catch(err) {
        console.log(err)
        toastAddError({title:"The avatar was not updated", description: err})
    } finally {
        pending.value = false
    }
}

</script>