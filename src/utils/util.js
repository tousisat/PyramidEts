export const loadingButtonByClass = (buttonClass, isLoading) => {
  let element = document.getElementsByClassName(buttonClass);
  if (element.length > 0) {
    element = element[0];
  } else {
    return;
  }
  isLoading
    ? element.classList.add("is-loading")
    : element.classList.remove("is-loading");
};
