<?php

function save_image(array $image_to_save, ?string $current_image_path): string {
  $new_image_path = "";

  if ($image_to_save && !empty($image_to_save["name"])) {
    if ($current_image_path && !empty($current_image_path)) {
      unlink($current_image_path);
    }

    $image_name = $image_to_save["name"];
    $new_image_path = "uploads/$image_name";

    move_uploaded_file($image_to_save["tmp_name"], $new_image_path);
  } else {
    $new_image_path = null;
  }

  return $new_image_path;
}

?>