import { createContext } from "react";

// Based on https://www.happyhues.co/
interface Theme {
  background: string;
  headline: string;
  paragraph: string;
  button: string;
  button_text: string;
  stroke: string;
  chartBorder: string;
}

export const Themes: { [name: string]: Theme } = {
  "Port Gore": {
    background: "#232946",
    headline: "#fffffe",
    paragraph: "#b8c1ec",
    button: "#eebbc3",
    button_text: "#232946",
    stroke: "#121629",
    chartBorder: "#e53170",
  },
  Solitaire: {
    background: "#fef6e4",
    headline: "#001858",
    paragraph: "#f582ae",
    button: "#8bd3dd",
    button_text: "#001858",
    stroke: "#001858",
    chartBorder: "#e53170",
  },
  Cyprus: {
    background: "#004643",
    headline: "#fffffe",
    paragraph: "#abd1c6",
    button: "#f9bc60",
    button_text: "#001e1d",
    stroke: "#001e1d",
    chartBorder: "#e53170",
  },
  Pizazz: {
    background: "#0f0e17",
    headline: "#fffffe",
    paragraph: "#a7a9be",
    button: "#ff8906",
    button_text: "black",
    stroke: "black",
    chartBorder: "#e53170",
  },
};

export const DefaultThemeSelector = "Port Gore";
export const ThemeContext = createContext(Themes[DefaultThemeSelector]);
