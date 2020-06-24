/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: "ModDota",
    url: "https://moddota.com",
    baseUrl: "/",
    favicon: "images/favicon.ico",
    themeConfig: {
        announcementBar: {
            id: "contest_2020",
            content:
                'Join the <a target="_blank" href="https://contest.dota2unofficial.com/">Dota 2 Custom Games Contest</a> and win a Grand Prize of $10,000 USD!',
        },
        navbar: {
            title: "ModDota",
            logo: { src: "images/logo-80x80.png" },
            links: [
                { position: "left", label: "Tutorials", to: "tutorials" },
                { position: "left", label: "Lua API", href: "https://dota.tools/vscripts/" },
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
                    remarkPlugins: [require("./docusaurus/remark-component-provider")],
                },
                theme: {
                    customCss: require.resolve("./src/custom.scss"),
                },
            },
        ],
    ],
    plugins: [require.resolve("./docusaurus/plugin")],
};
