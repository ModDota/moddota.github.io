/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: "ModDota",
    url: "https://moddota.com",
    baseUrl: "/",
    favicon: "images/favicon.ico",
    themeConfig: {
        navbar: {
            title: "ModDota",
            logo: {
                alt: "ModDota",
                src: "images/logo.svg",
            },
            items: [
                { position: "left", label: "Tutorials", to: "tutorials" },
                { position: "left", label: "Lua API", href: "/api" },
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
            apiKey: "5c91053fa708fac220dfd06a4a04fee9",
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
    plugins: [require.resolve("./docusaurus/plugin")],
};
