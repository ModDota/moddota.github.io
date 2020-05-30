/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: "ModDota",
    url: "https://moddota.com",
    baseUrl: "/",
    favicon: "images/favicon.ico",
    themeConfig: {
        navbar: {
            title: "ModDota",
            logo: { src: "images/logo-80x80.png" },
            links: [
                { position: "left", label: "Tutorials", to: "/" },
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
                pages: {
                    include: ["index.tsx"],
                },
            },
        ],
    ],
    plugins: [require.resolve("./docusaurus/plugin")],
};
