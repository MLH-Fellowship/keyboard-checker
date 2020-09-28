import { useKeyTracker } from "../pages/index";
import { useContext, CSSProperties } from "react";
import { ThemeContext } from "../util/theme";

const maxItems = 5;

export function KeyLog() {
  const keyTracker = useKeyTracker();
  const theme = useContext(ThemeContext);

  const items = [];
  let i = keyTracker.events.length - 1;
  while (items.length < maxItems && i >= 0) {
    let { key, type, repeat } = keyTracker.events[i];
    i--;
    let count = 1;
    let pressed = type == "keydown";
    let held = repeat;
    while (i >= 0) {
      let e = keyTracker.events[i];
      if (e.key != key || e.type != "keydown") break;
      if (!e.repeat && e.type == "keydown") pressed = true;
      if (e.repeat) held = true;
      count += 1;
      i--;
    }
    items.push(
      <KeyLogItem
        key={i}
        keyStr={key}
        pressed={pressed}
        held={held}
        released={type == "keyup"}
        count={count}
        maxBlips={62}
      />
    );
  }

  return <div style={{ width: "100%" }}>{items}</div>;
}

function KeyLogItem({ keyStr, pressed, held, released, count, maxBlips }) {
  const theme = useContext(ThemeContext);
  const activeSpanStyle: CSSProperties = {
    borderRadius: "3px",
    margin: "1px",
    padding: "1px 3px",
    width: "50px",
    textAlign: "center",
    fontSize: "10px",
    backgroundColor: theme.button,
    color: theme.button_text,
    filter: "opacity(0.8)",
  };
  const inactiveSpanStyle: CSSProperties = {
    ...activeSpanStyle,
    filter: "opacity(0.3)",
  };

  const blips = [];
  for (let i = 0; i < maxBlips; i++) {
    if (i < count) {
      blips.push(
        <div
          key={i}
          style={{
            width: "12px",
            height: "12px",
            margin: "1px",
            backgroundColor: theme.paragraph,
          }}
        ></div>
      );
    }
  }

  return (
    <div
      style={{
        border: "3px solid",
        borderColor: theme.stroke,
        borderRadius: "5px",
        boxShadow: "1px 2px " + theme.stroke,
        margin: "5px",
        padding: "5px 0px",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: "30px",
          padding: "5px 15px",
          minWidth: "57px",
          textAlign: "center",
          color: theme.headline,
        }}
      >
        {keyStr}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span style={pressed ? activeSpanStyle : inactiveSpanStyle}>
          pressed
        </span>
        <span style={held ? activeSpanStyle : inactiveSpanStyle}>held</span>
        <span style={released ? activeSpanStyle : inactiveSpanStyle}>
          released
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "column wrap",
          height: "28px",
          margin: "5px",
        }}
      >
        {blips}
      </div>
    </div>
  );
}
