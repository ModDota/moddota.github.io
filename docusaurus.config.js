/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: "ModDota",
    url: "https://moddota.com",
    baseUrl: "/",
    favicon: "images/favicon.ico",
    onBrokenLinks: "throw",
    themeConfig: {
        navbar: {
            title: "ModDota",
            logo: {
                alt: "ModDota",
                src: "images/logo.svg",
            },
            items: [
                { position: "left", label: "Lua API", href: "https://moddota.com/api" },
                {
                    position: "left",
                    label: "Panorama API",
                    href: "https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Javascript/API",
                },
                { position: "right", label: "Discord", href: "https://discord.gg/gRmZgvz" },
            ],
        },
        prism: {
            additionalLanguages: ["lua"],
            theme: require("prism-react-renderer/themes/github"),
            darkTheme: require("prism-react-renderer/themes/dracula"),
        },
        algolia: {
            appId: "53WE0HHYGT",
            apiKey: "ce612349c2e1e35842e9630128e92dc2",
            indexName: "moddota",
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    path: "_articles",
                    routeBasePath: "/",
                    sidebarPath: require.resolve("./sidebars.json"),
                    editUrl: "https://github.com/ModDota/moddota.github.io/edit/source/",
                    showLastUpdateAuthor: true,
                    showLastUpdateTime: true,
                    remarkPlugins: [
                        require("./docusaurus/remark-component-provider"),
                        require("./docusaurus/remark-remove"),
                    ],
                },
                theme: {
                    customCss: require.resolve("./src/custom.scss"),
                },
            },
        ],
    ],
    plugins: ["docusaurus-plugin-sass", require.resolve("./docusaurus/plugin")],
};
