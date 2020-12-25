export const themeOriginal = {
  background:      "#4d5658",
  highlight:       "#455a64",
  text:            "#ffffff",
  textDim:         "#b0bec5",

  authorEpitaph:   "#89a62e",
   
  navbar:          "#607d8b",
  navbarLinkShadow:"#000000c0",
  navbarShadow:    "transparent",
  sidebar:         "#607d8b",
  group:           "#050f14",
  groupMembers:    "#455a64",
  groupHighlight:  "#455a64",
  groupShadow:     "none",
  groupSeparator:  "#000000",
  groupBorder:     "#000000",

  syntax: {
      literal:   "#74f2ca",
      interface: "#74f2ca",
      parameter: "#adebff",
      nil:       "#ead0ff",
  },

  scrollbar: {
    track: "#464e50",
    thumb: "#7a888b",
  },

  searchbox: {
    background:         "#546e7a",
    placeholder:        "#cccccc",
    border:             "1px solid #000000",
    button:             "#2196f3",
    buttonFill:         "#000000",
    buttonFillUpdated:  "#000000",
  },
};

export const themeModdotaLight = {
  ...themeOriginal,

  authorEpitaph:   "#89a62e",

  background:      "#ffffff",
  highlight:       "#89a62e",
  text:            "#101010",
  textDim:         "#606060",
   
  navbar:          "#ffffff",
  navbarLinkShadow:"transparent",
  navbarShadow:    "#00000030",
  sidebar:         "#ebedf0",
  group:           "#ffffff",
  groupMembers:    "#f8f8fa",
  groupHighlight:  "#f0f0f0",
  groupShadow:     "#00000030",
  groupSeparator:  "#cccccc",
  groupBorder:     "#cccccc",

  syntax: {
    literal:   "#116e51",
    interface: "#116e51",
    parameter: "#0b5872",
    nil:       "#752a7e",
  },

  scrollbar: {
    track: "#ebedf0",
    thumb: "#cfd4db",
  },

  searchbox: {
    background:         "#ebedf0",
    placeholder:        "#888888",
    border:             "none",
    button:             "transparent",
    buttonFill:         "#888888",
    buttonFillUpdated:  "#000000",
  },
};

export const themeModdotaDark = {
  ...themeOriginal,

  authorEpitaph:   "#89a62e",

  background:      "#101010",
  highlight:       "#89a62e",
  text:            "#d0d0d0",
  textDim:         "#808080",
  
  navbar:          "#202020",
  navbarLinkShadow:"transparent",
  navbarShadow:    "#00000030",
  sidebar:         "#202020",
  group:           "#202020",
  groupMembers:    "#303030",
  groupHighlight:  "#282828",
  groupShadow:     "#00000030",
  groupSeparator:  "#303030",
  groupBorder:     "#303030",

  syntax: {
      literal:   "#74f2ca",
      interface: "#74f2ca",
      parameter: "#adebff",
      nil:       "#ead0ff",
  },

  scrollbar: {
    track: "#202020",
    thumb: "#505050",
  },

  searchbox: {
    background:         "#404040",
    placeholder:        "#888888",
    border:             "none",
    button:             "transparent",
    buttonFill:         "#888888",
    buttonFillUpdated:  "#000000",
  },
};

export type Theme = typeof themeOriginal;
