document.addEventListener("DOMContentLoaded", () => {
  // --- Register GSAP Plugin ---
  gsap.registerPlugin(ModifiersPlugin);

  const scroller = document.getElementById("scroller");

  // --- Duplicate for seamless loop ---
  scroller.innerHTML += scroller.innerHTML;
  const scrollWidth = scroller.scrollWidth / 2;

  // --- Get initial offset from first card ---
  const firstCard = scroller.children[0];
  const cardStyle = window.getComputedStyle(firstCard);
  const marginRight = parseFloat(cardStyle.marginRight);
  const initialOffset = marginRight;

  let position = initialOffset;
  let velocity = 0;
  let scrollAllowed = false; // 🚫 Block all scroll input initially

  // --- Set initial scroll position ---
  gsap.set(scroller, { x: initialOffset });

  const cards = scroller.children;

  // --- Prevent scroller collapsing during animation ---
  const cardHeight = cards[0].offsetHeight;
  scroller.style.height = cardHeight + "px";
  scroller.style.overflow = "hidden";

  // --- GPU-optimized initial state for cards ---
  gsap.set(cards, {
    scaleY: 0,
    transformOrigin: "bottom right",
    willChange: "transform"
  });

  // --- SCROLL LOCK HELPERS ---
  const preventScroll = (e) => e.preventDefault();

  const keyScrollBlock = (e) => {
    const blocked = [32, 33, 34, 35, 36, 37, 38, 39, 40];
    if (blocked.includes(e.keyCode)) e.preventDefault();
  };

  const lockScroll = () => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', keyScrollBlock, { passive: false });
  };

  const unlockScroll = () => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.height = '';

    window.removeEventListener('wheel', preventScroll, { passive: false });
    window.removeEventListener('touchmove', preventScroll, { passive: false });
    window.removeEventListener('keydown', keyScrollBlock, { passive: false });
  };

  // ✅ Lock all scrolling and inputs immediately
  lockScroll();

  // --- INTRO DELAY BASED ON FIRST VISIT ---
  const isFirstVisit = sessionStorage.getItem("hasVisited") !== "true";
  const introDelay = isFirstVisit ? 4000 : 2500;
  sessionStorage.setItem("hasVisited", "true");

  // --- INTRO ANIMATION ---
  setTimeout(() => {
    const fastDuration = 2;
    const fastDistance = scrollWidth * 1.5;

    const tl = gsap.timeline({
      onComplete: () => {
        // ✅ Fully unlock after final offset is applied
        position = parseFloat(gsap.getProperty(scroller, "x"));
        scroller.style.height = "";
        scroller.style.overflow = "";

        unlockScroll();     // ✅ Allow normal page scrolling
        scrollAllowed = true; // ✅ Allow input to control carousel
      }
    });

    // Reveal cards + scroll carousel
    tl.to(cards, {
      scaleY: 1,
      duration: 1,
      ease: "power4.out"
    }, 0);

    tl.to(scroller, {
      x: `-=${fastDistance}`,
      duration: fastDuration,
      ease: "power4.out",
      modifiers: {
        x: gsap.utils.unitize(x => {
          const raw = parseFloat(x);
          const looped = raw % scrollWidth;
          return looped;
        })
      }
    }, 0);
  }, introDelay);

  // --- WHEEL INPUT (disabled until scrollAllowed) ---
  window.addEventListener("wheel", (e) => {
    if (!scrollAllowed) return;
    velocity += e.deltaY * 0.05;
  }, { passive: true });

  // --- TOUCH INPUT (disabled until scrollAllowed) ---
  const touchScrollMultiplier = 0.12;
  let startY;
  let isDraggingDown = false;

  window.addEventListener("touchstart", (e) => {
    if (!scrollAllowed) return;
    startY = e.touches[0].clientY;
    velocity = 0;
    isDraggingDown = false;
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!scrollAllowed) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) isDraggingDown = true;

    velocity += -deltaY * touchScrollMultiplier;
    startY = currentY;

    if (window.scrollY === 0 && isDraggingDown) {
      e.preventDefault();
    }
  }, { passive: false });

  // --- GSAP Infinite Carousel Scroll Logic ---
  gsap.ticker.add(() => {
    if (Math.abs(velocity) > 0.001) {
      position -= velocity;
      velocity *= 0.94;

      if (position <= -scrollWidth) {
        position += scrollWidth;
      }
      if (position >= 0) {
        position -= scrollWidth;
      }

      gsap.set(scroller, { x: position });
    }
  });
});











const currentImage = document.getElementById("image-current");
const nextImage = document.getElementById("image-next");
const titles = document.querySelectorAll(".article-title");

let lastSrc = null;
let lastHovered = null;
let lastMoveTime = performance.now();
let lastX = 0;
let lastY = 0;

function showImage(target) {
  const newSrc = target.dataset.img;
  if (!newSrc || newSrc === lastSrc) return;

  lastSrc = newSrc;

  // <<< Update active state
  if (lastHovered && lastHovered !== target) {
    lastHovered.classList.remove("bg-gray-100");
  }
  target.classList.add("bg-gray-100");
  lastHovered = target;

  // --- Speed calculation for dynamic duration ---
  const now = performance.now();
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  const dt = now - lastMoveTime;
  const distance = dt > 0 ? Math.sqrt(dx * dx + dy * dy) : 0;
  const speed = dt > 0 ? distance / dt : 0;
  const fastThreshold = 0.5;
  const duration = speed > fastThreshold ? 0.2 : 0.4;

  // <<< Animate image transition
  gsap.killTweensOf([currentImage, nextImage]);

  nextImage.src = newSrc;
  gsap.set(nextImage, { scale: 1.1, opacity: 0, zIndex: 2 });
  gsap.set(currentImage, { zIndex: 1 });

  gsap.to(nextImage, {
    opacity: 1,
    scale: 1,
    duration,
    ease: "power2.out",
    onComplete: () => {
      currentImage.src = newSrc;
      gsap.set(currentImage, { opacity: 1 });
      gsap.set(nextImage, { opacity: 0 });
    }
  });
}

document.addEventListener("mousemove", (e) => {
  lastX = e.clientX;
  lastY = e.clientY;
  lastMoveTime = performance.now();

  const hoveredTitle = [...titles].find(title => title.contains(e.target));

  if (hoveredTitle && hoveredTitle !== lastHovered) {
    showImage(hoveredTitle);
  }
});

// <<< REMOVED hideImage() + mouseleave listener

// --- Initial setup ---
gsap.set(currentImage, { opacity: 0, zIndex: 1 });
gsap.set(nextImage, { opacity: 0, zIndex: 2 });
