<?php

get_header();

if( have_posts() )
{
    while( have_posts() )
    {
        get_template_part('content',get_post_format());
    }
}

get_footer();