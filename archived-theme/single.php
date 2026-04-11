<?php include 'header.php'; ?>

<body <?php body_class(''); ?>>
    <div id="page-wrapper">
        <?php include 'navigation.php'; ?>
        <!-- Main -->
        <div id="main" class="wrapper style1">
            <div class="container">
                <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
                <header class="major">
                    <h1><a href="<?php the_permalink() ?>" rel="bookmark">
                        <?php the_title(); ?></a>
                    </h1>
                </header>
                <div class="row gtr-150">
                    <div class="col-8 col-12-medium">
                        <section id="content post-<?php the_ID(); ?>">
                            <?php the_content(__( '(more...)')); ?>
                            <div class="clear"></div>
                            <p class="tags">
                                    <?php the_tags( '', '', '' ); ?>
                                </p>
                            <?php endwhile; else: ?>
                            <p>
                                <?php _e( 'Sorry, no posts matched your criteria.'); ?>
                            </p>
                            <?php endif; ?>
                            <?php posts_nav_link( ' &#8212; ', __( '&laquo; Previous Page'), __( 'Next Page &raquo;')); ?>
                        </section>
                    </div>
                    <div class="col-4 col-12-medium">
                        <?php if ( is_active_sidebar( 'page-sidebar' ) ) { ?>
                        <?php dynamic_sidebar( 'page-sidebar' ); ?>
                        <?php } ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php include 'footer.php'; ?>

</body>
</html>