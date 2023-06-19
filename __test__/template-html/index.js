import render from "../helper/render";
import inputModalHtml from "./input-modal";
import manualModalHtml from "./manual-modal";
import modalHtml from "./modal";

export function getManualModalDom() {
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

export function getInputModalDom() {
  const modal = inputModalHtml;

  const { container } = render(modal);

  const dialog = container.querySelector("#dialog");
  const first = container.querySelector("#firstFocusA");
  const last = container.querySelector("#lastFocusBtn");
  const open = container.querySelector("#open");
  const close = container.querySelector("#close");

  return { container, dialog, first, last, open, close };
}

export function getModalDom() {

  const { container } = render(modalHtml);

  const dialog = container.querySelector("#dialog");
  const first = container.querySelector("#firstFocusA");
  const last = container.querySelector("#lastFocusBtn");
  const open = container.querySelector("#open");
  const close = container.querySelector("#close");

  return { container, dialog, first, last, open, close };
}