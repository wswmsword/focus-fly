export const childs = `
<div id="root">
  <div id="parent">
    <div id="child1"></div>
    <div id="child2"></div>
  </div>
</div>
`;

export const descendants = `
<div id="parent">
  <div>
    <div id="child1"></div>
  </div>
  <div></div>
  <div>
    <div id="child2"></div>
  </div>
</div>
`;

export const nestedDescendants = `
<div id="root">
  <div id="child1">
    <div id="child2"></div>
  </div>
</div>
`;