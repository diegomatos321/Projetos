<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit52dbe21db060f1da630468f48c62cc3c
{
    public static $prefixLengthsPsr4 = array (
        'a' => 
        array (
            'app\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'app\\' => 
        array (
            0 => __DIR__ . '/../..' . '/app',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit52dbe21db060f1da630468f48c62cc3c::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit52dbe21db060f1da630468f48c62cc3c::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit52dbe21db060f1da630468f48c62cc3c::$classMap;

        }, null, ClassLoader::class);
    }
}