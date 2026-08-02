import type { ThemeOptions } from "@mui/material/styles";

const lexiconThemeOptions: ThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#D96B18",
        },
        background: {
          default: "#F8F6F0",
          paper: "#FCFBF8",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#FF862F",
        },
        background: {
          default: "#161616",
          paper: "#22201F",
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Source Sans 3", "IBM Plex Sans", Arial, sans-serif',
  },
};

export default lexiconThemeOptions;
