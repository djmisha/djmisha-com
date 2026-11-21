/* Custom JS for djmisha.com */

/* Attach Video on Homepage*/

const attachVideo = () => {
  const myVideoWrap = document.querySelector("#one .home-video");

  if (myVideoWrap) {
    const mobileVideo = "video-mobile.mp4";
    const desktopVideo = "video.mp4";
    let file;

    if (window.innerWidth > 768) {
      file = desktopVideo;
    } else {
      file = mobileVideo;
    }

    function createVideoMarkup(item) {
      const videoMarkup =
        '<video playsinline autoplay muted loop poster="/images/home-video-first-frame.webp" class="bgvid"><source src="https://grooverooster.com/images/djmisha/' +
        item +
        '" type="video/mp4"></video>';
      return videoMarkup;
    }

    myVideoWrap.innerHTML = createVideoMarkup(file);

    if (typeof myVideoWrap.querySelector === "function") {
      const video = myVideoWrap.querySelector("video");
      const section = document.querySelector("#one");
      if (video && section && section.classList) {
        video.addEventListener("playing", () => {
          section.classList.add("home-video-playing");
        });
      }
    }
  }
};

const loadHomeVideoWhenNear = () => {
  if (typeof IntersectionObserver !== "function") {
    setTimeout(attachVideo, 1000);
    return;
  }

  const section = document.querySelector("#one");
  if (!section) return;

  let started = false;
  let observer;
  const listenerOptions = { passive: true };
  const scrollKeys = {
    " ": true,
    Spacebar: true,
    PageDown: true,
    PageUp: true,
    ArrowDown: true,
    ArrowUp: true,
    ArrowLeft: true,
    ArrowRight: true,
    Home: true,
    End: true,
  };

  const armObserver = () => {
    if (started) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start();
      },
      { threshold: 0.5 },
    );
    observer.observe(section);
  };

  const start = () => {
    if (started) return;
    started = true;
    if (observer) observer.disconnect();
    window.removeEventListener("scroll", onScroll, listenerOptions);
    window.removeEventListener("wheel", start, listenerOptions);
    window.removeEventListener("touchstart", start, listenerOptions);
    window.removeEventListener("keydown", onKey, listenerOptions);
    window.removeEventListener("load", armObserver);
    attachVideo();
  };

  const onScroll = () => {
    if (window.scrollY === 0) return;
    start();
  };

  const onKey = (event) => {
    if (!event || !scrollKeys[event.key]) return;
    start();
  };

  if (window.scrollY > 0) {
    start();
    return;
  }

  window.addEventListener("scroll", onScroll, listenerOptions);
  window.addEventListener("wheel", start, listenerOptions);
  window.addEventListener("touchstart", start, listenerOptions);
  window.addEventListener("keydown", onKey, listenerOptions);

  if (document.readyState === "complete") {
    armObserver();
  } else {
    window.addEventListener("load", armObserver);
  }
};

loadHomeVideoWhenNear();

/* Attach Video on Homepage*/

const attachWeddingVideo = () => {
  const myVideoWrap = document.querySelector(".wedding-dj-video");
  if (!myVideoWrap) return;

  const removeImage = () => {
    const img = document.querySelector(".wedding-dj-image");
    if (img) img.remove();
  };

  const videoMarkup =
    '<video playsinline autoplay muted loop poster="/images/dj-service-wedding.jpg"><source src="https://grooverooster.com/images/djmisha/wedding-dj.mp4" type="video/mp4"></video>';

  if (window.innerWidth < 768) {
    myVideoWrap.innerHTML = videoMarkup;
    removeImage();
  }
};

const detectScrollforWeddingVideo = function () {
  const distMarker = 3860;
  const scrolledFromTop = $(window).scrollTop();

  if (scrolledFromTop > distMarker) {
    attachWeddingVideo();
    $(window).off("scroll", detectScrollforWeddingVideo);
  }
};

$(window).scroll(detectScrollforWeddingVideo);

/* Book Your Date, Let's Connect */

const stickyContact = () => {
  const stickyContactTop = 1200;
  const scrollTop = $(window).scrollTop();

  if (scrollTop > stickyContactTop) {
    $(".lets-chat").addClass("fly-out");
    $(window).off("scroll", stickyContact);
  }
};

$(window).scroll(stickyContact);

/* Shake Book now */

$(function () {
  function shakeChatCTA() {
    const djmisha = $(".lets-chat");
    if (djmisha.hasClass("hello-shake")) {
      djmisha.removeClass("hello-shake");
    } else {
      djmisha.addClass("hello-shake");
    }
  }
  setInterval(shakeChatCTA, 60000);
});

/* Homepage Testimonials IFFE */

(function () {
  let testis = document.querySelectorAll(".home-testi");

  if (testis.length > 0) {
    const showTesti = (e) => {
      e.target.classList.toggle("testi-partial");
      e.target.classList.toggle("testi-full");
    };

    for (let i = testis.length - 1; i >= 0; i--) {
      testis[i].classList.add("testi-partial");
      testis[i].addEventListener("click", showTesti);
    }
  }
})();
