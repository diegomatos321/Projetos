window.addEventListener("load", () => {
  const container = document.getElementById("mansory-grid");
  const mansory = new Masonry(container, {
    // options
    columnWidth: 80,
    itemSelector: ".mansory-item",
    fitWidth: true,
    gutter: 5,
  });
})