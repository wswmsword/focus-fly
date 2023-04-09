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
  open.addEventListener('click', () => {
    first.focus();
  })

  focusBagel(dialog, [first, last], {
    enter: {
      selector: open,
      on() {},
    },
    exit: {
      selector: close,
      on() {},
    }
  });
}

describe("focus-bagel", function() {
  test("should focus first focusable node of modal after click trigger", async () => {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
  
    open.click();
    expect(first).toHaveFocus();
  });

  test("should focus back to trigger after click close button", () => {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
  
    close.click();
    expect(open).toHaveFocus();
  });

  test("should focus first focusable node of modal that is visible and sibling with trigger after press tab", async () => {
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

  test("should loop focus forward", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
  
    open.click();
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

  test("should loop focus backward", async function() {
    const { container, dialog, first, last, open, close } = getModalDom();
    initBagel(container, dialog, first, last, open, close)
    const s = { shift: true };
    open.click();
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

  test("should enter by return api", function() {

  });

  test("should exit by return api", function() {

  });
});