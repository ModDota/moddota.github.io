const visit = require("unist-util-visit");

module.exports = () => {
    /** @param {import("mdast").Root} tree */
    return function transform(tree) {
        visit(tree, "code", (/** @type {import("mdast").Code} */ node) => {
            node.value = node.value
                .replace(/(^|\n)\s*\/\/ @remove-next-line\n.+/g, "")
                .replace(/\s*\/\/ @remove-line:.+/g, "");
        });
    };
};
