
const songs = ["#song_1", "#song_2", "#song_3", "#song_4", "#song_5", "#song_6", "#song_7"];

let lastSong = null;

const playerBagel = focusBagel("#songs_wrapper", songs, {
  next: e => e.key === "ArrowDown",
  prev: e => e.key === "ArrowUp",
  exit: [{
    key: e => e.key === "Tab" && !e.shiftKey,
    target: "#more_from",
  }, {
    key: e => e.key === "Tab" && e.shiftKey,
    target: "#grid_wrapper",
  }],
  entry: {
    node: "#grid_wrapper",
    key: (e, active) => (e.key === "Tab" && !e.shiftKey && active > -1) || e.key === "ArrowDown" || e.key === "ArrowUp",
    type: "keydown",
  },
  onMove({ cur, prev, curI }) {
    prev?.classList.remove("focused");
    cur?.classList.add("focused");

    lastSong?.removeListeners();
    if (curI > -1) initSongBagel(curI);
  },
  correctionTarget({ lastI, last }) {
    if (lastI === -1)
      return "#grid_wrapper";
    return last;
  },
  removeListenersEachExit: false,
});

playerBagel.addForward("grid", {
  node: "#grid_wrapper",
  key: (e, active) => (e.key === "Tab" && !e.shiftKey && active === -1),
  target: "#more_from",
});

function initSongBagel(curI) {
  const idx = curI + 1;
  const list = [`#s${idx}_play`, `#s${idx}_a`, `#s${idx}_like`, `#s${idx}_more`];
  lastSong = focusBagel(`#song_${idx}`, list, {
    entry: {
      node: `#song_${idx}`,
      key: e => e.key === "ArrowRight" || e.key === "ArrowLeft",
      type: "keydown",
    },
    next: e => e.key === "ArrowRight",
    prev: e => e.key === "ArrowLeft",
    exit: {
      type: "outlist",
      target: false,
    },
    correctionTarget: false,
  });
}
