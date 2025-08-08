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





function startTextAnimations() {
  document.querySelectorAll('.text-container .text-line').forEach((line, i) => {
    line.classList.add('animate');
    line.style.animationDelay = `${i * 0.07}s`; // matches animation duration
  });
}




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


  












document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("playReel");
  const overlayBg = document.getElementById("videoOverlayBg");
  let expanded = false;
  let placeholder = null;

  function toggleVideoOverlay() {
    if (!expanded) {
      // Create placeholder to keep layout
      placeholder = document.createElement("div");
      placeholder.style.width = `${video.offsetWidth}px`;
      placeholder.style.height = `${video.offsetHeight}px`;
      video.parentNode.insertBefore(placeholder, video);

      // Get current video position and size
      const rect = video.getBoundingClientRect();

      // Move video to body to avoid clipping
      document.body.appendChild(video);

      // Set video fixed position & size at current spot
      gsap.set(video, {
        position: "fixed",
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        borderRadius: "0px",
        zIndex: 9999
      });

      // Show overlay behind video
      overlayBg.style.pointerEvents = "auto";
      gsap.to(overlayBg, {
        opacity: 1,
        duration: 0.8,
        ease: "power3.inOut"
      });

      // Decide target size based on viewport width
      if (window.innerWidth > 768) {
        // Full viewport cover (width & height)
        gsap.to(video, {
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          width: window.innerWidth,
          height: window.innerHeight,
          borderRadius: "8px",
          duration: 0.8,
          ease: "power3.inOut"
        });
      } else {
        // Keep 90vw width with 16:9 ratio for smaller screens
        const width = window.innerWidth * 0.9;
        gsap.to(video, {
          top: "50%",
          left: "50%",
          xPercent: -50,
          yPercent: -50,
          width: width,
          height: width * (9 / 16),
          borderRadius: "8px",
          duration: 0.8,
          ease: "power3.inOut"
        });
      }

      document.body.classList.add("overlay-active");
    } else {
      // Animate back to placeholder position & size
      const rect = placeholder.getBoundingClientRect();

      gsap.to(video, {
        top: rect.top,
        left: rect.left,
        xPercent: 0,
        yPercent: 0,
        width: rect.width,
        height: rect.height,
        borderRadius: "0px",
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          // Restore video to original container & styles
          video.style.position = "";
          video.style.top = "";
          video.style.left = "";
          video.style.width = "";
          video.style.height = "";
          video.style.borderRadius = "";
          video.style.zIndex = "";

          placeholder.parentNode.insertBefore(video, placeholder);
          placeholder.remove();
          placeholder = null;
        }
      });

      // Hide overlay
      gsap.to(overlayBg, {
        opacity: 0,
        pointerEvents: "none",
        duration: 0.8,
        ease: "power3.inOut"
      });

      document.body.classList.remove("overlay-active");
    }
    expanded = !expanded;
  }

  // Toggle video on click
  video.addEventListener("click", toggleVideoOverlay);
  overlayBg.addEventListener("click", toggleVideoOverlay);

  // Update video size on window resize if expanded
  window.addEventListener("resize", () => {
    if (expanded) {
      if (window.innerWidth > 768) {
        gsap.set(video, {
          width: window.innerWidth,
          height: window.innerHeight
        });
      } else {
        const width = window.innerWidth * 0.9;
        gsap.set(video, {
          width: width,
          height: width * (9 / 16)
        });
      }
    }
  });
});
