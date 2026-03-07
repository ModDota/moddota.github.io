const { parse } = require("acorn");

module.exports = () => {
    /** @param {import("mdast").Root} root */
    function transform(root) {
        const imports = [
            'import Tabs from "@theme/Tabs";',
            'import TabItem from "@theme/TabItem";',
            'import { Gfycat } from "@site/src/components/Gfycat";',
            'import { YouTube } from "@site/src/components/YouTube";',
            'import { MultiCodeBlock } from "@site/src/components/MultiCodeBlock";',
            'import { StaticVideo } from "@site/src/components/StaticVideo";',
        ];

        for (const value of imports) {
            root.children.push({
                type: "mdxjsEsm",
                value,
                data: {
                    estree: parse(value, { ecmaVersion: 2020, sourceType: "module" }),
                },
            });
        }
    }

    return transform;
};
