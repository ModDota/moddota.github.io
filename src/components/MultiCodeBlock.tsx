import invariant from "tiny-invariant";
import TabItem from "@theme/TabItem";
import Tabs from "@theme/Tabs";
import React from "react";

const languageNames: Record<string, string | undefined> = {
    lua: "Lua",
    ts: "TypeScript",
    tsx: "TypeScript",
    js: "JavaScript",
    jsx: "JavaScript",
};

export function MultiCodeBlock({ children, group, titles }: { children: React.ReactNode; group: string | undefined; titles: string | undefined }) {
    invariant(typeof group === "string" || group === undefined);

    const tabs = React.Children.toArray(children).map((element: any, index) => {
        const language = element.props.children.props.className.replace(/language-/, "");
        const tabTitles = (titles !== undefined && titles.length > 0) ? titles.split("|") : [];
        const languageName = tabTitles[index] ?? languageNames[language] ?? language;
        return { language, languageName, element };
    });

    return (
        <Tabs
            groupId={group !== undefined ? `multi-code-block-${group}` : undefined}
            defaultValue={tabs[0].language}
            values={tabs.map(({ language, languageName }) => ({ value: language, label: languageName }))}
        >
            {tabs.map(({ language, element }) => (
                <TabItem key={language} value={language}>
                    {element}
                </TabItem>
            ))}
        </Tabs>
    );
}
