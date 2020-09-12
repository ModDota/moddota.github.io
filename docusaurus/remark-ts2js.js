// Based on https://github.com/trevorblades/remark-typescript/blob/dfa971ef34dcbd0777a31354487e9c848547a8ae/src/index.ts

const babel = require("@babel/core");
const assert = require("assert");
const prettier = require("prettier");
const visit = require("unist-util-visit");

const METASTRING_PATTERN = /\bts2js(?:=(\w+?))?\b/;

module.exports = () => {
    /** @param {import("mdast").Root} tree */
    return function transform(tree) {
        visit(tree, "code", (/** @type {import("mdast").Code} */ node, index, parent) => {
            if (!/^tsx?/.test(node.lang)) return;
            const match = node.meta?.match(METASTRING_PATTERN);
            if (!match) return;

            const { code } = babel.transformSync(node.value, {
                filename: `file.${node.lang}`,
                retainLines: true,
                presets: ["@babel/typescript"],
            });

            assert(node.value.trim() !== code.trim());

            /** @type {import("mdast").Code} */
            const jsCode = {
                type: "code",
                lang: node.lang.replace(/^ts/g, "js"),
                meta: node.meta,
                value: prettier
                    .format(code, {
                        parser: "babel",
                        tabWidth: 2,
                        printWidth: 120,
                        trailingComma: "all",
                        singleQuote: true,
                    })
                    .trim(),
            };

            parent.children = [...parent.children];
            parent.children.splice(index, 0, jsCode);
            if (match[1]) {
                parent.children.splice(index, 0, {
                    type: "jsx",
                    value: `<MultiCodeBlock group=${JSON.stringify(match[1])}>`,
                });
                parent.children.splice(index + 3, 0, { type: "jsx", value: "</MultiCodeBlock>" });
            }
        });
    };
};
