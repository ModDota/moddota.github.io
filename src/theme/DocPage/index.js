import renderRoutes from "@docusaurus/renderRoutes";
import { matchPath } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import { MDXProvider } from "@mdx-js/react";
import { SidebarContext } from "@site/src/components/TutorialList";
import DocItem from "@theme/DocItem";
import DocSidebar from "@theme/DocSidebar";
import Layout from "@theme/Layout";
import MDXComponents from "@theme/MDXComponents";
import NotFound from "@theme/NotFound";
import React from "react";
import styles from "./styles.module.css";

function DocPage(props) {
    const { route: baseRoute, docsMetadata, location, content } = props;
    const { permalinkToSidebar, docsSidebars, version, isHomePage, homePagePath } = docsMetadata;

    // Get case-sensitive route such as it is defined in the sidebar.
    const currentRoute = !isHomePage
        ? baseRoute.routes.find((route) => {
              return matchPath(location.pathname, route);
          }) || {}
        : {};

    const sidebar = isHomePage ? content.metadata.sidebar : permalinkToSidebar[currentRoute.path];
    const { siteConfig: { themeConfig: { sidebarCollapsible = true } = {} } = {}, isClient } = useDocusaurusContext();

    if (!isHomePage && Object.keys(currentRoute).length === 0) {
        return <NotFound {...props} />;
    }

    return (
        <Layout version={version} key={isClient}>
            <div className={styles.docPage}>
                {sidebar && (
                    <div className={styles.docSidebarContainer}>
                        <DocSidebar
                            docsSidebars={docsSidebars}
                            path={isHomePage ? homePagePath : currentRoute.path}
                            sidebar={sidebar}
                            sidebarCollapsible={sidebarCollapsible}
                        />
                    </div>
                )}
                <main className={styles.docMainContainer}>
                    <SidebarContext.Provider value={docsSidebars}>
                        <MDXProvider components={MDXComponents}>
                            {isHomePage ? <DocItem content={content} /> : renderRoutes(baseRoute.routes)}
                        </MDXProvider>
                    </SidebarContext.Provider>
                </main>
            </div>
        </Layout>
    );
}

export default DocPage;
