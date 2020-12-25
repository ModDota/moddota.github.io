import "styled-components";
import { Theme } from "components/Themes";

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
