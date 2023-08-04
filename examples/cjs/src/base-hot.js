const fFocus = require("focus-fly");

fFocus(["#firstTabbableNode", "#lastTabbableNode"], {
  entry: "#entryBtn",
  exit: "#lastTabbableNode",
  onEscape: true,
  delayToFocus: true,
});