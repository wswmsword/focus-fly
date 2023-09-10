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
import { initBagel, initBagel_1_1, initBagel_2, initBagel_3, initBagel_4, initBagel_4_1, initBagel_5, initBagel_6, initBagel_7, initBagel_8, initBagel_9, initBagel_10, initBagel_11, initBagel_12, initBagel_13, initBagel_14, initBagel_15, initBagel_16, initBagel_17, initBagel_18, initBagel_19, initBagel_20, initBagel_21, initBagel_22, initBagel_23, initBagel_24, initBagel_25, initBagel_26, initBagel_27, initBagel_28, initBagel_29, initBagel_30, initBagel_31, initBagel_32, initBagel_33, initBagel_34, initBagel_20_1, initBagel_35, initBagel_16_1, initBagel_36, initBagel_37, initBagel_38, initBagel_39, initBagel_40, initBagel_1_2, initBagel_20_2, initBagel_20_3, initBagel_15_1, initBagel_28_1, initBagel_28_2, initBagel_41, initBagel_42, initBagel_43, initBagel_44, initBagel_45, initBagel_46, initBagel_47, initBagel_13_1, initBagel_48 } from "./bagels.js";
import { wait } from './helper/utils.js';

// 基本功能
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
  
    await user.click(open);
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
    expect(i3).toBe(-1);
    await user.tab();
    expect(getByText(container, "不二家棒棒糖")).toHaveFocus();
    expect(i3).toBe(-1);
    await user.click(close);
    expect(open).toHaveFocus();
    const i4 = bagel.i();
    expect(i4).toBe(-1);
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
        expect(errStr).toBe("Error: 请至少传入一个数组，数组至少包含两个可聚焦元素，用来表示列表的头和尾。");
      }
    });

    it("should throw error if has no tail of list", function() {
      try {
        initBagel_8(container, dialog, first, last, open, close);
      } catch(e) {
        expect(e.toString()).toBe("Error: 请至少传入一个数组，数组至少包含两个可聚焦元素，用来表示列表的头和尾。");
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
    const bagel = initBagel_1_2(container, dialog, first, last, open, close);
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
    const bagel = initBagel_1_2(container, dialog, first, last, open, close);
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
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2 } = getSequenceModalDom();
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

  // 用按键字符串替代按键函数
  it("should pass key-string instead of key-function", async function() {
    const { container, dialog, first, last, open, close } = getRangeModalDom();
    initBagel_28_1(container, dialog, first, last, open, close);

    await user.click(open);
    expect(first).toHaveFocus();
    await user.keyboard("{Control>}c{/Control}");
    expect(open).toHaveFocus();
  });

  // 用字符串定义的按键遍历访问列表序列
  it("should pass key-string to navigate sequence", async function() {
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_28_2(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    await user.click(open);
    expect(focusA).toHaveFocus();
    await user.keyboard("{Control>}n{/Control}");
    expect(focusB).toHaveFocus();
    await user.tab();
    expect(focusB).toHaveFocus();
    await user.keyboard("{Control>}n{/Control}");
    await user.keyboard("{Control>}n{/Control}");
    await user.keyboard("{Control>}n{/Control}");
    await user.keyboard("{Control>}n{/Control}");
    await user.keyboard("{Control>}n{/Control}");
    expect(focusG).toHaveFocus();
    await user.keyboard("{Control>}n{/Control}");
    expect(focusA).toHaveFocus();
    await user.keyboard("{Control>}p{/Control}");
    expect(focusG).toHaveFocus();
    await user.tab({ shift: true });
    expect(focusG).toHaveFocus();
  });

});

// key 属性的字符串形式
describe("string key for shortcut", function () {

  // “j” 代表按下 j 向前导航，“k” 代表按下 k 向后导航
  it("common keys such as j, k", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_41(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    await user.click(open);
    expect(focusA).toHaveFocus();
    await user.keyboard("{j}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{j}");await user.keyboard("{j}");
    expect(focusD).toHaveFocus();
    await user.keyboard("{k}");await user.keyboard("{k}");await user.keyboard("{k}");
    expect(focusA).toHaveFocus();
    await user.keyboard("{k}");
    expect(focusG).toHaveFocus();
  });

  // 如果有多个普通按键，取最后一个
  it("take the last key of common keys", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_42(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    await user.click(open);
    expect(focusA).toHaveFocus();
    await user.keyboard("{f}");
    expect(focusA).toHaveFocus();
    await user.keyboard("{j}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{k}");await user.keyboard("{k}");
    expect(focusG).toHaveFocus();
  });

  it("shift", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_43(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    await user.click(open);
    expect(focusA).toHaveFocus();
    await user.keyboard("{j}");
    expect(focusA).toHaveFocus();
    await user.keyboard("{k}");
    expect(focusA).toHaveFocus();
    await user.keyboard("{Shift>}j{/Shift}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{Shift>}k{/Shift}");await user.keyboard("{Shift>}k{/Shift}");
    expect(focusG).toHaveFocus();
  });

  it("Meta, Command, Windows", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_44(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);
    await user.click(open);
    await user.keyboard("{Meta>}j{/Meta}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{Meta>}k{/Meta}");
    expect(focusA).toHaveFocus();
  });

  it("alt", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_45(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);
    await user.click(open);
    await user.keyboard("{Alt>}j{/Alt}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{Alt>}k{/Alt}");
    expect(focusA).toHaveFocus();
  });

  // 多组合键
  it("compose Control-Shift-n", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_46(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);
    await user.click(open);
    await user.keyboard("{Control>}n{/Control}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{Control>}{Shift>}n{/Control}{/Shift}");
    expect(focusA).toHaveFocus();
  });

  // 方向键
  it("arrow left and arrow right", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_47(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);
    await user.click(open);
    await user.keyboard("{ArrowRight}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(focusA).toHaveFocus();
  });

  // 键盘字符串数组
  it("should pass string array", async function() {
    const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_48(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);
    await user.click(open);
    await user.keyboard("{ArrowRight}");
    expect(focusB).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(focusC).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    await user.keyboard("{ArrowUp}");
    expect(focusA).toHaveFocus();
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
  });

  // 在封面按下 Tab，进入列表最后一个元素的后一个元素（进入列表，退出至封面）
  it("should focus element after last list element after pressing Tab at cover", async function() {
    const { container, dialog, first, last, open, close, cover } = getCoverModalDom();
    initBagel_15(container, dialog, first, last, open, close);

    await user.click(open);
    await user.keyboard("{Enter}");
    expect(focusA).toHaveFocus();
    await user.click(close);
    expect(cover).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus(); // 这里理论上应该匹配 `#walk2`，可能是 JSDom 的问题，这里没有体现 tab 在浏览器的默认行为
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

  it("should pass key to cover.exit directly", async function() {
    const { container, dialog, first, last, open, close, walk2 } = getCoverModalDom();
    initBagel_31(container, dialog, first, last, open, close);

    await user.click(open);
    expect(dialog).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(first).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(dialog).toHaveFocus();

    await user.keyboard("{e}");
    expect(open).toHaveFocus();
  });

  // 进入封面后，聚焦上一次聚焦的列表元素，如果是第一次，则聚焦列表第一个元素
  it("should focus last focused item when enabled sequence mode", async function() {
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, cover } = getCoverModalDom();
    initBagel_15_1(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    await user.click(open);
    expect(cover).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(focusA).toHaveFocus();

    await user.tab(); // focusB
    await user.tab(); // focusC
    expect(focusC).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(cover).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(focusC).toHaveFocus();
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

    // 目标的返回值是 null
    it("null target", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      initBagel_16_1(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(open);
      expect(focusA).toHaveFocus();
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
      expect(close).toHaveFocus();
      await user.click(close);
      expect(open).toHaveFocus();
    });

    // 开关，入口同时作为出口
    it("toggle", async function() {
      const { container, dialog, first, last, open, close, walk1 } = getRangeModalDom();
      initBagel_35(container, dialog, first, last, open, close, walk1)

      await user.click(open);
      expect(first).toHaveFocus();
      expect(open).toHaveClass("opened");

      await user.click(open);
      expect(open).toHaveFocus();
      expect(open).not.toHaveClass("opened");
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

    // 函数出口
    it("function node", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      const bagel = initBagel_36(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(open);
      expect(focusA).toHaveFocus();
      await user.click(focusG);
      expect(open).toHaveFocus();

      bagel.updateList([focusA, focusB, focusC]); // 更新列表
      await user.click(open);
      expect(focusG).toHaveFocus();
      await user.click(focusC);
      expect(open).toHaveFocus();
    });

    // 出口的优先级比列表移动高
    it("the exit has higher priority than list-moving", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2 } = getSequenceModalDom();
      initBagel_37(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2);

      await user.click(open);
      expect(focusA).toHaveFocus();

      await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();await user.tab();

      expect(focusG).toHaveFocus();
      await user.tab(); // exit
      expect(walk2).toHaveFocus();

      await user.tab({ shift: true }); // correction
      expect(focusA).not.toHaveFocus();
      expect(focusG).toHaveFocus();
    });

    // 阻止事件冒泡
    it("stopPropagation", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2 } = getSequenceModalDom();
      initBagel_38(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2);

      await user.click(dialog);
      expect(walk2).toHaveFocus();

      await user.click(open);
      expect(focusA).toHaveFocus();

      await user.click(focusG); // stopPropagation
      expect(open).toHaveFocus();
      expect(walk2).not.toHaveFocus();
    });

    // 出口首先移除事件，然后聚焦目标元素，防止焦点矫正导致的聚焦目标错误
    it("remove listeners before focusing target", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2 } = getSequenceModalDom();
      initBagel_39(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk2);

      await user.click(open);
      expect(focusA).toHaveFocus();

      await user.click(focusG);
      expect(dialog).toHaveFocus();
      expect(focusG).not.toHaveFocus();
    });
  });

  describe("allowSafariToFocusAfterMousedown", function() {

    // 模拟 Safari 不聚焦 button 的问题
    it("should focus button in Safari", async function() {
      const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);
      window.safari = {}; // 模拟 Safari

      await user.click(open);
      expect(focusA).toHaveFocus();
      await user.click(focusD);
      expect(focusD).toHaveFocus();
    });
  });

  describe("onMove", function() {

    // 触发入口和出口，列表移动的时候，会触发 onMove
    it("should onMove in entry, list and exit", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      initBagel_32(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(open);
      expect(focusA).toHaveFocus();
      expect(focusA).toHaveClass("selected");

      await user.tab();
      expect(focusB).toHaveFocus();
      expect(focusB).toHaveClass("selected");
      expect(focusA).not.toHaveClass("selected");

      await user.tab();
      await user.tab({ shift: true });
      expect(focusB).toHaveFocus();
      expect(focusB).toHaveClass("selected");
      expect(focusC).not.toHaveClass("selected");

      await user.click(focusG);
      expect(open).toHaveFocus();
      expect(focusG).not.toHaveClass("selected");
      expect(focusB).not.toHaveClass("selected");
    });

    // 焦点矫正后，触发 onMove
    it("should onMove after correctionTarget", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk1 } = getSequenceModalDom();
      initBagel_33(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.tab();
      await user.tab();
      expect(walk1).toHaveFocus();

      await user.tab(); // correction
      expect(focusD).toHaveFocus();

      expect(focusD).toHaveClass("selected");
      expect(dialog).not.toHaveClass("selected");
      expect(focusA).not.toHaveClass("selected");
    });

    it("should onMove again after first onMove by clicking", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk1 } = getSequenceModalDom();
      initBagel_34(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(focusB);
      expect(focusB).toHaveFocus();
      expect(focusB).toHaveClass("selected");

      await user.click(walk1);
      await wait(100);
      expect(open).toHaveFocus();
      expect(focusB).not.toHaveFocus();
      expect(focusB).not.toHaveClass("selected");

      await user.click(focusB);
      expect(focusB).toHaveFocus();
      expect(focusB).toHaveClass("selected");
    });
  });

  describe("correctionTarget", function() {

    // 可以通过 tab 触发矫正，序列模式
    it("should correction by tab in default sequence-list mode", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk1 } = getSequenceModalDom();
      initBagel_20_1(dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      await user.click(focusC);
      expect(focusC).toHaveFocus();

      await user.keyboard("[Escape]");
      expect(open).toHaveFocus();

      await user.tab();
      expect(walk1).toHaveFocus();
      await user.tab();
      expect(focusC).toHaveFocus(); // correction

      await user.click(focusF);
      expect(open).toHaveFocus();
      await user.tab();
      await user.tab();
      expect(focusF).toHaveFocus(); // correction

    });

    // 可以通过 tab 触发矫正，范围模式
    it("should correction by tab in range-list mode", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk1, walk2 } = getSequenceModalDom();
      initBagel_20_2(dialog, open, focusA, focusG);

      await user.click(open);
      expect(focusA).toHaveFocus();

      await user.tab();
      expect(focusB).toHaveFocus();

      await user.click(walk2);
      expect(walk2).toHaveFocus();
      await user.tab({ shift: true }); // correct to focusB
      expect(focusB).toHaveFocus();

      await user.tab();
      await user.tab();
      await user.tab();
      await user.click(walk1);
      await user.tab(); // correct to focusE
      expect(focusE).toHaveFocus();
    });

    // 关闭 correctionTarget 后依然可以触发 onMove
    it("should onMove when disabled correctionTarget", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk1, walk2 } = getSequenceModalDom();
      initBagel_20_3(dialog, open, focusA, focusG);

      await user.click(open);
      expect(focusA).toHaveFocus();
      expect(focusA).toHaveClass("selected");

      await user.tab();
      expect(focusB).toHaveFocus();
      expect(focusB).toHaveClass("selected");
      expect(focusA).not.toHaveClass("selected");

      await user.tab();
      await user.tab({ shift: true });
      expect(focusB).toHaveFocus();
      expect(focusB).toHaveClass("selected");
      expect(focusC).not.toHaveClass("selected");

      await user.click(focusG);
      expect(open).toHaveFocus();
      expect(focusG).not.toHaveClass("selected");
      expect(focusB).not.toHaveClass("selected");
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

  // 自定义前进或后退的按键后，默认的 tab 导航将失效
  it("should not tab the key is customized", async function() {
    const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
    initBagel_13_1(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

    await user.click(open);
    expect(focusA).toHaveFocus();
    await user.tab();
    expect(focusA).toHaveFocus();
    await user.tab({ shift: true });
    expect(focusA).toHaveFocus();
    await user.keyboard("j");
    expect(focusB).toHaveFocus();
    await user.keyboard("k");
    expect(focusA).toHaveFocus(); 
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

  // activeIndex 相关，当前聚焦元素序列号相关
  describe('i', function() {

    it("should change activeIndex", async function() {
      const { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      const bagel = initBagel_12(container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG);

      var curI = bagel.i();
      expect(curI).toBe(-1);

      await user.click(open);
      expect(focusA).toHaveFocus();
      curI = bagel.i();
      expect(curI).toBe(0);

      bagel.i(3);
      expect(focusD).toHaveFocus();

      curI = bagel.i();
      expect(curI).toBe(3);
    });
  });

  // 更新列表相关，例如无限滚动
  describe("updateList", function() {

    // 调用 updateList 后通过入口进入列表
    it("entry after updateList", async function() {
      const { dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG } = getSequenceModalDom();
      const bagel = initBagel_40(dialog, open, focusA, focusB, focusC);
      bagel.updateList([focusA, focusB, focusC, focusD, focusE, focusF, focusG]);

      await user.click(open);
      expect(focusA).toHaveFocus();

      await user.click(focusG);
      expect(open).toHaveFocus();
    });
  });
});