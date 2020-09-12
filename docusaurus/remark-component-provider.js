module.exports = () => {
    /** @param {import("mdast").Root} root */
    function transform(root) {
        root.children.push(
            { type: "import", value: 'import Tabs from "@theme/Tabs";' },
            { type: "import", value: 'import TabItem from "@theme/TabItem";' },
            { type: "import", value: 'import { Gfycat } from "@site/src/components/Gfycat";' },
            { type: "import", value: 'import { YouTube } from "@site/src/components/YouTube";' },
            { type: "import", value: 'import { MultiCodeBlock } from "@site/src/components/MultiCodeBlock";' },
        );
    }

    return transform;
};
