import render from "../helper/render";
import inputModalHtml from "./input-modal";
import sequenceModalHtml from "./sequence-modal";
import rangeModalHtml from "./range-modal";

export function getSequenceModalDom() {
  const modal = sequenceModalHtml;

  const { container } = render(modal);

  const dialog = container.querySelector("#dialog");
  const open = container.querySelector("#open");
  const focusA = container.querySelector("#focusA");
  const focusB = container.querySelector("#focusB");
  const focusC = container.querySelector("#focusC");
  const focusD = container.querySelector("#focusD");
  const focusE = container.querySelector("#focusE");
  const focusF = container.querySelector("#focusF");
  const focusG = container.querySelector("#focusG");
  const walk1 = container.querySelector("#walk1");
  const walk2 = container.querySelector("#walk2");

  return { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, walk1, walk2 };
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

export function getRangeModalDom() {

  const { container } = render(rangeModalHtml);

  const dialog = container.querySelector("#dialog");
  const first = container.querySelector("#firstFocusA");
  const last = container.querySelector("#lastFocusBtn");
  const open = container.querySelector("#open");
  const close = container.querySelector("#close");
  const walk1 = container.querySelector("#walk1");
  const walk2 = container.querySelector("#walk2");
  const walk3 = container.querySelector("#walk3");

  return { container, dialog, first, last, open, close, walk1, walk2, walk3 };
}

export function getCoverModalDom() {

  const { container } = render(sequenceModalHtml);

  const dialog = container.querySelector("#dialog");
  const cover = dialog;
  const open = container.querySelector("#open");
  const focusA = container.querySelector("#focusA");
  const first = focusA;
  const focusB = container.querySelector("#focusB");
  const focusC = container.querySelector("#focusC");
  const focusD = container.querySelector("#focusD");
  const focusE = container.querySelector("#focusE");
  const focusF = container.querySelector("#focusF");
  const close = focusF;
  const focusG = container.querySelector("#focusG");
  const last = focusG;
  const walk2 = container.querySelector("#walk2");
  const walk1 = container.querySelector("#walk1");

  return { container, dialog, open, focusA, focusB, focusC, focusD, focusE, focusF, focusG, cover, first, last, close, walk2, walk1 };
}