<script setup lang="ts">
const props = defineProps<{
    id?: string;
    playlistId?: string;
    aspectRatio?: number;
}>();

const ratio = props.aspectRatio ?? 16 / 9;
const paddingBottom = `${(1 / ratio) * 100}%`;
const embedUrl = props.playlistId
    ? `https://www.youtube.com/embed/videoseries?list=${props.playlistId}`
    : `https://www.youtube.com/embed/${props.id}`;
</script>

<template>
    <p :style="{ position: 'relative', paddingBottom }">
        <iframe
            :src="embedUrl"
            frameborder="0"
            allowfullscreen
            width="100%"
            height="100%"
            style="position: absolute; top: 0; left: 0"
        />
    </p>
</template>
