/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: "ModDota",
    url: "https://moddota.com",
    baseUrl: "/",
    favicon: "images/favicon.ico",
    themeConfig: {
        navbar: {
            title: "ModDota",
            links: [
                { to: "articles", label: "Tutorials", position: "left" },
                { href: "https://discord.gg/gRmZgvz", label: "Discord", position: "right" },
            ],
        },
        prism: {
            theme: require("prism-react-renderer/themes/github"),
            darkTheme: require("prism-react-renderer/themes/vsDark"),
        },
    },
    presets: [
        [
            "@docusaurus/preset-classic",
            {
                docs: {
                    path: "_articles",
                    routeBasePath: "articles",
                    sidebarPath: require.resolve("./sidebars.json"),
                    editUrl: "https://github.com/ModDota/moddota.github.io/edit/source/",
                    remarkPlugins: [require("./docusaurus/remark-component-provider")],
                },
                pages: {
                    include: ["index.tsx"],
                },
            },
        ],
    ],
    plugins: [require.resolve("./docusaurus/plugin")],
};
