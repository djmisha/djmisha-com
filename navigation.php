<!-- Header -->
<a href="#skiptomaincontent" style="display:none;">Skip to main content</a>

<header id="header">

  <?php echo is_front_page() ? '<h1 id="logo">' : '<span id="logo">'; ?>
    <a href="/" title="San Diego DJ">San Diego DJ</a>
  <?php echo is_front_page() ? '</h1>' : '</span>'; ?>
  
  <nav id="nav">
    <?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_class' => 'nav-menu' ) ); ?>
  </nav>

</header>

<span id="skiptomaincontent"></span>