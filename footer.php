<!-- Footer -->

<footer id="footer">

  <div class="lets-chat">
    <a href="https://djmisha.com/contact-dj-misha/" class="show-form" rel="nofollow"><img src="<?php bloginfo('template_directory'); ?>/images/expert.png" alt="Book Now, Let's Chat">
      <span>Book Now<br>Let's Chat</span>
    </a>
  </div>

  <div class="row">
    <div class="col-4 col-4-medium">
       <?php wp_nav_menu( array( 'theme_location' => 'footer', 'menu_class' => 'menu-footer-navigation' ) ); ?>
    </div>
    <div class="col-4 col-7-medium">
       <?php wp_nav_menu( array( 'theme_location' => 'services', 'menu_class' => 'services-navigation' ) ); ?>
     </div>
    <div class="col-4 col-12-medium">
      <aside>
        <p class="sentance">DJ Misha is a San Diego DJ for hire, specializing in weddings, parties, and corporate events, with expertise in EDM, house, and dance music. Mobile DJ services include sound systems and professional DJ gear.
        <br />
        <br />
        <b>Text or Call for a fast response <a href="tel:6197862664">(619) 786-2664</a></b>
      </p>
      </aside>
    </div>
  </div>

  <ul class="icons">
    <li>
      <a href="https://www.instagram.com/djmishasd/" class="icon brands fa-instagram" target="_blank" title="DJ Misha">
        <span class="label">DJ Misha</span>
      </a>
    </li>
    <li>
      <a href="https://www.google.com/maps/place/DJ+Misha+-+San+Diego+DJ+for+Events+Party+Weddings+Club+Affordable+Prices+House+Dance+Music/@32.7990179,-117.2530949,9z/data=!4m5!3m4!1s0x0:0x3fae10d8742ab418!8m2!3d32.7990179!4d-117.2530949" class="icon brands fa-google" target="_blank" title="San Diego DJ Google +" rel="noreferrer">
        <span class="label">San Diego DJ Google</span>
      </a>
    </li>
    <li>
      <a href="https://www.yelp.com/biz/dj-misha-san-diego-3" class="icon brands fa-yelp" target="_blank" title="San Diego DJ Yelp" rel="noreferrer">
        <span class="label">San Diego DJ Yelp</span>
      </a>
    </li>
    <li>
      <a href="https://www.facebook.com/djmishaSandiego" class="icon brands fa-facebook" target="_blank" title="San Diego DJ Facebook" rel="noreferrer">
        <span class="label">San Diego DJ Facebook</span>
      </a>
    </li>
    <li>
      <a href="https://djmisha.com/contact-dj-misha/" class="icon" title="Email San Diego DJ" rel="noreferrer"><i class="fas fa-envelope"></i>
        <span class="label" title="Booking San Diego DJ">Email San Diego DJ</span>
      </a>
    </li>
  </ul>

  <ul class="copyright">
    <li><?php do_action('reviews_markup'); ?></li>
    <li>&copy; <a href="<?php home_url( '/' ); ?>" title="<?php echo get_bloginfo( 'name', 'display'  ); ?>" rel="home">
      <?php bloginfo( 'name' ); ?>
      </a> | <a href="<?php bloginfo('url'); ?>/sitemap/">Sitemap</a></li>
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
