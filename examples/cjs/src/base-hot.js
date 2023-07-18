const focusNoJutsu = require("focus-no-jutsu");

focusNoJutsu(["#firstTabbableNode", "#lastTabbableNode"], {
  entry: "#entryBtn",
  exit: "#lastTabbableNode",
  onEscape: true
});