const dialog3 = document.getElementById("dialog_3");
const first3 = document.getElementById("firstFocusA_3");
const last3 = document.getElementById("lastFocusBtn_3");
const open3 = document.getElementById("open_3");
const close3 = document.getElementById("close_3");

const bagel_3 = focusBagel(dialog3, [first3, last3], {
  entry: {
    node: open3,
    on() {
      dialog3.style.display = "block";
    },
  },
  exit: {
    node: close3,
    on() {
      dialog3.style.display = "none";
    },
  },
});