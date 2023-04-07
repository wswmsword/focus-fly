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
import focusLoop from '../index.js';
import userEvent from '@testing-library/user-event';
import render from './helper/render.js';
const user = userEvent.setup();

function getModalDom() {
  const modal = `
    <button id="open">打开一包糖</button>
    <button id="walk1">走两步</button>
    <div
      id="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      class="centre"
      role="dialog"
      tabindex="0">
      <h2 id="modal-title">吃一颗糖</h2>
      <ul>
        <li><a id="firstFocusA" href="#">椰蓉酥心糖</a></li>
        <li><a href="#">不二家棒棒糖</a></li>
        <li><a href="#">樱花软糖</a></li>
        <li><a href="#">大白兔奶糖</a></li>
        <li><a href="#">夹心巧克力</a></li>
      </ul>
      <div class="ctrls">
        <button id="close">Close</button>
        <button id="lastFocusBtn">OK</button>
      </div>
    </div>
    <button id="walk2">走两步</button>
  `;

  const { container } = render(modal);

  const dialog = container.querySelector("#dialog");
  const first = container.querySelector("#firstFocusA");
  const last = container.querySelector("#lastFocusBtn");
  const open = container.querySelector("#open");
  const close = container.querySelector("#close");


  open.addEventListener('click', () => {
    first.focus();
  })

  focusLoop(dialog, [first, last], {
    enter: {
      selector: open,
      on() {},
    },
    exit: {
      selector: close,
      on() {},
    }
  });

  return { container, dialog, first, last, open, close };
}

describe("focus-loop", function() {
  test("should focus first focusable node of modal after click trigger", async () => {
    const { open, first } = getModalDom();
  
    open.click();
    expect(first).toHaveFocus();
  });

  test("should focus back to trigger after click close button", () => {
    const { open, close } = getModalDom();
  
    close.click();
    expect(open).toHaveFocus();
  });

  test("should focus first focusable node of modal that is visible and sibling with trigger after press tab", async () => {
    const { container, open, dialog, first, last } = getModalDom();
  
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
    const { container, open, first, close, last } = getModalDom();
  
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
    const { container, open, dialog, first, close, last } = getModalDom();
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
});