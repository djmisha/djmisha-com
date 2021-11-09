<?php include 'header.php'; ?>
<body <?php body_class(); ?>>
  <div id="page-wrapper">
    <?php include 'navigation.php'; ?>
  <div id="main" class="wrapper style1 category">
    <div class="container">
      <div class="box alt">
        <div class="row uniform">
          <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
          <section class="col-4 col-12-xsmall"> <a href="<?php the_permalink() ?>" rel="bookmark">
            <?php the_post_thumbnail( 'medium'); ?>
            </a>
            <h3>
              <a href="<?php the_permalink() ?>" rel="bookmark">
                <?php the_title(); ?>
              </a>
            </h3>
            <?php the_excerpt(); ?>            
          </section>
          <?php endwhile; else: ?>
          <?php endif; ?>
        </div>
      </div>
      <?php posts_nav_link( ' &#8212; ', __( '&laquo; Previous Page'), __( 'Next Page &raquo;')); ?>
    </div>
  </div>
  </div>
<?php include 'footer.php'; ?>
</body>
</html>