
const songs = ["#song_1", "#song_2", "#song_3", "#song_4", "#song_5", "#song_6", "#song_7"];

const playerBagel = focusBagel("#grid_wrapper", songs, {
  cover: {
    enterKey: e => (e.key === "Tab" && !e.shiftKey) || e.key === "ArrowDown" || e.key === "ArrowUp",
  },
  next: e => e.key === "ArrowDown",
  prev: e => e.key === "ArrowUp",
  exit: [{
    key: e => e.key === "Tab" && !e.shiftKey,
    target: "#more_from",
  }, {
    key: e => e.key === "Tab" && e.shiftKey,
  }],
  enter: [{
    node: "#more_from",
    key: e => e.key === "Tab" && e.shiftKey,
    type: "keydown",
    target: ({ last }) => last,
  }],
});