import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect, useRef } from "react";
import Keyboard from "react-simple-keyboard";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <KeyboardComponent></KeyboardComponent>
        <KeyLog></KeyLog>
        <KeyTrackerTest></KeyTrackerTest>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}

function KeyboardComponent() {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();

  const onChange = (input) => {
    setInput(input);
    console.log("Input changed", input);
  };

  const onChangeInput = (event) => {
    const input = event.target.value;
    console.log(input);
  };

  return (
    <div className="App">
      <input
        value={input}
        placeholder={"Tap on the virtual keyboard to start"}
        onChange={onChangeInput}
      />
      <Keyboard
        keyboardRef={(r) => (keyboard.current = r)}
        layoutName={layout}
        onChange={onChange}
        physicalKeyboardHighlight={true}
      />
    </div>
  );
}

function KeyLog() {
  const keyTracker = useKeyTracker();

  const items = keyTracker.events.map((e, i) => (
    <li key={i}>
      Type: {e.type}, Key: {e.key}, Repeated: {String(e.repeat)}
    </li>
  ));
  return (
    <ul>
      {items.slice(items.length >= 10 ? items.length - 10 : 0, items.length)}
    </ul>
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

function useKeyTracker(): KeyTracker {
  const [keyTracker, setKeyTracker] = useState<KeyTracker>({
    events: [],
    isPressed: new Set(),
    hasBeenPressed: new Set(),
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      console.log(e);
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
