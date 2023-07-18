import focusNoJutsu from "focus-no-jutsu";

focusNoJutsu(["#firstTabbableNode", "#lastTabbableNode"], {
  entry: "#entryBtn",
  exit: "#lastTabbableNode",
  onEscape: true
});