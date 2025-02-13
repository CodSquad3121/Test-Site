document.addEventListener("DOMContentLoaded", function() {
    let progress = 0;
    const loadingProgress = document.querySelector(".loading-progress");
    const loadScreen = document.getElementById("load-screen");
const loadingText = document.querySelector(".loading-text");
    let intervalId;

    // Wrap each letter in a span
    const text = loadingText.textContent;
    loadingText.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.textContent = text[i];
        span.style.animationDelay = `${i * 0.1}s`;
        loadingText.appendChild(span);
    }

    function updateProgress() {
        if (progress < 100) {
            progress += 1;
            loadingProgress.style.width = progress + "%";
        } else {
            clearInterval(intervalId);
            loadScreen.style.display = "none";
        }
    }

    function startProgress() {
        intervalId = setInterval(updateProgress, 50); // Adjust the speed of the loading bar here
    }

    startProgress();
});