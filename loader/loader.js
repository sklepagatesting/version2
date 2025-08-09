// Create and inject styles
const style = document.createElement("style");
style.textContent = `
  html, body {
    background: white;
    margin: 0;
    padding: 0;
  }
  #page-transition {
    position: fixed;
    bottom: 0;
    left: 50%;
    width: 60px;
    height: 10px;
    background: white;
    border-radius: 50%;
    transform: translateX(-50%) translateY(0) scale(1);
    z-index: 10000;
    pointer-events: none;
    transition:
      bottom 1s ease-in-out,
      width 1s ease-in-out,
      height 1s ease-in-out,
      transform 1s ease-in-out;
    opacity: 0;
  }
  #page-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0);
    pointer-events: none;
    z-index: 9999;
    transition: background 1s ease-in-out;
    opacity: 0;
  }
`;
document.head.appendChild(style);

// Create transition elements
document.body.insertAdjacentHTML("beforeend", `
  <div id="page-transition"></div>
  <div id="page-overlay"></div>
`);

document.addEventListener("DOMContentLoaded", () => {
  const transitionEl = document.getElementById("page-transition");
  const overlayEl = document.getElementById("page-overlay");

  function triggerTextAnimation() {
    const lines = document.querySelectorAll(".text-line");
    lines.forEach((line, i) => {
      line.style.animationDelay = `${i * 0.2}s`;
      line.classList.add("animate-text");
    });
  }

  function coverTransition(done) {
    // Expand to cover the page
    transitionEl.style.opacity = "1";
    overlayEl.style.opacity = "1";

    transitionEl.style.bottom = "50%";
    transitionEl.style.width = "100vw";
    transitionEl.style.height = "100vh";
    transitionEl.style.borderRadius = "0";
    transitionEl.style.transform = "translateX(-50%) translateY(50%) scale(1)";
    overlayEl.style.background = "rgba(0,0,0,0.5)";

    setTimeout(done, 1000); // Continue after animation
  }

  function hideTransitionElements() {
    transitionEl.style.opacity = "0";
    overlayEl.style.opacity = "0";
  }

  // Init Barba.js
  barba.init({
    transitions: [
      {
        name: "custom-transition",
        async leave(data) {
          await new Promise((resolve) => coverTransition(resolve)); // Animate to full cover
        },
        async enter(data) {
          hideTransitionElements(); // Hide immediately after page swap
          triggerTextAnimation();
        },
        async once(data) {
          setTimeout(() => {
            document.body.style.background = "transparent";
            document.documentElement.style.background = "transparent";
            triggerTextAnimation();
          }, 50);
        }
      }
    ]
  });
});
