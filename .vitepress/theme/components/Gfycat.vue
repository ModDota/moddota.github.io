<script setup lang="ts">
const props = defineProps<{
    id: string;
    aspectRatio?: number;
    hd?: string;
}>();

const ratio = props.aspectRatio ?? 4 / 3;
const paddingBottom = `${(1 / ratio) * 100}%`;
const src = `https://gfycat.com/ifr/${props.id}?hd=${props.hd ?? "0"}`;
</script>

<template>
    <p :style="{ position: 'relative', paddingBottom }">
        <iframe
            :src="src"
            scrolling="no"
            frameborder="0"
            allowfullscreen
            width="100%"
            height="100%"
            style="position: absolute; top: 0; left: 0"
        />
    </p>
</template>
