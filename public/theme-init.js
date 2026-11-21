(function () {
  try {
    var saved = localStorage.getItem("image-compare-theme");
    var theme =
      saved === "dark" || saved === "gray" || saved === "light" ? saved : "dark";
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "dark";
  }
})();
