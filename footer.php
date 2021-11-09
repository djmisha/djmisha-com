<!-- Footer -->

<footer id="footer">

<!--   <div class="hidefooter">
    SHOW FOOTER
  </div>
 -->

  <div class="footer-show-form">
    <a href="https://djmisha.com/contact-dj-misha/" class="show-form" rel="nofollow"><img src="<?php bloginfo('template_directory'); ?>/images/expert.png" alt="Book Now, Let's Chat">
      <span>Book Now<br>Let's Chat</span>
    </a>
  </div>



   <div class="row">
      <div class="col-4 col-12-medium">
         <?php wp_nav_menu( array( 'theme_location' => 'footer', 'menu_class' => 'menu-footer-navigation' ) ); ?>
      </div>
      <div class="col-4 col-12-medium">
         <?php wp_nav_menu( array( 'theme_location' => 'services', 'menu_class' => 'services-navigation' ) ); ?>
       </div>
      <div class="col-4 col-12-medium">
        <aside>
         <p class="sentance">DJ Misha is a San Diego DJ for hire; corporate events, party, weddings, clubs, birthdays, nightlife and all occasions. San Diego DJs playing dancing, party and house music including EDM, club music, deep house, lounge, techno and can provide mobile DJ equipment with turntables and sound system. <br />
        <br />
        <b>Text or Call for a fast response <a href="tel:6197862664">(619) 786-2664</a></b></p>
          <p class="sentence2">Looking for <a href="http://sandiegohousemusic.com" target="_blank" rel="noreferrer noopener">House Music Events in San Diego</a>? Check out sandiegohousemusic.com for dance music events and dj mixes. 
        </aside>
      </div>
    </div>

  <footer class="major">
    <ul class="actions">
      <!-- <li> <a href="https://djmisha.com/contact-dj-misha/" class="button special fit">Hire San Diego DJ</a> </li> -->
    </ul>
  </footer>

  <ul class="icons">
    <li><a href="https://www.google.com/maps/place/DJ+Misha+-+San+Diego+DJ+for+Events+Party+Weddings+Club+Affordable+Prices+House+Dance+Music/@32.7990179,-117.2530949,9z/data=!4m5!3m4!1s0x0:0x3fae10d8742ab418!8m2!3d32.7990179!4d-117.2530949" class="icon brands fa-google" target="_blank" title="San Diego DJ Google +" rel="noreferrer"><span class="label">San Diego DJ Google</span></a></li>
    <li><a href="https://www.yelp.com/biz/dj-misha-san-diego-3" class="icon brands fa-yelp" target="_blank" title="San Diego DJ Yelp" rel="noreferrer"><span class="label">San Diego DJ Yelp</span></a></li>
    <li><a href="https://www.facebook.com/djmishaSandiego" class="icon brands fa-facebook" target="_blank" title="San Diego DJ Facebook" rel="noreferrer"><span class="label">San Diego DJ Facebook</span></a></li>
    <li><a href="https://twitter.com/smblife" class="icon brands fa-twitter" target="_blank" title="San Diego DJ Twitter" rel="noreferrer"><span class="label">San Diego DJ Twitter</span></a></li>
    <li><a href="https://djmisha.com/contact-dj-misha/" class="icon" title="Email San Diego DJ" rel="noreferrer"><i class="fas fa-envelope"></i><span class="label" title="Booking San Diego DJ">Email San Diego DJ</span></a></li>

  </ul>

  <ul class="copyright">
    <li><?php do_action('reviews_markup'); ?></li>
    <li>&copy; <a href="<?php home_url( '/' ); ?>" title="<?php echo get_bloginfo( 'name', 'display'  ); ?>" rel="home">
      <?php bloginfo( 'name' ); ?>
      </a> | <a href="<?php bloginfo('url'); ?>/sitemap/">Sitemap</a></li>
    <li><a href="http://asburymediagroup.com" title="San Diego Web Design" target="_blank" rel="noopener">San Diego Web Design</a> by <a href="http://asburymediagroup.com" title="Asbury Media Group" target="_blank"  rel="noreferrer noopener">Asbury Media Group</a></li>
  </ul>
  
  <!-- Scripts -->
  <script src="<?php bloginfo('template_url'); ?>/js/jquery.min.js"></script>
  <script src="<?php bloginfo('template_url'); ?>/js/jquery.scrolly.min.js"></script>
  <script src="<?php bloginfo('template_url'); ?>/js/jquery.dropotron.min.js"></script>
  <script src="<?php bloginfo('template_url'); ?>/js/jquery.scrollex.min.js"></script>
  <script src="<?php bloginfo('template_url'); ?>/js/browser.min.js"></script>
  <script src="<?php bloginfo('template_url'); ?>/js/breakpoints.min.js"></script>
  <script src="<?php bloginfo('template_url'); ?>/js/util.js"></script>
  <script src="<?php bloginfo('template_url'); ?>/js/main.js"></script>

  <script>

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
      function shakeKyle() {
        var kyle = $('.footer-show-form');
        if(kyle.hasClass('hello-shake')) {
          // console.log("removed");
          kyle.removeClass('hello-shake');
        }
        else {
          kyle.addClass('hello-shake');
          // console.log("added");
        }
      }
      setInterval(shakeKyle, 60000);
  });

  </script>


  <style type="text/css">

    /* Body */
    body, input, select, textarea {
      font-weight: 300;
    }

    h1 {
      font-size: 2em;
      line-height: 1.5em;
      letter-spacing: -0.025em;
    }
    /* Pop in Styles*/ 
    h1#logo {
      font-size: 100%;
    }

    span#logo {
      height: inherit;
      left: 1.25em;
      line-height: inherit;
      margin: 0;
      position: absolute;
      top: 0;
    }
    
    span#logo a {
      text-decoration: none;
      color: white;
      border-bottom: none;
    }

    .footer-show-form {
      font-size: 12px;
      line-height: 12px;
      text-align: center;
      -webkit-transition: all .2s ease-in-out;
      transition: all .2s ease-in-out;
      position: fixed;
      bottom: 20px;
      right: -90px;
    }

  @media only screen and (min-width: 1080px) {
    .footer-show-form {
      bottom: 20px;
    }
  }

  .footer-show-form.hithere {
    right: 10px;
  }

  @media only screen and (min-width: 768px) {
    .footer-show-form.hithere {
      right: 20px;
    }
  }

  .footer-show-form img {
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
    width: 70px;
    display: block;
    margin: 0 auto; 
  }

  @media only screen and (min-width: 768px) {
    .footer-show-form img {
      width: 90px;
    }
  }

  .footer-show-form a {
    color: #fff !important;
    font-size: 11px;
     line-height: 15px;
     letter-spacing: .5px;
  }
  .footer-show-form a span {
    background: #000;
    padding: 2px 4px;
    display: block;
    border-radius: 4px;
   
  }

  .footer-show-form:hover img {
    width: 120px;
  }


  .contact-page img {
    border: none;
    width: 100px;
    height: auto;
    margin-top: 40px;
  }

  @media only screen and (min-width: 768px) {
    .contact-page img {
      margin-left: 40px;
      width: 150px;
    }
  }

  .contact-page .footer-show-form {
    display: none;
  }


  .hello-shake {
    animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    perspective: 1000px;
  }

  @keyframes shake {
    10%, 90% {
      transform: translate3d(-1px, 0, 0);
    }
    
    20%, 80% {
      transform: translate3d(2px, 0, 0);
    }

    30%, 50%, 70% {
      transform: translate3d(-4px, 0, 0);
    }

    40%, 60% {
      transform: translate3d(4px, 0, 0);
    }
  }

  @keyframes rotatecircle {
      0% { -webkit-transform:rotate(0deg); }
  100% { -webkit-transform:rotate(-360deg); }
  }


  /* Video Styles*/ 
    #one img {
      opacity: 0;
    }
    #one .content {
      padding-top: 60px;
      padding-bottom: 60px;
    }
    #one h2 {
      line-height: 1.0em;
    }
    #one {
      position: relative;
    }
    #one video {
      position: absolute;
      top: 0px;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      margin: 0;
      padding: 0;
      -o-object-fit: cover;
      object-fit: cover;
      opacity: 1;
  }
  @media only screen and (max-width: 980px) {
        #one video {
        width: 100%;
        height: 400px;
      }
  }

  /*FOMRS*/

  .gform_legacy_markup_wrapper input:not([type="radio"]):not([type="checkbox"]):not([type="submit"]):not([type="button"]):not([type="image"]):not([type="file"]) {
    width: 100%;
  }




  /* GALLLERY */

  .ngg-widget img {
    border: none;
    margin: 0;
  }

  .icon i {
    font-size: 2em;
  }

  </style>

  <!-- Global site tag (gtag.js) - Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=UA-7759036-2"></script>
  <script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-7759036-2');
  </script>



  <?php wp_footer(); ?>


</footer>
