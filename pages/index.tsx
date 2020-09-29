import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import Keyboard from "react-simple-keyboard";
import Chart from "../components/chart";
import { ThemeContext, Themes, DefaultThemeSelector } from "../util/theme";
import { KeyLog } from "../components/KeyLog";
import css from "styled-jsx/css";

export default function Home() {
  let [theme, setTheme] = useState(Themes["Port Gore"]);
  return (
    <ThemeContext.Provider value={theme}>
      <div
        className={styles.container}
        style={{ background: theme.background, color: theme.paragraph }}
      >
        <Head>
          <title>Switch Check</title>
          <link rel="icon" href="/working.png" />
        </Head>

        <ThemeChanger
          className={styles.themeChanger}
          onChange={(t) => setTheme(Themes[t])}
        />
        <main className={styles.main}>
          <h1 className={styles.title}>Switch Check</h1>
          <KeyboardComponent></KeyboardComponent>
          <div
            style={{
              display: "flex",
              width: "1000px",
            }}
          >
            <KeyLog></KeyLog>
            <Chart></Chart>
          </div>
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

function ThemeChanger({ onChange, className }) {
  let theme = useContext(ThemeContext);
  let [themeSelector, setThemeSelector] = useState(DefaultThemeSelector);
  let themeOptions = Object.keys(Themes)
    .sort()
    .map((t) => (
      <option
        value={t}
        key={t}
        style={{
          backgroundColor: Themes[t].background,
          borderColor: Themes[t].background,
          color: Themes[t].paragraph,
        }}
      >
        {t}
      </option>
    ));
  return (
    <select
      value={themeSelector}
      onChange={(e) => {
        setThemeSelector(e.target.value);
        onChange(e.target.value);
      }}
      className={className}
      style={{
        backgroundColor: theme.button,
        borderColor: theme.button,
        color: theme.button_text,
      }}
    >
      {themeOptions}
    </select>
  );
}

function KeyboardComponent() {
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();
  const theme = useContext(ThemeContext);
  let pressedKeysArr = [];

  // TODO: handleShift and Caps Lock via physical keyboard. The following only handles digital keyboard
  const handleShift = () => {
    setLayout(layout === "default" ? "shift" : "default");
  };

  const onKeyPress = (button) => {
    console.log("Button pressed", button);
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") handleShift();
  };

  const keyTracker = useKeyTracker();
  let currentlyPressedKeys = Array.from(keyTracker.isPressed).join(" ");
  keyTracker.hasBeenPressed.forEach((key) => {
    if (!keyTracker.isPressed.has(key)) {
      pressedKeysArr.push(key);
    }
  });
  let pressedKeysStr = pressedKeysArr.join(" ");


  const pressedResolve = css.resolve`
    div {
      background: ${theme.paragraph} !important;
      color: ${theme.button_text};
      font-weight: 900;
    }
  `;
  const currentlyPressedResolve = css.resolve`
    div {
      background: ${theme.button} !important;
      color: ${theme.button_text};
      font-weight: 900;
    }
  `;

 
    //! Still having issues with the keyboard theme
  const keyboardTheme = css.resolve`
    div {
      background: ${theme.headline} !important;
      color: ${theme.button_text};
      font-weight: 500;
    }
  `
    console.log(keyboardTheme)
  return (
    <div>
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        layoutName={layout}
        theme={`hg-theme-default ${keyboardTheme.className}` }
        // theme={theme.name === "portGore" ? `hg-theme-default ${styles.portGore}` : `${styles.solitare} hg-theme-default`}
        onKeyPress={(button) => onKeyPress(button)}
        layout={{
          default: [
            "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
            "{tab} q w e r t y u i o p [ ] \\",
            "{lock} a s d f g h j k l ; ' {enter}",
            "{shift} z x c v b n m , . / {shift}",
            ".com @ {space}",
          ],
          shift: [
            "~ ! @ # $ % ^ & * ( ) _ + {bksp}",
            "{tab} Q W E R T Y U I O P { } |",
            '{lock} A S D F G H J K L : " {enter}',
            "{shift} Z X C V B N M < > ? {shift}",
            ".com @ {space}",
          ],
        }}
        buttonTheme={[
          {
            class: pressedResolve.className,
            buttons: pressedKeysStr ? pressedKeysStr : "empty",
            // Placeholder value needed, otherwise ESLINT error
          },
          {
            class: currentlyPressedResolve.className,
            buttons: currentlyPressedKeys ? currentlyPressedKeys : "empty",
            // Placeholder value needed, otherwise ESLINT error
          },
        ]}
      ></Keyboard>
      {keyboardTheme.styles}
      {pressedResolve.styles}
      {currentlyPressedResolve.styles}
    </div>
  );
}

function KeyTrackerTest() {
  const keyTracker = useKeyTracker();

  const held = [];
  keyTracker.isPressed.forEach((k) => held.push(<li key={k}>{k}</li>));

  const hasBeenPressed = [];
  keyTracker.hasBeenPressed.forEach((k) =>
    hasBeenPressed.push(<li key={k}>{k}</li>)
  );

  return (
    <div>
      <h2>Currently held:</h2>
      <ul>{held}</ul>
      <h2>Have been pressed:</h2>
      <ul>{hasBeenPressed}</ul>
    </div>
  );
}

interface KeyTracker {
  events: KeyboardEvent[];
  isPressed: Set<string>;
  hasBeenPressed: Set<string>;
}

export function useKeyTracker(): KeyTracker {
  const [keyTracker, setKeyTracker] = useState<KeyTracker>({
    events: [],
    isPressed: new Set(),
    hasBeenPressed: new Set(),
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeyTracker(({ events, isPressed, hasBeenPressed }) => {
        const newIsPressed = new Set([...isPressed]);
        if (e.type == "keydown") {
          newIsPressed.add(e.key);
        } else {
          newIsPressed.delete(e.key);
        }
        const newHasBeenPressed = new Set([...hasBeenPressed, e.key]);

        return {
          events: [...events, e],
          isPressed: newIsPressed,
          hasBeenPressed: newHasBeenPressed,
        };
      });
    };

    window.addEventListener("keydown", handler);
    window.addEventListener("keyup", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("keyup", handler);
    };
  }, []);

  return keyTracker;
}
