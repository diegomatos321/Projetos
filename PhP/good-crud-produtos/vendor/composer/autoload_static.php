<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitf2c1bc9110aaf0dc8733558abaa53833
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
            0 => __DIR__ . '/../..' . '/',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitf2c1bc9110aaf0dc8733558abaa53833::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitf2c1bc9110aaf0dc8733558abaa53833::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitf2c1bc9110aaf0dc8733558abaa53833::$classMap;

        }, null, ClassLoader::class);
    }
}
