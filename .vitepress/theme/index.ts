import DefaultTheme from "vitepress/theme";
import type { Theme } from "vitepress";
import YouTube from "./components/YouTube.vue";
import Gfycat from "./components/Gfycat.vue";
import StaticVideo from "./components/StaticVideo.vue";
import "./custom.css";

export default {
    extends: DefaultTheme,
    enhanceApp({ app }) {
        app.component("YouTube", YouTube);
        app.component("Gfycat", Gfycat);
        app.component("StaticVideo", StaticVideo);
    },
} satisfies Theme;
