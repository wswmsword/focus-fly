
const dialog = document.getElementById("dialog");
const mask = document.getElementById("dialog_mask");
const entry = document.getElementById("open");

const bagel = focusBagel(dialog, ["#firstFocusBtn", "#close"], {
  loop: false,
  entry: {
    node: entry,
    on: openDialog,
  },
  exit: {
    node: ["#close", "#firstFocusBtn", "#confirm"],
    on: closeDialog,
    type: ["click", "outlist"]
  },
  onEscape: true,
});

function openDialog() {
  dialog.classList.add("openedDialog");
  dialog.classList.remove("closedDialog");
  dialog_mask.classList.remove("closed_mask");
  entry.ariaExpanded = true;
}

function closeDialog() {
  dialog.classList.remove("openedDialog");
  dialog.classList.add("closedDialog");
  dialog_mask.classList.add("closed_mask");
  entry.ariaExpanded = false;
}