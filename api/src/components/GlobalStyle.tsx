import { darken } from "polished";
import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    ::-webkit-scrollbar {
        width: 9px;

        &-track {
            margin: 2px;
            background: ${props => props.theme.scrollbar.track};
            border-radius: 4px;
        }

        &-thumb {
            background: ${props => props.theme.scrollbar.thumb};
            border-radius: 4px;

            &:hover {
                background: ${props => darken(0.09, props.theme.scrollbar.thumb)};
            }
        }
    }
`;
