function renderLoading() {
  let loadingDiv = document.createElement('div');
  loadingDiv.classList.add('loader');
  return loadingDiv;
}

function renderNotFound() {
  let errorMessage = document.createElement('h1');
  errorMessage.textContent = 'Resource not found';
  return errorMessage;
}

function renderServerError(status) {
  let errorMessage = document.createElement('h1');
  errorMessage.textContent = `Other HTTP error: ${status}`;
  return errorMessage;
}

function renderBadData() {
  let errorMessage = document.createElement('h1');
  errorMessage.textContent = `Incorrect data format`;
  return errorMessage;
}

function renderUnknownError() {
  let errorMessage = document.createElement('h1');
  errorMessage.textContent = `Something went wrong with your request`;
  return errorMessage;
}

export { renderLoading, 
  renderNotFound, 
  renderServerError, 
  renderBadData,
  renderUnknownError };