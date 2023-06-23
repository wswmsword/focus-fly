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
import userEvent from '@testing-library/user-event';
const user = userEvent.setup();
import { getSequenceModalDom, getInputModalDom, getRangeModalDom, getCoverModalDom } from "./template-html/index.js"
import { initBagel, initBagel_1_1, initBagel_2, initBagel_3, initBagel_4, initBagel_4_1, initBagel_5, initBagel_6, initBagel_7, initBagel_8, initBagel_9, initBagel_10, initBagel_11, initBagel_12, initBagel_13, initBagel_14, initBagel_15, initBagel_16, initBagel_17, initBagel_18, initBagel_19, initBagel_20, initBagel_21, initBagel_22, initBagel_23, initBagel_24, initBagel_25, initBagel_26, initBagel_27, initBagel_28, initBagel_29, initBagel_30 } from "./bagels.js";
import { wait } from './helper/utils.js';

describe("focus-bagel", function() {

  // 点击入口后聚焦第一个可聚焦元素
  it("should focus first focusable node of modal after clicking entry", async () => {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel(container, dialog, first, last, open, close);
  
    await user.click(open);
    expect(first).toHaveFocus();
  });

  // 点击关闭按钮后聚焦入口
  it("should back to focus entry after clicking close button", async () => {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel(container, dialog, first, last, open, close);
  
    await user.click(close);
    expect(open).toHaveFocus();
  });

  // 循环聚焦列表
  it("should loop focus around list by forward tab", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel(container, dialog, first, last, open, close);

    await user.click(open);
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

  // 循环聚焦列表（向后循环）
  it("should loop focus backward", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel(container, dialog, first, last, open, close);
    const s = { shift: true };
    await user.click(open);
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

  // 在一个范围里阻止循环
  it("should clamp focus by range", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_1_1(container, dialog, first, last, open, close);
    const s = { shift: true };

    await user.click(open);
    expect(first).toHaveFocus();
    await user.tab(s);
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
    expect(last).toHaveFocus();
    await user.tab(s);await user.tab(s);await user.tab(s);await user.tab(s);await user.tab(s);await user.tab(s);
    expect(first).toHaveFocus();
    await user.tab(s);
    expect(first).toHaveFocus();
  });

  // 通过返回的 api 聚焦列表
  it("should be trapped list by Return.enter", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_2(container, dialog, first, last, open, close);
    expect(document.body).toHaveFocus();
    await bagel.enter(); // maybe setTimeout 300ms
    expect(first).toHaveFocus();
  });

  // 通过返回的 api 退出列表
  it("should make focus release from list by Return.exit", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_3(container, dialog, first, last, open, close);
    await bagel.enter();
    expect(first).toHaveFocus();
    await user.click(close);
    expect(open).toHaveFocus();
  });

  // 关闭 sequence 选项之后，activeIndex 不改变
  it("should not change activeIndex when the sequence option is disabled", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_4(container, dialog, first, last, open, close);

    const i1 = bagel.i();
    expect(i1).toBe(-1);
    await user.tab();
    const i2 = bagel.i();
    expect(i2).toBe(-1);
    await user.click(open);
    expect(first).toHaveFocus();
    const i3 = bagel.i();
    expect(i3).toBe(0);
    await user.tab();
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
    expect(i3).toBe(0);
    await user.click(close);
    expect(open).toHaveFocus();
    const i4 = bagel.i();
    expect(i4).toBe(0);
  });

  // 打开 sequence 选项之后，activeIndex 改变
  it("should change activeIndex when the sequence option is enabled", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_4_1(container, dialog, first, last, open, close);

    const i1 = bagel.i();
    expect(i1).toBe(-1);

    await user.tab();
    const i2 = bagel.i();
    expect(i2).toBe(-1);

    await user.click(open);
    expect(first).toHaveFocus();
    const i3 = bagel.i();
    expect(i3).toBe(0);

    await user.tab();
    expect(last).toHaveFocus();
    const i4 = bagel.i();
    expect(i4).toBe(1);

    await user.tab();
    expect(first).toHaveFocus();
    const i5 = bagel.i();
    expect(i5).toBe(0);

    await user.tab();

    await user.click(close);
    const i6 = bagel.i();
    expect(i6).toBe(1);
  });

  // 没有定义入口，将不会在调用 Return.exit 时聚焦入口
  it("should not focus trigger by invoking Return.exit when the entry trigger is not defined", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_5(container, dialog, first, last, open, close);

    await user.click(open);
    expect(first).toHaveFocus();
    await user.click(close);
    expect(close).toHaveFocus()
  });

  // 没有定义入口，将不会在退出时聚焦入口
  it("should not focus trigger by exit when the entry trigger is not defined", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_6(container, dialog, first, last, open, close);

    await user.click(open);
    expect(first).toHaveFocus();
    await user.click(close);
    expect(close).toHaveFocus();
  });

  // 如果没有正确提供列表范围，将会报错
  describe("should throw error if there's no list edge", function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    it("should throw error if has no head of list", function() {
      try {
        initBagel_7(container, dialog, first, last, open, close);
      } catch(e) {
        const errStr = e.toString();
        expect(errStr).toBe("Error: 至少需要包含两个可以聚焦的元素，如果元素需要等待渲染，您可以尝试 delayToFocus 选项。");
      }
    });

    it("should throw error if has no tail of list", function() {
      try {
        initBagel_8(container, dialog, first, last, open, close);
      } catch(e) {
        expect(e).toBe("至少需要包含两个可以聚焦的元素。");
      }
    });
  });

  // 设置 onEscape 为 true，将能通过 esc 退出列表
  it("should handle esc key when the onEscape is enabled", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_9(container, dialog, first, last, open, close);
    await user.click(open);
    expect(first).toHaveFocus();
    await user.keyboard("[Escape]");
    expect(open).toHaveFocus()
  });

  // 显式关闭左上角 esc 来避免退出列表和避免聚焦入口
  it("should ignore esc key to avoid focusing entry by disabling onEscape explicitly", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_10(container, dialog, first, last, open, close);
    await user.click(open);
    expect(first).toHaveFocus();
    await user.keyboard("[Escape]");
    expect(first).toHaveFocus();
  });

  // 没有入口时，在列表内按下 esc 退出后，不会改变焦点
  it("should not change activeElement by pressing esc when it has no entry trigger", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_11(container, dialog, first, last, open, close);
    await user.click(open);
    expect(first).toHaveFocus();
    await user.tab();
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
    await user.keyboard("[Escape]");
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
  });

  // 通过设置序列，循环聚焦
  it("should loop focus by sequence", async function() {
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    expect(document.body).toHaveFocus();
    await user.click(open);
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
    await user.click(open);
    expect(focusA).toHaveFocus();
    await user.click(focusF);
    expect(open).toHaveFocus();
  });

  // 通过设置序列，循环聚焦（向后循环）
  it("should loop focus whithin sequence(backward)", async function() {
    const s = { shift: true };
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    expect(document.body).toHaveFocus();
    await user.click(open);
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

  // 设置序列，阻止循环
  it("should clamp focus nodes whthin sequence", async function() {
    const s = { shift: true };
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_13(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    expect(document.body).toHaveFocus();
    await user.click(open);
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

  // 聚焦可选中的节点
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

  // 传入选择器字符串，而不是节点对象
  it("should pass selector string instead of element object", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
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

  // 通过 Return.addForward 添加转发，可以转发焦点
  it("should forward focus by Return.addForward", async function() {
    const { container, dialog, first, last, open, close, walk2, walk1 } = getRangeModalDom();
    const bagel = initBagel(container, dialog, first, last, open, close);
    bagel.addForward("f.f", {
      node: dialog,
      key: e => e.key === "Tab",
      target: walk2,
    });

    await user.tab();
    expect(open).toHaveFocus();
    await user.tab();
    expect(walk1).toHaveFocus();
    await user.tab();
    expect(dialog).toHaveFocus();
    await user.tab();
    expect(walk2).toHaveFocus();
  });

  // 移除转发
  it("should remove forward by Return.removeForward", async function() {
    const { container, dialog, first, last, open, close, walk2, walk1 } = getRangeModalDom();
    const bagel = initBagel(container, dialog, first, last, open, close);
    bagel.addForward("f.f", {
      node: dialog,
      key: e => e.key === "Tab",
      target: walk2,
    });
    await user.tab();await user.tab();await user.tab();
    bagel.removeForward("f.f");
    await user.tab();
    expect(first).toHaveFocus();
  });

  // 通过 correctionTarget 矫正从非入口进入列表的焦点
  it("should correct focus by correctionTarget", async function() {
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2 } = getSequenceModalDom();
    initBagel_20(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    await user.click(walk2);
    expect(walk2).toHaveFocus();
    await user.tab({ shift: true });
    expect(focusD).toHaveFocus();
  });

  // 手动添加入口
  it("should add entry manually", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_22(container, dialog, first, last, open, close);

    await user.click(open);
    expect(open).toHaveFocus();
    bagel.addEntryListeners();
    await user.click(open);
    expect(first).toHaveFocus();
  });

  // 手动添加列表相关监听事件
  it("should add list manually", async function() {
    const { container, dialog, first, last, open, close, walk1 } = getRangeModalDom();
    const bagel = initBagel_22(container, dialog, first, last, open, close);

    bagel.addEntryListeners();
    await user.click(open);
    expect(first).toHaveFocus();
    await user.tab({ shift: true });await user.tab({ shift: true });
    expect(walk1).toHaveFocus();

    await bagel.exit({});
    expect(open).toHaveFocus();
    await user.click(open);
    expect(first).toHaveFocus();

    bagel.addListRelatedListeners();
    await user.tab({ shift: true });await user.tab({ shift: true });
    expect(close).toHaveFocus();
  });

  it("should updateList dynamically", async function() {
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2 } = getSequenceModalDom();
    const bagel = initBagel_23(dialog, open, focusA, focusB, focusC);

    await user.click(open);
    expect(focusA).toHaveFocus();
    await user.tab({ shift: true });
    expect(focusC).toHaveFocus();

    bagel.updateList([focusA, focusB, focusC, focusD, focusE, focusF, focusG]);
    await user.tab();
    expect(focusD).toHaveFocus();
    await user.tab();await user.tab();await user.tab();await user.tab();
    expect(focusA).toHaveFocus();
  });

  // 延迟聚焦
  it("should delay to focus list", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_27(container, dialog, first, last, open, close);

    await user.click(open);
    expect(open).toHaveFocus();
    await wait(30);
    expect(open).toHaveFocus();
    await wait(70);
    expect(first).toHaveFocus();
  });

  // 移除所有事件
  it("should remove all listeners by Return.removeListeners", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_28(container, dialog, first, last, open, close);

    await user.click(open);
    expect(first).toHaveFocus();
    await user.click(close);
    expect(open).toHaveFocus();

    bagel.removeListeners();
    await user.click(open);
    expect(open).toHaveFocus();
  });

  // 移除列表相关事件
  it("should remove list related listeners by Return.removeListRelatedListeners", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_28(container, dialog, first, last, open, close);

    await user.click(open);
    expect(first).toHaveFocus();

    await user.tab({ shift: true });
    expect(last).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();

    bagel.removeListRelatedListeners();
    await user.tab({ shift: true });
    expect(dialog).toHaveFocus();
  });

  it("should remove entry by Return.removeEntryListeners", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    const bagel = initBagel_28(container, dialog, first, last, open, close);

    bagel.removeEntryListeners();
    await user.click(open);
    expect(open).toHaveFocus();
  });

});

// 开启封面
describe("cover", function() {

  // 点击入口后聚焦封面
  it("should focus cover after clicking entry", async function() {
    const { container, dialog, first, last, open, close, cover } = getCoverModalDom();
    initBagel_15(container, dialog, first, last, open, close);

    await user.click(open);
    expect(cover).toHaveFocus();
  });

  // `cover: true` 的配置，从封面按下 enter 进入列表
  it("should focus first focusable node after pressing enter at cover", async function() {
    const { container, dialog, first, last, open, close } = getCoverModalDom();
    initBagel_15(container, dialog, first, last, open, close);

    await user.click(open);
    await user.keyboard("{Enter}");
    expect(first).toHaveFocus();
  });

  // 点击出口，回到封面
  it("should focus cover after clicking exit", async function() {
    const { container, dialog, first, last, open, close, cover } = getCoverModalDom();
    initBagel_15(container, dialog, first, last, open, close);

    await user.click(open);
    await user.keyboard("{Enter}");
    await user.click(close);
    expect(cover).toHaveFocus();
  });

  // 在封面按下 Tab，进入列表最后一个元素的后一个元素
  it("should focus element after last list element after pressing Tab at cover", async function() {
    const { container, dialog, first, last, open, close, cover } = getCoverModalDom();
    initBagel_15(container, dialog, first, last, open, close);

    await user.click(open);
    expect(cover).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus(); // 这里理论上应该匹配 `#walk2`，可能是 JSDom 的问题，这里没有体现 tab 在浏览器的默认行为

    await user.click(open);
    await user.keyboard("{Enter}");
    await user.click(close);
    await user.tab();
    expect(first).toHaveFocus(); // 同上，理论上应该匹配 `#walk2`
  });

  // 添加封面后正常循环聚焦
  it("should loop focus around list by forward and backward tab", async function() {
    const s = { shift: true };
    const { container, dialog, first, last, open, close, cover, focusB } = getCoverModalDom();
    initBagel_15(container, dialog, first, last, open, close);

    await user.click(open);
    await user.keyboard("{Enter}");
    await user.tab();
    expect(focusB).toHaveFocus();
    await user.tab(s);await user.tab(s);
    expect(last).toHaveFocus();
    await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();
    expect(first).toHaveFocus();
  });

  // 通过 exit 设置退出的方式
  it("cover.exit", async function() {
    const { container, dialog, first, last, open, close, cover, focusB } = getCoverModalDom();
    initBagel_29(container, dialog, first, last, open, close);

    await user.click(open);
    expect(dialog).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(first).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(dialog).toHaveFocus();

    await user.keyboard("{c}");
    expect(open).toHaveFocus();
  });

  // 非列表内的封面
  it("wild cover", async function() {
    const { container, dialog, first, last, open, close, walk2 } = getCoverModalDom();
    initBagel_30(container, dialog, first, last, open, close, walk2);

    await user.click(open);
    expect(walk2).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(first).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(walk2).toHaveFocus();
    await user.keyboard("{c}");
    expect(open).toHaveFocus();
  });

  // 纠正焦点，重新聚焦封面
  it("correction", async function() {
    const { container, dialog, first, last, open, close, walk2 } = getCoverModalDom();
    initBagel_15(container, dialog, first, last, open, close);

    walk2.focus();
    await user.tab({ shift: true });
    expect(dialog).toHaveFocus();
  });

});

// 选项参数
describe("options", function() {

  describe("entry", function() {
    // 入口的目标是一个函数
    it("function target", async function() {
      const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      initBagel_16(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(open);
      expect(focusB).toHaveFocus();
    });

    // 入口的目标是选择器字符串
    it("selector string target", async function() {
      const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      initBagel_17(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(open);
      expect(focusB).toHaveFocus();
    });

    // 通过按下按键作为入口，进入列表
    it("keydown type", async function() {
      const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      initBagel_18(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.tab();
      expect(open).toHaveFocus();
      await user.keyboard("{Space}");
      expect(focusA).toHaveFocus();
    });

    // node 数组
    it("node array", async function() {
      const { container, dialog, first, last, open, close, walk1 } = getRangeModalDom();
      initBagel_28(container, dialog, first, last, open, close, walk1)

      await user.click(open);
      expect(first).toHaveFocus();
      await user.click(close);
      expect(open).toHaveFocus();

      await user.click(walk1);
      expect(first).toHaveFocus();
      await user.click(close);
      expect(open).toHaveFocus();
    });
  });

  describe("exit", function() {
    // 通过聚焦作为出口，退出列表
    it("focus type", async function() {
      const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      initBagel_19(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(open);
      await user.tab();await user.tab();await user.tab();await user.tab();
      expect(focusE).toHaveFocus();
      await user.tab();
      expect(open).toHaveFocus();
    });

    // 设置列表外的出口
    it("wild node that out of list", async function() {
      const { container, dialog, first, last, open, close, walk2 } = getRangeModalDom();
      initBagel_21(container, dialog, first, last, open, close, walk2);

      await user.click(open);
      expect(first).toHaveFocus();
      await user.click(walk2);
      expect(open).toHaveFocus();
    });

    // target 显式设为 false，焦点则不回到入口，不改变焦点
    it("should not change focus when the target is false", async function() {
      const { container, dialog, first, last, open, close, walk2 } = getRangeModalDom();
      initBagel_24(container, dialog, first, last, open, close);

      await user.click(open);
      expect(first).toHaveFocus();
      await user.click(close);
      expect(close).toHaveFocus();
      await user.tab();await user.tab();await user.tab();
      expect(walk2).toHaveFocus();
    });

    // 聚焦触发野生出口
    it("focus wild node", async function() {
      const { container, dialog, first, last, open, close, walk2 } = getRangeModalDom();
      initBagel_25(container, dialog, first, last, open, close, walk2);

      await user.click(open);
      expect(first).toHaveFocus();
      walk2.focus();
      expect(walk2).toHaveFocus();
      await wait(4);
      expect(open).toHaveFocus();
    });

    // 出口的类型是 outlist
    it("outlist type", async function() {
      const { container, dialog, first, last, open, close, walk2 } = getRangeModalDom();
      initBagel_26(container, dialog, first, last, open, close);

      await user.click(open);
      expect(first).toHaveFocus();
      walk2.focus();
      await wait(4);
      expect(open).toHaveFocus();
    });
  });

});

// 列表相关
describe("list", function() {

  // 焦点在根元素上时，可以通过 tab 聚焦列表子元素
  it ("should focus range list when activeElement is root", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel(container, dialog, first, last, open, close)

    await user.click(open);
    expect(first).toHaveFocus();
    await user.click(dialog);
    expect(dialog).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();

    await user.click(dialog);
    await user.tab();
    expect(first).toHaveFocus();
  });
});

// 函数返回值
describe("Returns", function() {

  // 进入列表
  describe("enter", function() {

    // 传入参数作为入口配置
    it("passing a value", async function() {
      const { container, dialog, first, last, open, close } = getRangeModalDom();
      const bagel = initBagel_2(container, dialog, first, last, open, close);
      expect(document.body).toHaveFocus();

      await bagel.enter({});
      expect(first).toHaveFocus();
    });
  });

  // 添加转发
  describe("addForward", function() {

    // 使用函数作为转发的入参
    it("function", async function() {
      const { container, dialog, first, last, open, close } = getRangeModalDom();
      const bagel = initBagel(container, dialog, first, last, open, close);
      bagel.addForward("f.f", ({tail}) => {
        return {
          node: dialog,
          key: e => e.key === "Tab",
          target: tail,
        }
      });
      await user.tab();await user.tab();await user.tab();await user.tab();
      expect(last).toHaveFocus();
    });
  });
});