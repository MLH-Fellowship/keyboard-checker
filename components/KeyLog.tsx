import { useKeyTracker } from "../pages/index";
export function KeyLog() {
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
