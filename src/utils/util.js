import { TABS } from "./constant";

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

export const tabToID = tab => {
  switch (tab) {
    case TABS.MIN:
      return 1;
    case TABS.MAX:
      return 2;
    case TABS.POS1:
      return 3;
    case TABS.POS2:
      return 4;
    case TABS.POS3:
      return 5;
    default:
      return -1;
  }
};
