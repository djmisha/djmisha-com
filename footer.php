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
    <li><a href="https://www.instagram.com/djmishasd/" class="icon brands fa-instagram" target="_blank" title="DJ Misha Instagram" rel="noreferrer"><span class="label">DJ Misha Instagram</span></a></li>
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
    <script src="<?php bloginfo('template_url'); ?>/js/custom.js"></script>

  
 

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
