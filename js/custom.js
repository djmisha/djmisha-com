/* Custom JS for djmisha.com */


    /* Attach Video on Homepage*/

    function attachVideo() {
      var myVideoWrap = document.querySelector('#one .home-video');
          
      if(myVideoWrap) {
      var mobileVideo ='video-mobile.mp4';
      var desktopVideo ='video.mp4';
      let thevid = "";

        if(window.innerWidth > 768) {
           thevid = desktopVideo;
        }
        else {
           thevid = mobileVideo;
        }

      myVideoWrap.innerHTML = createVideoMarkup(thevid);

        function createVideoMarkup(item) {
          let videoMarkup = '<video playsinline autoplay muted loop poster=\"https://djmisha.com/wordpress/wp-content/themes/djmisha-LANDED/images/pic02.jpg\" class=\"bgvid\"><source src=\"https://djmisha.com/images/' + item +'\" type=\"video/mp4\"></video>';
          return videoMarkup;
        }
      }
    }

    setTimeout(attachVideo, 1000)

    // Pop in Book now

      var stickyContactTop = 1200;

      var stickyContact = function(){
        var scrollTop = $(window).scrollTop();

        if (scrollTop > stickyContactTop) {
          $('.footer-show-form').addClass('hithere');
        } else {
          // $('.footer-show-form').removeClass('hithere');
        }
      };

      $(window).scroll(function() {
        stickyContact();
      });

    /* Shake Book now */

    $(function () {
        function shakeChatCTA() {
          var djmisha = $('.footer-show-form');
          if(djmisha.hasClass('hello-shake')) {
            djmisha.removeClass('hello-shake');
          }
          else {
            djmisha.addClass('hello-shake');
          }
        }
        setInterval(shakeChatCTA, 60000);
    });


/* Homepage Testimonials Iffe */

(function() {
	let testis = document.querySelectorAll('.home-testi');

	const showTesti = (e) => {
		e.target.classList.toggle("testi-partial");
		e.target.classList.toggle("testi-full");
	}	

	for (var i = testis.length - 1; i >= 0; i--) {
		testis[i].classList.add('testi-partial');
		testis[i].addEventListener('click', showTesti)
	}
})();
