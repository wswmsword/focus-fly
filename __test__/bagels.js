import focusBagel from '../index.js';

export function initBagel(container, dialog, first, last, open, close) {

  return focusBagel(dialog, [first, last], {
    entry: {
      node: open,
    },
    exit: {
      node: close,
    }
  });
}

export function initBagel_1_1(container, dialog, first, last, open, close) {

  focusBagel(dialog, [first, last], {
    loop: false,
    entry: {
      node: open,
    },
    exit: {
      node: close,
    }
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
  const bagel = focusBagel(dialog, []); // no subItems
}

export function initBagel_8(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first]); // just head subItems, no tail subItems
}

export function initBagel_9(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    onEscape: true,
    entry: {
      node: open,
    },
    exit: {
      node: close,
    },
  });
}

export function initBagel_10(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    entry: {
      node: open,
    },
    exit: [{
      node: close,
    }, {
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
    exit: {
      node: close,
    },
    onEscape: true,
  });
}

export function initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  const bagel = focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    onEscape: true,
    entry: {
      node: open,
    },
    exit: {
      node: focusF,
    }
  });
}

export function initBagel_13(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  const bagel = focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    loop: false,
    entry: {
      node: open,
    },
    exit: {
      node: focusF,
    }
  });
}

export function initBagel_14(container, dialog, first, last, open, close) {

  focusBagel("#dialog", ["#firstFocusA", "#lastFocusBtn"], {
    entry: {
      node: "#open",
    },
    exit: {
      node: "#close",
    }
  });
}

export function initBagel_15(container, dialog, first, last, open, close) {

  focusBagel(dialog, [first, last], {
    entry: {
      node: open,
    },
    exit: {
      node: close,
    },
    cover: true,
  });
}

export function initBagel_16(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
      target: ({ list }) => list[1],
    },
    exit: {
      node: focusF,
    }
  });
}

export function initBagel_17(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
      target: "#focusB",
    },
    exit: {
      node: focusF,
    }
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
    exit: {
      node: focusF,
    }
  });
}

export function initBagel_19(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
    },
    exit: {
      node: focusF,
      type: "focus",
    }
  });
}

export function initBagel_20(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    sequence: true,
    entry: {
      node: open,
    },
    exit: {
      node: focusF,
    },
    correctionTarget: ({ list }) => list[3],
    removeListenersEachExit: false,
  });
}