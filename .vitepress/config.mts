import { defineConfig } from "vitepress";

export default defineConfig({
    title: "ModDota",
    description: "Community-driven Dota 2 modding resource",
    lang: "en-US",
    head: [["link", { rel: "icon", href: "/images/favicon.ico" }]],
    srcDir: "_articles",
    outDir: "build",
    cleanUrls: true,
    ignoreDeadLinks: [/\.fbx$/],
    assetsDir: "_assets", // Do not conflict with assets articles

    markdown: {
        lineNumbers: true,
    },

    themeConfig: {
        logo: "/images/logo.svg",

        nav: [
            {
                text: "Lua API",
                link: "https://moddota.com/api/",
            },
            {
                text: "Panorama API",
                link: "https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/Javascript/API",
            },
        ],

        socialLinks: [{ icon: "discord", link: "https://discord.gg/gRmZgvz" }],

        sidebar: [
            { text: "Getting Started", link: "/getting-started" },
            { text: "Scripting Introduction", link: "/scripting-introduction" },
            {
                text: "Typescript",
                collapsed: true,
                items: [
                    { text: "Introduction", link: "/scripting/Typescript/typescript-introduction" },
                    { text: "Ability", link: "/scripting/Typescript/typescript-ability" },
                    { text: "Modifier", link: "/scripting/Typescript/typescript-modifier" },
                    { text: "Events", link: "/scripting/Typescript/typescript-events" },
                    { text: "Tooltip Generator", link: "/scripting/Typescript/tooltip-generator" },
                ],
            },
            {
                text: "Abilities, items, modifiers",
                collapsed: true,
                items: [
                    { text: "Ability KeyValues", link: "/abilities/ability-keyvalues" },
                    { text: "Item KeyValues", link: "/abilities/item-keyvalues" },
                    {
                        text: "The Importance of AbilityValues Values",
                        link: "/abilities/the-importance-of-abilityvalues-values",
                    },
                    {
                        text: "Passing AbilityValues Values into Lua",
                        link: "/abilities/passing-abilityvalues-values-into-lua",
                    },
                    { text: "AbilityDuration Tooltips", link: "/abilities/abilityduration-tooltips" },
                    { text: "Simple Custom Ability", link: "/abilities/simple-custom-ability" },
                    { text: "Creating Innate Abilities", link: "/abilities/creating-innate-abilities" },
                    { text: "Making Any Ability Use Charges", link: "/abilities/making-any-ability-use-charges" },
                    { text: "Calling Spells with SetCursor", link: "/abilities/calling-spells-with-setcursor" },
                    {
                        text: "Lua Abilities and Modifiers",
                        link: "https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Lua_Abilities_and_Modifiers",
                    },
                    { text: "Lua Item Tutorial", link: "/abilities/lua-item-tutorial" },
                    {
                        text: "Lua Modifiers",
                        collapsed: true,
                        items: [
                            { text: "Extending Hero/NPC API", link: "/abilities/lua-modifiers/1" },
                            { text: "Linken's Sphere & Lotus Orb", link: "/abilities/lua-modifiers/2" },
                            { text: "Transformations", link: "/abilities/lua-modifiers/3" },
                            { text: "Enchanting Trees", link: "/abilities/lua-modifiers/4" },
                            { text: "Custom Barriers", link: "/abilities/lua-modifiers/5" },
                        ],
                    },
                    {
                        text: "Reutilizing Built-in Modifiers",
                        link: "/abilities/reutilizing-built-in-modifiers",
                    },
                    {
                        text: "Datadriven",
                        collapsed: true,
                        items: [
                            {
                                text: "Ability Events & Modifiers",
                                link: "/abilities/datadriven/datadriven-ability-events-modifiers",
                            },
                            { text: "All About the Target", link: "/abilities/datadriven/all-about-the-target" },
                            {
                                text: "Channeling Animations",
                                link: "/abilities/datadriven/channeling-animations",
                            },
                            {
                                text: "Invisibility Ability Example",
                                link: "/abilities/datadriven/invisibility-ability-example",
                            },
                            {
                                text: "Illusion Ability Example",
                                link: "/abilities/datadriven/illusion-ability-example",
                            },
                            {
                                text: "Rotate Ability Example",
                                link: "/abilities/datadriven/rotate-ability-example",
                            },
                            {
                                text: "Point Channeling AoE Example",
                                link: "/abilities/datadriven/point-channeling-aoe-ability-example",
                            },
                            {
                                text: "Hero & Creep Modifier Durations",
                                link: "/abilities/datadriven/apply-hero-and-creep-modifier-durations",
                            },
                            {
                                text: "Physics Ability Example (Exorcism)",
                                link: "/abilities/datadriven/physics-ability-example-exorcism",
                            },
                        ],
                    },
                    {
                        text: "Modifier Properties in Tooltips",
                        link: "/abilities/modifier-properties-in-tooltips",
                    },
                    { text: "Server to Client", link: "/abilities/server-to-client" },
                ],
            },
            {
                text: "Units",
                collapsed: true,
                items: [
                    { text: "Unit KeyValues", link: "/units/unit-keyvalues" },
                    { text: "Unit Producing Buildings", link: "/units/unit-producing-buildings" },
                    { text: "Creating Units with a Duration", link: "/units/creating-units-with-a-duration" },
                    { text: "Adding a Simple AI to Units", link: "/units/adding-a-very-simple-ai-to-units" },
                    { text: "Simple Neutral AI", link: "/units/simple-neutral-ai" },
                    {
                        text: "Creature AttachWearable Blocks",
                        link: "/units/create-creature-attachwearable-blocks-directly-from-the-keyvalues",
                    },
                ],
            },
            {
                text: "Scripting",
                collapsed: true,
                items: [
                    { text: "Custom Mana System", link: "/scripting/custom-mana-system" },
                    { text: "Item Restrictions/Requirements", link: "/scripting/item-restrictions-requirements" },
                    { text: "Item Drop System", link: "/scripting/item-drop-system" },
                    { text: "Making an RPG-like Looting Chest", link: "/scripting/making-a-rpg-like-looting-chest" },
                    { text: "Scripted Shop Spawning", link: "/scripting/scripted-shop-spawning" },
                    { text: "Lava Damage", link: "/scripting/lava-damage" },
                    { text: "Using Dota Filters", link: "/scripting/using-dota-filters" },
                    { text: "Particle Attachment", link: "/scripting/particle-attachment" },
                    { text: "Vector Math", link: "/scripting/vector-math" },
                    {
                        text: "Precache: Fixing and Avoiding Issues",
                        link: "/scripting/precache-fixing-and-avoiding-issues",
                    },
                    {
                        text: "Custom NetTables",
                        link: "https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Custom_Nettables",
                    },
                    { text: "Advanced Looting Chest", link: "/scripting/advanced-looting-chest" },
                ],
            },
            {
                text: "Panorama UI",
                collapsed: true,
                items: [
                    {
                        text: "Introduction",
                        link: "https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama",
                    },
                    { text: "Inclusive Panorama UI", link: "/panorama/inclusive-panorama-ui" },
                    {
                        text: "Panorama UI with TypeScript",
                        link: "/panorama/introduction-to-panorama-ui-with-typescript",
                    },
                    { text: "Keybindings", link: "/panorama/keybindings" },
                    { text: "DOTAScenePanel", link: "/panorama/dotascenepanel" },
                    { text: "Button Examples", link: "/panorama/button-examples" },
                    {
                        text: "Custom Game Setup",
                        link: "https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Custom_Game_Setup",
                    },
                    { text: "Hiding HUD with SetHUDVisible", link: "/panorama/hiding-hud-with-sethudvisible" },
                    { text: "Webpack", link: "/panorama/webpack" },
                    { text: "React", link: "/panorama/react" },
                ],
            },
            {
                text: "Assets",
                collapsed: true,
                items: [
                    { text: "Asset File Type Reference", link: "/assets/asset-file-type-reference" },
                    {
                        text: "Maps",
                        collapsed: true,
                        items: [
                            { text: "Hammer Tutorials", link: "/assets/maps/hammer-tutorials" },
                            {
                                text: "Making Skip/Clip Blocks from Models",
                                link: "/assets/maps/making-skip-clip-blocks-out-of-models",
                            },
                        ],
                    },
                    {
                        text: "Models",
                        collapsed: true,
                        items: [
                            { text: "MDL to VMDL Conversion", link: "/assets/models/mdl-to-vmdl-conversion" },
                            {
                                text: "Adding Hitbox to Models Without a Bone",
                                link: "/assets/models/adding-hitbox-to-models-without-a-bone",
                            },
                            {
                                text: "Importing Models & Material Editor",
                                link: "/assets/models/importing-models-and-using-material-editor",
                            },
                            {
                                text: "Exporting Models & Materials/Textures",
                                link: "/assets/models/exporting-models-and-materials-textures",
                            },
                            {
                                text: "Custom Hero Models & Animations",
                                link: "/assets/models/custom-hero-models-materials-animations",
                            },
                        ],
                    },
                    {
                        text: "Particles",
                        collapsed: true,
                        items: [
                            { text: "Particle Tutorial", link: "/assets/particles/particle-tutorial" },
                            { text: "Particle Basics", link: "/assets/particles/particle-basics" },
                            { text: "Chaos Wave Particle", link: "/assets/particles/chaos-wave-particle" },
                            {
                                text: "Falling Cherry Blossom Petal",
                                link: "/assets/particles/falling-cherry-blossom-petal-for-spring-mood-particle",
                            },
                            { text: "Volcano Particle", link: "/assets/particles/volcano-particle" },
                            { text: "Status Effects", link: "/assets/particles/status-effects" },
                        ],
                    },
                    { text: "Custom Sounds", link: "/assets/custom-sounds" },
                    {
                        text: "Extracting & Compiling VTEX Files",
                        link: "/assets/extracting-and-compiling-vtex-files",
                    },
                    { text: "Custom Minimap Icons", link: "/assets/custom-minimap-icons" },
                ],
            },
            {
                text: "Tools",
                collapsed: true,
                items: [
                    { text: "Setting Up for Collaboration", link: "/tools/setting-up-for-collaboration" },
                    { text: "Useful Console Commands", link: "/tools/useful-console-commands" },
                    { text: "Setting Up with GitHub", link: "/tools/setting-up-your-addon-with-github" },
                    { text: "Combining KV Files Using #base", link: "/tools/combining-kv-files-using-base" },
                    { text: "Improving vConsole", link: "/tools/improvement-vConsole" },
                    { text: "GitHub Repos and Search", link: "/tools/github-repos-and-search" },
                ],
            },
            { text: "Contribute", link: "/contribute" },
        ],

        externalLinkIcon: true,
        outline: [2, 3],

        editLink: {
            pattern: "https://github.com/ModDota/moddota.github.io/edit/source/_articles/:path",
        },

        search: {
            provider: "local",
        },
    },

    vue: {
        template: {
            transformAssetUrls: {
                StaticVideo: ["path"],
            }
        }
    },

    vite: {
        publicDir: "../public",
    },

    sitemap: {
        hostname: "https://moddota.com/",
    },
});
