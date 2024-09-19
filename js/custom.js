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
        '<video playsinline autoplay muted loop poster="https://djmisha.com/wordpress/wp-content/themes/djmisha-LANDED/images/pic02.jpg" class="bgvid"><source src="https://www.sandiegohousemusic.com/images/djmisha/' +
        item +
        '" type="video/mp4"></video>';
      return videoMarkup;
    }

    myVideoWrap.innerHTML = createVideoMarkup(file);
  }
};

setTimeout(attachVideo, 1000);

/* Attach Video on Homepage*/

const attachWeddingVideo = () => {
  const myVideoWrap = document.querySelector(".wedding-dj-video");
  if (!myVideoWrap) return;

  const removeImage = () => {
    const img = document.querySelector(".wedding-dj-image");
    if (img) img.remove();
  };

  const videoMarkup =
    '<video playsinline autoplay muted loop poster="https://djmisha.com/wordpress/wp-content/uploads/2023/03/dj-service-wedding.jpg"><source src="https://www.sandiegohousemusic.com/images/djmisha/wedding-dj.mp4" type="video/mp4"></video>';

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

/* Book now, Lets Chat */

const stickyContact = () => {
  const stickyContactTop = 1200;
  const scrollTop = $(window).scrollTop();
  console.log(scrollTop);

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

    for (var i = testis.length - 1; i >= 0; i--) {
      testis[i].classList.add("testi-partial");
      testis[i].addEventListener("click", showTesti);
    }
  }
})();
