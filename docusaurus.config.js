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
                    // TODO: Remove after migration
                    include: ["_index.md", "ask-a-question.md", "contribute.md"],
                },
                pages: {
                    include: ["index.tsx"],
                },
            },
        ],
    ],
    plugins: [require.resolve("./docusaurus-plugin")],
};
