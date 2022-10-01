import isInternalUrl from "@docusaurus/isInternalUrl";
import Link from "@docusaurus/Link";
import type { Sidebar, SidebarItem } from "@docusaurus/plugin-content-docs/lib/sidebars/types";
import classnames from "classnames";
import React, { useCallback, useContext, useState } from "react";

export const SidebarContext = React.createContext<Sidebar & { tutorials: any[] }>(null!);

export function TutorialList() {
    const sidebarItems = useContext(SidebarContext).tutorials;

    return (
        <div className="menu">
            <div className="menu__list">
                {sidebarItems.map((item) => (
                    <TutorialListItem key={item.label} item={item} />
                ))}
            </div>
        </div>
    );
}

function TutorialListItem({ item }: { item: SidebarItem }): JSX.Element {
    const [collapsed, setCollapsed] = useState(false);
    const handleItemClick = useCallback((e) => {
        e.preventDefault();
        e.target.blur();
        setCollapsed((state) => !state);
    }, []);

    switch (item.type) {
        case "category": {
            const { label, items } = item;
            if (items.length === 0) return <></>;

            return (
                <li key={label} className={classnames("menu__list-item", collapsed && "menu__list-item--collapsed")}>
                    <a className="menu__link menu__link--sublist" href="#!" onClick={handleItemClick}>
                        {label}
                    </a>
                    <ul className="menu__list">
                        {items.map((item, i) => (
                            <TutorialListItem key={i} item={item} />
                        ))}
                    </ul>
                </li>
            );
        }

        case "link": {
            const { label, href } = item;
            return (
                <li key={label} className="menu__list-item">
                    <Link
                        className={"menu__link"}
                        to={href}
                        {...(isInternalUrl(href)
                            ? { isNavLink: true, exact: true }
                            : { target: "_blank", rel: "noreferrer noopener" })}
                    >
                        {label}
                    </Link>
                </li>
            );
        }
        default: {
            throw `Unknown item type: ${item.type}`;
        }
    }
}
