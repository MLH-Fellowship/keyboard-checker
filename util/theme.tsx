import { createContext } from "react";

// Based on https://www.happyhues.co/
interface Theme {
  name: string
  background: string;
  headline: string;
  paragraph: string;
  button: string;
  button_text: string;
  stroke: string;
}

export const Themes: { [name: string]: Theme } = {
  "Port Gore": {
    name: "portGore",
    background: "#232946",
    headline: "#fffffe",
    paragraph: "#b8c1ec",
    button: "#eebbc3",
    button_text: "#232946",
    stroke: "#121629",
  },
  Solitaire: {
    name: "solitare",
    background: "#fef6e4",
    headline: "#001858",
    paragraph: "#172c66",
    button: "#f582ae",
    button_text: "#001858",
    stroke: "#001858",
  },
};

export const DefaultThemeSelector = "Port Gore";
export const ThemeContext = createContext(Themes[DefaultThemeSelector]);
