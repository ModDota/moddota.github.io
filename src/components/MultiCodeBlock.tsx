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

export function MultiCodeBlock({
    children,
    group,
    titles,
}: {
    children: React.ReactNode;
    group: string | undefined;
    titles: string | undefined;
}) {
    invariant(typeof group === "string" || group === undefined);

    const tabs = React.Children.toArray(children).map((element: any, index) => {
        const language = element.props.children.props.className?.replace(/language-/, "") ?? `Tab ${index + 1}`;
        const tabTitles = titles !== undefined && titles.length > 0 ? titles.split("|") : [];
        const languageName = tabTitles[index] ?? languageNames[language] ?? language;
        return { id: index, languageName, element };
    });

    return (
        <Tabs
            groupId={group !== undefined ? `multi-code-block-${group}` : undefined}
            defaultValue={tabs[0].id.toString()}
            values={tabs.map(({ id, languageName }) => ({ value: id.toString(), label: languageName }))}
        >
            {tabs.map(({ id, element }) => (
                <TabItem key={id} value={id.toString()}>
                    {element}
                </TabItem>
            ))}
        </Tabs>
    );
}
