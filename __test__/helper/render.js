export default html => {

  const container = document.createElement('div');

  container.innerHTML = html;

  const queryByTestId = testId => {
    return container.querySelector(`[data-testid="${testId}"]`);
  };

  document.body.innerHTML = '';
  document.body.append(container);

  return {
    container,
    queryByTestId,
  };
};