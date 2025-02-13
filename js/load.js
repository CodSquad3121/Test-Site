document.addEventListener("DOMContentLoaded", function() {
    let progress = 0;
    const loadingProgress = document.querySelector(".loading-progress");
    const loadingText = document.querySelector(".loading-text");

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
            progress += 2;
            loadingProgress.style.width = progress + "%";
            setTimeout(updateProgress, 50); // Adjust the speed of the loading bar here
        } else {
            document.getElementById("load-screen").style.display = "none";
        }
    }

    updateProgress();
});