import Head from "@docusaurus/Head";
import isInternalUrl from "@docusaurus/isInternalUrl";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import DocPaginator from "@theme/DocPaginator";
import useTOCHighlight from "@theme/hooks/useTOCHighlight";
import classnames from "classnames";
import React from "react";
import styles from "./styles.module.css";

const LINK_CLASS_NAME = "table-of-contents__link";
const ACTIVE_LINK_CLASS_NAME = "table-of-contents__link--active";
const TOP_OFFSET = 100;

function DocTOC({ headings }) {
    useTOCHighlight(LINK_CLASS_NAME, ACTIVE_LINK_CLASS_NAME, TOP_OFFSET);
    return (
        <div className="col col--3">
            <div className={styles.tableOfContents}>
                <Headings headings={headings} />
            </div>
        </div>
    );
}

function Headings({ headings, isChild }) {
    if (!headings.length) {
        return null;
    }
    return (
        <ul className={isChild ? "" : "table-of-contents table-of-contents__left-border"}>
            {headings.map((heading) => (
                <li key={heading.id}>
                    <a
                        href={`#${heading.id}`}
                        className={LINK_CLASS_NAME}
                        dangerouslySetInnerHTML={{ __html: heading.value }}
                    />
                    <Headings isChild headings={heading.children} />
                </li>
            ))}
        </ul>
    );
}

function DocMetadata({ content: DocContent }) {
    const {
        metadata: { editUrl, lastUpdatedAt, lastUpdatedBy },
        frontMatter: { author: createdBy, steamId: createdBySteamId, date: createdAtRaw },
    } = DocContent;

    if (!(editUrl || lastUpdatedAt || lastUpdatedBy || createdBy || createdAtRaw)) return null;

    let createdAt;
    if (createdAtRaw) {
        const [day, month, year] = createdAtRaw.split(".");
        createdAt = new Date(year, month - 1, day);
    }

    return (
        <div style={{ marginTop: "-10px", marginBottom: "10px" }}>
            <div className="row">
                <div className="col">
                    {editUrl && (
                        <a href={editUrl} target="_blank" rel="noreferrer noopener">
                            <svg
                                fill="currentColor"
                                height="1.2em"
                                width="1.2em"
                                preserveAspectRatio="xMidYMid meet"
                                viewBox="0 0 40 40"
                                style={{
                                    marginRight: "0.3em",
                                    verticalAlign: "sub",
                                }}
                            >
                                <g>
                                    <path d="m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z" />
                                </g>
                            </svg>
                            Edit this page
                        </a>
                    )}
                </div>
                {(lastUpdatedAt || lastUpdatedBy || createdBy || createdAt) && (
                    <div className="col text--right">
                        {(createdBy || createdAt) && (
                            <em>
                                <small>
                                    Created{" "}
                                    {createdAt && (
                                        <>
                                            on{" "}
                                            <time
                                                dateTime={createdAt.toISOString()}
                                                className={styles.docLastUpdatedAt}
                                            >
                                                {createdAt.toLocaleDateString()}
                                            </time>
                                            {createdBy && " "}
                                        </>
                                    )}
                                    {createdBy && (
                                        <>
                                            by{" "}
                                            <strong>
                                                {createdBySteamId ? (
                                                    <a href={`https://steamcommunity.com/profiles/${createdBySteamId}`}>
                                                        {createdBy}
                                                    </a>
                                                ) : (
                                                    <>{createdBy}</>
                                                )}
                                            </strong>
                                        </>
                                    )}
                                </small>
                            </em>
                        )}
                        {(createdBy || createdAt) && (lastUpdatedAt || lastUpdatedBy) && <br />}
                        {(lastUpdatedAt || lastUpdatedBy) && (
                            <em>
                                <small>
                                    Last updated{" "}
                                    {lastUpdatedAt && (
                                        <>
                                            on{" "}
                                            <time
                                                dateTime={new Date(lastUpdatedAt * 1000).toISOString()}
                                                className={styles.docLastUpdatedAt}
                                            >
                                                {new Date(lastUpdatedAt * 1000).toLocaleDateString()}
                                            </time>
                                            {lastUpdatedBy && " "}
                                        </>
                                    )}
                                    {lastUpdatedBy && (
                                        <>
                                            by <strong>{lastUpdatedBy}</strong>
                                        </>
                                    )}
                                    {process.env.NODE_ENV === "development" && (
                                        <div>
                                            <small> (Simulated during dev for better perf)</small>
                                        </div>
                                    )}
                                </small>
                            </em>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function DocItem(props) {
    const { siteConfig = {} } = useDocusaurusContext();
    const { url: siteUrl, title: siteTitle } = siteConfig;
    const { content: DocContent } = props;
    const { metadata } = DocContent;
    const { description, title, permalink, version } = metadata;
    const {
        frontMatter: { image: metaImage, keywords, hide_title: hideTitle, hide_table_of_contents: hideTableOfContents },
    } = DocContent;

    const metaTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    let metaImageUrl = siteUrl + useBaseUrl(metaImage);
    if (!isInternalUrl(metaImage)) {
        metaImageUrl = metaImage;
    }

    return (
        <>
            <Head>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                {description && <meta name="description" content={description} />}
                {description && <meta property="og:description" content={description} />}
                {keywords && keywords.length && <meta name="keywords" content={keywords.join(",")} />}
                {metaImage && <meta property="og:image" content={metaImageUrl} />}
                {metaImage && <meta property="twitter:image" content={metaImageUrl} />}
                {metaImage && <meta name="twitter:image:alt" content={`Image for ${title}`} />}
                {permalink && <meta property="og:url" content={siteUrl + permalink} />}
                {permalink && <link rel="canonical" href={siteUrl + permalink} />}
            </Head>
            <div className={classnames("container padding-vert--lg", styles.docItemWrapper)}>
                <div className="row">
                    <div
                        className={classnames("col", {
                            [styles.docItemCol]: !hideTableOfContents,
                        })}
                    >
                        <div className={styles.docItemContainer}>
                            <article>
                                {version && (
                                    <div>
                                        <span className="badge badge--secondary">Version: {version}</span>
                                    </div>
                                )}
                                <DocMetadata content={DocContent} />
                                {!hideTitle && (
                                    <header>
                                        <h1 className={styles.docTitle}>{title}</h1>
                                    </header>
                                )}
                                <div className="markdown">
                                    <DocContent />
                                </div>
                            </article>
                            <div className="margin-vert--lg">
                                <DocPaginator metadata={metadata} />
                            </div>
                        </div>
                    </div>
                    {!hideTableOfContents && DocContent.rightToc && <DocTOC headings={DocContent.rightToc} />}
                </div>
            </div>
        </>
    );
}

export default DocItem;
