let dotsNum = 0;
let updateInterval = null;

const loadingOverlay = document.getElementById("loading-overlay");

const showOverlay = () => {
  dotsNum = 0;

  loadingOverlay.style.display = "flex";
  console.log(document.querySelector("#loading-overlay p"));

  updateInterval = setInterval(() => {
    dotsNum += 1;
    if (dotsNum > 3) dotsNum = 1;

    document.querySelector("#loading-overlay p span").innerHTML = ".".repeat(
      dotsNum
    );
  }, 500);
};

const hideOverlay = () => {
  clearInterval(updateInterval);
  loadingOverlay.style.display = "none";
};

export { showOverlay, hideOverlay };
