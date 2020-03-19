<template>
    <div class="home">
        <img alt="Vue logo" src="/images/fishbowl.png"/>
        <ComingSoon msg="Welcome to Fishbowl"/>
    </div>
</template>

<script lang="ts">
    // @ is an alias to /src
    import HelloWorld from '@/components/HelloWorld.vue'
    import ComingSoon from '@/components/ComingSoon.vue'

    export default {
        name: 'Home',
        components: {
            ComingSoon,
        },
    }
</script>
