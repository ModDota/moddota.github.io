<script setup lang="ts">
import { withBase } from "vitepress";

const props = defineProps<{
    path: string;
    controls?: boolean;
}>();
</script>

<template>
    <video width="100%" height="100%" autoplay muted loop :controls="props.controls ?? false">
        <source :src="withBase(props.path)" type="video/mp4" />
    </video>
</template>
