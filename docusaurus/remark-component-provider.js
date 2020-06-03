module.exports = () => {
    /** @param {import("mdast").Root} root */
    function transform(root) {
        root.children.push(
            { type: "import", value: 'import { Gfycat } from "@site/src/components/Gfycat";' },
            { type: "import", value: 'import { YouTube } from "@site/src/components/YouTube";' },
        );
    }

    return transform;
};
