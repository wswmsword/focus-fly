import focusBagel from '../index.js';

export function initBagel(container, dialog, first, last, open, close) {

  return focusBagel(dialog, [first, last], {
    entry: open,
    exit: close,
  });
}

export function initBagel_1_1(container, dialog, first, last, open, close) {

  focusBagel(dialog, [first, last], {
    loop: false,
    entry: open,
    exit: close,
  });
}

export function initBagel_1_2(container, dialog, first, last, open, close) {

  return focusBagel(dialog, [first, last], {
    entry: open,
    exit: close,
    delayToFocus: true,
  });
}

export function initBagel_2(container, dialog, first, last, open, close) {

  return focusBagel(dialog, [first, last], { entry: { type: "invoke" } });
}

export function initBagel_3(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], { exit: { type: "invoke" }, trigger: open });

  close.addEventListener("click", function() {
    bagel.exit();
  });

  return bagel
}

export function initBagel_4(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], { sequence: false, entry: { type: "invoke" }, exit: { type: "invoke" }, trigger: open });

  open.addEventListener('click', () => bagel.enter());
  close.addEventListener('click', () => bagel.exit());

  return bagel;
}

export function initBagel_4_1(container, dialog, first, last, open, close) {
  return focusBagel(dialog, [first, last], { sequence: true, entry: { node: open }, exit: { node: close } });
}

export function initBagel_5(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last]);

  open.addEventListener('click', () => {
    first.focus(); // there's no trigger mark, e.g. bagel.enter(), opt.trigger, opt.entry.selector
  })
  close.addEventListener("click", function() {
    bagel.exit(); // this will console warn
  });

  return bagel
}

export function initBagel_6(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    exit: {
      node: close,
      on: () => {}
    }
  });

  open.addEventListener('click', () => {
    first.focus(); // there's no trigger mark, e.g. bagel.enter(), opt.trigger, opt.entry.selector
  })

  return bagel
}

export function initBagel_7(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog); // no subItems
}

export function initBagel_8(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first]); // just head subItems, no tail subItems
}

export function initBagel_9(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    onEscape: true,
    entry: open,
    exit: close,
  });
}

export function initBagel_10(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    entry: open,
    exit: [close, {
      key: e => e.key === "Escape",
    }],
    onEscape: false,
  });
}

export function initBagel_11(container, dialog, first, last, open, close) {
  open.addEventListener("click", function() {
    first.focus();
  });
  const bagel = focusBagel(dialog, [first, last], {
    exit: close,
    onEscape: true,
  });
}

export function initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  return focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    onEscape: true,
    entry: open,
    exit: focusF,
  });
}

export function initBagel_13(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  const bagel = focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    loop: false,
    entry: open,
    exit: {
      node: focusF,
    }
  });
}

export function initBagel_13_1(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  const bagel = focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "j",
    prev: "k",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_14(container, dialog, first, last, open, close) {

  focusBagel("#dialog", ["#firstFocusA", "#lastFocusBtn"], {
    entry: "#open",
    exit: "#close",
  });
}

export function initBagel_15(container, dialog, first, last, open, close) {

  focusBagel(dialog, [first, last], {
    entry: open,
    exit: close,
    cover: true,
  });
}

export function initBagel_15_1(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {

  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: close,
    cover: true,
    onEscape: true,
  });
}

export function initBagel_16(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
      target: ({ list }) => list[1],
    },
    exit: focusF,
  });
}

export function initBagel_16_1(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
      target: () => null,
    },
    exit: focusF,
  });
}

export function initBagel_17(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
      target: "#focusB",
    },
    exit: focusF,
  });
}

export function initBagel_18(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
      type: "keydown",
      key: e => e.key === "Space",
    },
    exit: focusF,
  });
}

export function initBagel_19(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: {
      node: focusF,
      type: "focus",
    }
  });
}

export function initBagel_20(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: focusF,
    correctionTarget: ({ list }) => list[3],
    removeListenersEachExit: false,
  });
}

export function initBagel_20_1(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: focusF,
    onEscape: true,
    removeListenersEachExit: false,
  });
}

export function initBagel_20_2(dialog, open, focusA, focusG) {
  focusBagel(dialog, [focusA, focusG], {
    entry: open,
    exit: focusG,
    onEscape: true,
    removeListenersEachExit: false,
  });
}

export function initBagel_20_3(dialog, open, focusA, focusG) {
  focusBagel(dialog, [focusA, focusG], {
    entry: open,
    exit: focusG,
    onEscape: true,
    removeListenersEachExit: false,
    onMove({ cur, prev }) {
      cur?.classList.add("selected");
      prev?.classList.remove("selected");
    },
  });
}

export function initBagel_21(container, dialog, first, last, open, close, walk2) {
  return focusBagel(dialog, [first, last], {
    entry: open,
    exit: walk2,
  });
}

export function initBagel_22(container, dialog, first, last, open, close) {
  return focusBagel(dialog, [first, last], {
    manual: true,
    entry: open,
    exit: close
  });
}

export function initBagel_23(dialog, open, focusA, focusB, focusC) {
  return focusBagel(dialog, [focusA, focusB, focusC], {
    sequence: true,
    entry: open,
    exit: focusC,
  });
}

export function initBagel_24(container, dialog, first, last, open, close) {
  return focusBagel(dialog, [first, last], {
    entry: open,
    exit: {
      node: close,
      target: false,
    }
  });
}

export function initBagel_25(container, dialog, first, last, open, close, walk2) {
  return focusBagel(dialog, [first, last], {
    entry: {
      node: open,
    },
    exit: {
      node: walk2,
      type: "focus",
    }
  });
}

export function initBagel_26(container, dialog, first, last, open, close) {
  return focusBagel(dialog, [first, last], {
    entry: open,
    exit: {
      type: "outlist",
    }
  });
}

export function initBagel_27(container, dialog, first, last, open, close) {
  return focusBagel(dialog, [first, last], {
    entry: open,
    exit: close,
    delayToFocus() {
      return new Promise(resolve => setTimeout(resolve, 100));
    }
  });
}

export function initBagel_28(container, dialog, first, last, open, close, walk1) {

  return focusBagel(dialog, [first, last], {
    entry: { node: [open, walk1] },
    exit: close,
    // removeListenersEachExit: false,
  });
}

export function initBagel_28_1(container, dialog, first, last, open, close, walk1) {

  return focusBagel(dialog, [first, last], {
    entry: { node: open, key: "c" },
    exit: { key: "Control-c" },
  });
}

export function initBagel_28_2(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "Control-n",
    prev: "Control-p",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_29(container, dialog, first, last, open, close) {

  focusBagel(dialog, [first, last], {
    entry: {
      node: open,
    },
    exit: {
      node: close,
    },
    onEscape: true,
    cover: {
      exit: {
        key: e => e.key === 'c',
      }
    }
  });
}

export function initBagel_30(container, dialog, first, last, open, close, walk2) {

  focusBagel(dialog, [first, last], {
    entry: {
      node: open,
    },
    exit: {
      node: close,
    },
    onEscape: true,
    cover: {
      node: walk2,
      exit: {
        key: e => e.key === 'c',
      }
    }
  });
}

export function initBagel_31(container, dialog, first, last, open, close) {
  focusBagel(dialog, [first, last], {
    entry: open,
    exit: close,
    cover: {
      exit: e => e.key === 'e',
    },
    onEscape: true,
  });
}

export function initBagel_32(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: focusG,
    onMove({ cur, prev }) {
      cur?.classList.add("selected");
      prev?.classList.remove("selected");
    },
  });
}

export function initBagel_33(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: focusG,
    onMove({ cur, prev }) {
      cur?.classList.add("selected");
      prev?.classList.remove("selected");
    },
    correctionTarget({ list }) {
      return list[3];
    },
  });
}

export function initBagel_34(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: [focusG, {
      type: "outlist"
    }],
    onMove({ cur, prev }) {
      cur?.classList.add("selected");
      prev?.classList.remove("selected");
    },
    removeListenersEachExit: false,
  });
}

export function initBagel_35(container, dialog, first, last, open, close) {

  return focusBagel(dialog, [first, last], {
    entry: {
      node: open,
      onExit: true,
      on() {
        open.classList.toggle("opened");
      },
    },
    exit: close,
    // removeListenersEachExit: false,
  });
}

export function initBagel_36(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  return focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: ({ tail }) => tail,
  });
}

export function initBagel_37(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2) {
  return focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: {
      node: focusG,
      key: (e) => e.key === "Tab" && !e.shiftKey,
      type: "keydown",
      target: walk2,
    },
  });
}

export function initBagel_38(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2) {
  dialog.addEventListener("click", function() {
    walk2.focus();
  });
  return focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: {
      node: focusG,
      stopPropagation: true,
    },
  });
}

export function initBagel_39(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  return focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: open,
    exit: {
      node: focusG,
      target: dialog,
    },
  });
}

export function initBagel_40(dialog, open, focusA, focusB, focusC) {
  return focusBagel(dialog, [focusA, focusB, focusC], {
    sequence: true,
    entry: open,
    exit: ({ tail }) => tail,
  });
}

export function initBagel_41(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "j",
    prev: "k",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_42(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "f-j",
    prev: "f-k",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_43(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "Shift-j",
    prev: "Shift-k",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_44(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "Meta-j",
    prev: "Meta-k",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_45(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "Alt-j",
    prev: "Alt-k",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_46(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "Control-n",
    prev: "Control-Shift-n",
    entry: open,
    exit: focusF,
  });
}

export function initBagel_47(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    next: "ArrowRight",
    prev: "ArrowLeft",
    entry: open,
    exit: focusF,
  });
}