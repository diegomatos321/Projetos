<?php
/**
 * Plugin Name:       Data Layer Course
 * Description:       Example plugin from data layer course
 * Version:           0.1.0
 * Author:            Diego V. S. de Matos
 * Text Domain:       data-layer-course
 *
 */
 
function my_admin_menu() {
    // Create a new admin page for our app.
    add_menu_page(
        __( 'My first Gutenberg app', 'data-layer-course' ),
        __( 'My first Gutenberg app', 'data-layer-course' ),
        'manage_options',
        'data-layer-course',
        function () {
            echo '
            <h2>Pages</h2>
            <div id="data-layer-course"></div>
        ';
        },
        'dashicons-schedule',
        3
    );
}
 
add_action( 'admin_menu', 'my_admin_menu' );
 
function load_custom_wp_admin_scripts( $hook ) {
    // Load only on ?page=my-first-gutenberg-app.
    if ( 'toplevel_page_data-layer-course' !== $hook ) {
        return;
    }
 
    // Load the required WordPress packages.
 
    // Automatically load imported dependencies and assets version.
    $asset_file = include plugin_dir_path( __FILE__ ) . 'build/index.asset.php';
 
    // Enqueue CSS dependencies.
    foreach ( $asset_file['dependencies'] as $style ) {
        wp_enqueue_style( $style );
    }
 
    // Load our app.js.
    wp_register_script(
        'data-layer-course',
        plugins_url( 'build/index.js', __FILE__ ),
        $asset_file['dependencies'],
        $asset_file['version']
    );
    wp_enqueue_script( 'data-layer-course' );
 
    // Load our style.css.
    wp_register_style(
        'data-layer-course',
        plugins_url( 'style.css', __FILE__ ),
        array(),
        $asset_file['version']
    );
    wp_enqueue_style( 'data-layer-course' );
}
 
add_action( 'admin_enqueue_scripts', 'load_custom_wp_admin_scripts' );