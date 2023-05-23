// query utilities:
import {
  getByText,
  getByTestId,
  queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  waitFor,
} from '@testing-library/dom';
// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom';
import focusBagel from '../index.js';
import userEvent from '@testing-library/user-event';
import render from './helper/render.js';
const user = userEvent.setup();
import modalHtml from './template-html/modal.js';
import manualModalHtml from './template-html/manual-modal.js';
import inputModalHtml from './template-html/input-modal.js';

describe("focus-bagel", function() {
  it("should focus first focusable node of modal after click trigger", async () => {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
  
    await open.click();
    expect(first).toHaveFocus();
  });

  it("should focus back to trigger after click close button", async () => {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
  
    await close.click();
    expect(open).toHaveFocus();
  });

  it("should focus first focusable node of modal that is visible and sibling with trigger after press tab", async () => {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
  
    expect(document.body).toHaveFocus();
    await user.tab(); // issue: https://github.com/testing-library/user-event/issues/1018
    expect(open).toHaveFocus();
    await user.tab();
    expect(container.querySelector("#walk1")).toHaveFocus();
    await user.tab();
    expect(dialog).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
  });

  it("should loop focus forward", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
  
    await open.click();
    expect(first).toHaveFocus();
    await user.tab();
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
    await user.tab();
    expect(getByText(container, "樱花软糖")).toHaveFocus();
    await user.tab();
    expect(getByText(container, "大白兔奶糖")).toHaveFocus();
    await user.tab();
    expect(getByText(container, "夹心巧克力")).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
  });

  it("should loop focus backward", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
    const s = { shift: true };
    await open.click();
    expect(first).toHaveFocus();
    await user.tab(s);
    expect(last).toHaveFocus();
    await user.tab(s);
    expect(close).toHaveFocus();
    await user.tab(s);
    expect(getByText(container, "夹心巧克力")).toHaveFocus();
    await user.tab(s);
    expect(getByText(container, "大白兔奶糖")).toHaveFocus();
    await user.tab(s);
    expect(getByText(container, "樱花软糖")).toHaveFocus();
    await user.tab(s);
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
    await user.tab(s);
    expect(first).toHaveFocus();
  });

  it("should enter by return api", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    const bagel = initBagel_2(container, dialog, first, last, open, close);
    expect(document.body).toHaveFocus();
    await bagel.enter(); // maybe setTimeout 300ms
    expect(first).toHaveFocus();
  });

  it("should exit by return api", function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    const bagel = initBagel_3(container, dialog, first, last, open, close);
    waitFor(function() {
      bagel.enter();
      close.click();
      expect(open).toHaveFocus();
    })
  });

  it("should not change activeIndex when disable manual option", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    const bagel = initBagel_4(container, dialog, first, last, open, close);

    const i1 = bagel.i();
    expect(i1).toBe(-1);
    await user.tab();
    const i2 = bagel.i();
    expect(i2).toBe(-1);
    await open.click();
    expect(first).toHaveFocus();
    const i3 = bagel.i();
    expect(i3).toBe(0);
    await user.tab();
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
    expect(i3).toBe(0);
  });

  // // TODO: should change activeIndex when enable manual option

  it("should not focus trigger when invoke returned exit if no trigger", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel_5(container, dialog, first, last, open, close);

    await open.click();
    expect(first).toHaveFocus();
    await close.click();
    expect(first).toHaveFocus()
  });

  it("should not focus trigger when pass opts.exit without trigger", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel_6(container, dialog, first, last, open, close);

    open.click();
    expect(first).toHaveFocus();
    close.click();
    waitFor(() => {
      expect(close).toHaveFocus();
    });
  });

  describe("should throw error if there's no subItems edge", function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    it("should throw error if no head subItems", function() {
      try {
        initBagel_7(container, dialog, first, last, open, close);
      } catch(e) {
        const errStr = e.toString();
        expect(errStr).toBe("Error: 至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");
      }
    });

    it("should throw error if no tail subItems", function() {
      try {
        initBagel_8(container, dialog, first, last, open, close);
      } catch(e) {
        expect(e).toBe("至少需要包含两个可以聚焦的元素。");
      }
    });
  });

  it("should handle esc key", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel_9(container, dialog, first, last, open, close);
    await open.click();
    expect(first).toHaveFocus();
    await user.keyboard("[Escape]");
    expect(open).toHaveFocus()
  });

  it("should disable onEscape explicitly", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel_10(container, dialog, first, last, open, close);
    await open.click();
    expect(first).toHaveFocus();
    await user.keyboard("[Escape]");
    expect(first).toHaveFocus();
  });

  it("should warn if press esc when no trigger", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel_11(container, dialog, first, last, open, close);
    await open.click();
    expect(first).toHaveFocus();
    await user.keyboard("[Escape]");
    waitFor(() => expect(first).toHaveFocus())
  });

  // // TODO: should handle delaied rootContainer and subItems

  it("should focus nodes manually", async function() {
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getManualModalDom();
    initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    expect(document.body).toHaveFocus();
    await open.click();
    expect(focusA).toHaveFocus();
    await user.tab();
    expect(focusB).toHaveFocus();
    await user.tab();
    expect(focusC).toHaveFocus();
    await user.tab();
    expect(focusD).toHaveFocus();
    await user.tab();
    expect(focusE).toHaveFocus();
    await user.tab();
    expect(focusF).toHaveFocus();
    await user.tab();
    expect(focusG).toHaveFocus();
    await user.tab();
    expect(focusA).toHaveFocus();
    await user.keyboard("[Escape]");
    expect(open).toHaveFocus();
    await open.click();
    expect(focusA).toHaveFocus();
    await focusF.click();
    expect(open).toHaveFocus();
  });

  it("should focus nodes manually(backward)", async function() {
    const s = { shift: true };
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getManualModalDom();
    initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    expect(document.body).toHaveFocus();
    await open.click();
    expect(focusA).toHaveFocus();
    await user.tab();
    expect(focusB).toHaveFocus();
    await user.tab(s);
    expect(focusA).toHaveFocus();
    await user.tab(s);
    expect(focusG).toHaveFocus();
    await user.tab(s);
    expect(focusF).toHaveFocus();
    await user.tab(s);
    expect(focusE).toHaveFocus();
    await user.tab(s);
    expect(focusD).toHaveFocus();
    await user.tab(s);
    expect(focusC).toHaveFocus();
    await user.tab(s);
    expect(focusB).toHaveFocus();
    await user.tab(s);
    expect(focusA).toHaveFocus();
  });

  it("should clampe to focus nodes manually", async function() {
    const s = { shift: true };
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getManualModalDom();
    initBagel_13(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    expect(document.body).toHaveFocus();
    await open.click();
    expect(focusA).toHaveFocus();
    await user.tab(s);
    expect(focusA).toHaveFocus();
    await user.tab();
    expect(focusB).toHaveFocus();
    await user.tab();
    expect(focusC).toHaveFocus();
    await user.tab();
    expect(focusD).toHaveFocus();
    await user.tab();
    expect(focusE).toHaveFocus();
    await user.tab();
    expect(focusF).toHaveFocus();
    await user.tab();
    expect(focusG).toHaveFocus();
    await user.tab();
    expect(focusG).toHaveFocus();
  });

  it("should focus selectable node", async function() {
    const s = { shift: true };
    const { container, dialog, first, last, open, close } = getInputModalDom();
    initBagel(container, dialog, first, last, open, close);

    await open.click();
    expect(first).toHaveFocus();
    await user.tab(s);
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus(); // TODO: toHaveSelect()?
  });

  it("should pass selector string instead of element object", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel_14();
  
    await open.click();
    expect(first).toHaveFocus();
    await user.tab();
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
    await user.tab();
    expect(getByText(container, "樱花软糖")).toHaveFocus();
    await user.tab();
    expect(getByText(container, "大白兔奶糖")).toHaveFocus();
    await user.tab();
    expect(getByText(container, "夹心巧克力")).toHaveFocus();
    await user.tab();
    expect(close).toHaveFocus();
    await user.tab();
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
  });

});

function getManualModalDom() {
  const modal = manualModalHtml;

  const { container } = render(modal);

  const dialog = container.querySelector("#dialog");
  const open = container.querySelector("#open");
  const focusA = container.querySelector("#focusA");
  const focusB = container.querySelector("#focusB");
  const focusC = container.querySelector("#focusC");
  const focusD = container.querySelector("#focusD");
  const focusE = container.querySelector("#focusE");
  const focusF = container.querySelector("#focusE");
  const focusG = container.querySelector("#focusE");

  return { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG };
}

function getInputModalDom() {
  const modal = inputModalHtml;

  const { container } = render(modal);

  const dialog = container.querySelector("#dialog");
  const first = container.querySelector("#firstFocusA");
  const last = container.querySelector("#lastFocusBtn");
  const open = container.querySelector("#open");
  const close = container.querySelector("#close");

  return { container, dialog, first, last, open, close };
}

function getModalDom() {
  const modal = modalHtml;

  const { container } = render(modal);

  const dialog = container.querySelector("#dialog");
  const first = container.querySelector("#firstFocusA");
  const last = container.querySelector("#lastFocusBtn");
  const open = container.querySelector("#open");
  const close = container.querySelector("#close");

  return { container, dialog, first, last, open, close };
}

function initBagel(container, dialog, first, last, open, close) {

  focusBagel(dialog, [first, last], {
    enter: {
      node: open,
      on() {},
    },
    exit: {
      node: close,
      on() {},
    }
  });
}

function initBagel_2(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], { enter: { type: "invoke" } });

  return bagel
}

function initBagel_3(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last]);

  close.addEventListener("click", function() {
    bagel.exit();
  });

  return bagel
}

function initBagel_4(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], { manual: false, enter: { type: "invoke" } });

  open.addEventListener('click', () => {
    bagel.enter();
  })

  return bagel
}

function initBagel_5(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last]);

  open.addEventListener('click', () => {
    first.focus(); // there's no trigger mark, e.g. bagel.enter(), opt.trigger, opt.enter.selector
  })
  close.addEventListener("click", function() {
    bagel.exit(); // this will console warn
  });

  return bagel
}

function initBagel_6(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    exit: {
      node: close,
      on: () => {}
    }
  });

  open.addEventListener('click', () => {
    first.focus(); // there's no trigger mark, e.g. bagel.enter(), opt.trigger, opt.enter.selector
  })

  return bagel
}

function initBagel_7(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, []); // no subItems
}

function initBagel_8(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first]); // just head subItems, no tail subItems
}

function initBagel_9(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    onEscape: true,
    enter: {
      node: open,
    },
    exit: {
      node: close,
    },
  });
}

function initBagel_10(container, dialog, first, last, open, close) {
  const bagel = focusBagel(dialog, [first, last], {
    enter: {
      node: open,
      on: () => {}
    },
    exit: {
      node: close,
      on: () => {}
    },
    onEscape: false,
  });
}

function initBagel_11(container, dialog, first, last, open, close) {
  open.addEventListener("click", function() {
    first.focus();
  });
  const bagel = focusBagel(dialog, [first, last], {
    exit: {
      node: close,
      on: () => {}
    },
    onEscape() {},
  });
}

function initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  const bagel = focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    manual: true,
    onEscape: true,
    enter: {
      node: open,
      on() {},
    },
    exit: {
      node: focusF,
      on() {},
    }
  });
}

function initBagel_13(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG) {
  const bagel = focusBagel(dialog, [focusA, focusB, focusC, focusD, focusE, focusF, focusG], {
    manual: true,
    loop: false,
    enter: {
      node: open,
      on() {},
    },
    exit: {
      node: focusF,
      on() {},
    }
  });
}

function initBagel_14(container, dialog, first, last, open, close) {

  focusBagel("#dialog", ["#firstFocusA", "#lastFocusBtn"], {
    enter: {
      node: "#open",
      on() {},
    },
    exit: {
      node: "#close",
      on() {},
    }
  });
}