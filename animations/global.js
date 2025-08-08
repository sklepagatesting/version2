// textAnimations.js
document.addEventListener('fontLoadedAndPageVisible', () => {
  console.log('Font loaded and page visible, initializing text animations.');

  // Combine both classes
  const textElements = document.querySelectorAll('.rise, .sliding-up');

  textElements.forEach(textElement => {
    // Avoid double-processing if innerHTML already contains spans
    if (textElement.querySelector('span')) return;

    const words = textElement.textContent.trim().split(' ');
    textElement.innerHTML = words.map((word, index) => {
      const separator = (index < words.length - 1) ? '&nbsp;' : '';
      return `<span style="animation-delay: ${index * 0.1}s">${word}${separator}</span>`;
    }).join('');

    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(textElement);
  });
});





 const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const textLine = entry.target.querySelector('.text-line');
        if (textLine) {
          textLine.classList.add('animate');
          textLine.style.animationDelay = `${i * 1}s`; // apply delay when animating
          observer.unobserve(entry.target); // stop observing to prevent repeat
        }
      }
    });
  }, {
    threshold: 1 // lower threshold for small text blocks
  });

  document.querySelectorAll('.text-container').forEach(container => {
    observer.observe(container);
  });



function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|Tablet|Touch/i.test(navigator.userAgent);
  }

  function setMobileViewportHeight() {
    if (!isMobileDevice()) return;

    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  window.addEventListener('DOMContentLoaded', setMobileViewportHeight);
  window.addEventListener('resize', setMobileViewportHeight);




  // Image Updater
  function showImage(target) {
  if (!target) return;

  const mobile = target.dataset.imgMobile;
  const tablet = target.dataset.imgTablet;
  const desktop = target.dataset.img;

  let newSrc = desktop;
  const width = window.innerWidth;

  if (width <= 767 && mobile) {
    newSrc = mobile;
  } else if (width <= 1023 && tablet) {
    newSrc = tablet;
  }

  if (!newSrc || newSrc === lastSrc) return;

  lastSrc = newSrc;

  // Update active state
  if (lastHovered && lastHovered !== target) {
    lastHovered.classList.remove("bg-gray-100");
  }
  target.classList.add("bg-gray-100");
  lastHovered = target;

  // Speed calculation
  const now = performance.now();
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  const dt = now - lastMoveTime;
  const distance = dt > 0 ? Math.sqrt(dx * dx + dy * dy) : 0;
  const speed = dt > 0 ? distance / dt : 0;
  const fastThreshold = 0.5;
  const duration = speed > fastThreshold ? 0.2 : 0.4;

  // Animate image transition
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

