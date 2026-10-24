// Product screenshot slideshow: advances every few seconds, pauses on hover or keyboard focus,
// and never advances on its own for visitors who ask for reduced motion.
(function () {
  const SLIDE_DURATION_MS = 5000;

  document.querySelectorAll('[data-slideshow]').forEach(function (slideshow) {
    const slides = Array.from(slideshow.querySelectorAll('.slide'));
    const dots = Array.from(slideshow.querySelectorAll('.slide-dot'));
    const previousButton = slideshow.querySelector('[data-slide-previous]');
    const nextButton = slideshow.querySelector('[data-slide-next]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeIndex = 0;
    let timerId = null;

    if (slides.length < 2) {
      return;
    }

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      dots.forEach(function (dot, dotIndex) {
        dot.setAttribute('aria-current', String(dotIndex === activeIndex));
      });
    }

    function stopTimer() {
      window.clearInterval(timerId);
      timerId = null;
    }

    function startTimer() {
      if (prefersReducedMotion || timerId !== null) {
        return;
      }
      timerId = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, SLIDE_DURATION_MS);
    }

    function restartTimer() {
      stopTimer();
      startTimer();
    }

    previousButton.addEventListener('click', function () {
      showSlide(activeIndex - 1);
      restartTimer();
    });
    nextButton.addEventListener('click', function () {
      showSlide(activeIndex + 1);
      restartTimer();
    });
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        restartTimer();
      });
    });

    slideshow.addEventListener('mouseenter', stopTimer);
    slideshow.addEventListener('mouseleave', startTimer);
    slideshow.addEventListener('focusin', stopTimer);
    slideshow.addEventListener('focusout', startTimer);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopTimer();
      } else {
        startTimer();
      }
    });

    slideshow.classList.add('is-enhanced');
    showSlide(0);
    startTimer();
  });
})();
