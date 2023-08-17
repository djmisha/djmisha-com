/* Custom JS for djmisha.com */

/* Attach Video on Homepage*/

function attachVideo() {
  const myVideoWrap = document.querySelector('#one .home-video');
      
  if (myVideoWrap) {
    const mobileVideo ='video-mobile.mp4';
    const desktopVideo ='video.mp4';
    let file;

    if (window.innerWidth > 768) {
       file = desktopVideo;
    } else {
       file = mobileVideo;
    }
    
    function createVideoMarkup(item) {
      const videoMarkup = '<video playsinline autoplay muted loop poster=\"https://djmisha.com/wordpress/wp-content/themes/djmisha-LANDED/images/pic02.jpg\" class=\"bgvid\"><source src=\"https://www.sandiegohousemusic.com/images/djmisha/' + item +'\" type=\"video/mp4\"></video>';
      return videoMarkup;
    }

    myVideoWrap.innerHTML = createVideoMarkup(file);
  }
}

setTimeout(attachVideo, 1000)

// Book now, Lets Chat

var stickyContactTop = 1200;

var stickyContact = function(){
  var scrollTop = $(window).scrollTop();

  if (scrollTop > stickyContactTop) {
    $('.lets-chat').addClass('fly-out');
  } 
};

$(window).scroll(function() {
  stickyContact();
});

/* Shake Book now */

$(function () {
    function shakeChatCTA() {
      var djmisha = $('.lets-chat');
      if (djmisha.hasClass('hello-shake')) {
        djmisha.removeClass('hello-shake');
      } else {
        djmisha.addClass('hello-shake');
      }
    }
    setInterval(shakeChatCTA, 60000);
});


/* Homepage Testimonials IFFE */

(function() {
	let testis = document.querySelectorAll('.home-testi');

  if (testis.length > 0) {
  	const showTesti = (e) => {
  		e.target.classList.toggle("testi-partial");
  		e.target.classList.toggle("testi-full");
  	}	

  	for (var i = testis.length - 1; i >= 0; i--) {
  		testis[i].classList.add('testi-partial');
  		testis[i].addEventListener('click', showTesti)
  	}
  }
})();



// Video Issue

// https://stackoverflow.com/questions/27712778/video-plays-in-other-browsers-but-not-safari

// https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/CreatingVideoforSafarioniPhone/CreatingVideoforSafarioniPhone.html#//apple_ref/doc/uid/TP40006514-SW6