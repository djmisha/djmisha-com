<?php

register_nav_menu( 'primary', __( 'Primary Menu', 'twentytwelve' ) );

register_nav_menu( 'footer', __( 'Footer Menu', 'twentytwelve' ) );

register_nav_menu( 'services', __( 'Services Menu', 'twentytwelve' ) );

function custom_excerpt_length( $length ) {
	return 30;
}

add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

add_theme_support( 'post-thumbnails' );


register_sidebar(array(
	'id' => 'page-sidebar',
	'name' => 'Page Sidebar',
	'before_widget' => '<section id="sidebar"><section>',
	'after_widget' => ' </section><hr />',
	'before_title' => '<h3>',
	'after_title' => '</h3>',
));


register_sidebar(array(
	'id' => 'contact-sidebar',
	'name' => 'Contact Sidebar',
	'before_widget' => '<section id="sidebar"><section>',
	'after_widget' => ' </section><hr />',
	'before_title' => '<h3>',
	'after_title' => '</h3>',
));	



// Sitemap shortcode [sitemap omit="1051,432"]
function sitemap_function( $atts ){
  ob_start();  ?>

  <ul>
    <?php wp_list_pages(
      array(
       'title_li' => '',
       'exclude' => $atts['omit'],
       'depth' => $atts['depth']
     ) ); ?>
   </ul>
   <?php
   $sitemap = ob_get_clean();
   return $sitemap;
 }
 add_shortcode( 'sitemap', 'sitemap_function' );


// MODIFIED HEADERS

 add_action('template_redirect', 'cyb_add_last_modified_header');
 function cyb_add_last_modified_header($headers) {

    //Check if we are in a single post of any type (archive pages has not modified date)
  if( is_singular() || is_page() ) {
    $post_id = get_queried_object_id();
    if( $post_id ) {
      header("Last-Modified: " . get_the_modified_time("D, d M Y H:i:s", $post_id) );
    }
  }
}

/* Hide Admin Bar */
show_admin_bar(false);


// Block Gutternberyg Styles
// function rm_deregister_guetenberg() {
//   wp_dequeue_style( 'wp-block-library' );
// }
// add_action( 'wp_print_styles', 'rm_deregister_guetenberg', 100 );




/*==========================================================
=            Disable the WordPress Core Emoji's            =
==========================================================*/

function disable_emojis() {
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' ); 
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' ); 
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );

	wp_deregister_script( 'wp-embed' ); // Disable wp-embed.js   
	
}

add_action( 'init', 'disable_emojis' );