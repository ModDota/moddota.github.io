import invariant from "tiny-invariant";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import React from "react";

type Language = keyof typeof languageNames;
const languageNames = {
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
};

export function MultiCodeBlock({ children, group }: { children: React.ReactNode; group: string | null }) {
    invariant(typeof group === "string" || group === null);

    const tabs = React.Children.toArray(children).map((element: any) => {
        const language = element.props.children.props.className.replace(/language-/, "");
        invariant(language in languageNames);
        return { language: language as Language, element };
    });

    return (
        <Tabs
            groupId={group !== null ? `multi-code-block-${group}` : undefined}
            defaultValue={tabs[0].language}
            values={tabs.map(({ language }) => ({ value: language, label: languageNames[language] }))}
        >
            {tabs.map(({ language, element }) => (
                <TabItem key={language} value={language}>
                    {element}
                </TabItem>
            ))}
        </Tabs>
    );
}
