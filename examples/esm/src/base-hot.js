import fFocus from "focus-fly";

fFocus(["#firstTabbableNode", "#lastTabbableNode"], {
  entry: "#entryBtn",
  exit: "#lastTabbableNode",
  onEscape: true,
  delayToFocus: true,
});