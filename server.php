<?php
function asset($url)
{
    static $manifest = [];

    if (empty($manifest)) {
        $manifest_file = isset($_GET['dev']) ? 'http://node:8080/manifest.json' : './public/manifest.json';
        $manifest = json_decode(file_get_contents($manifest_file), JSON_OBJECT_AS_ARRAY);
    }

    if (!isset($manifest[$url])) {
        return '';
    }

    if (strpos($url, '.js', -3) !== false) {
        return "<script src=\"{$manifest[$url]}\" defer></script>";
    } elseif(strpos($url, '.css', -4) !== false) {
        return "<link href=\"{$manifest[$url]}\" rel=\"stylesheet\">";
    }

    throw new InvalidArgumentException();
}

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
if ($uri === '/') {
    include './src/views/app.html';
} elseif ($uri === '/admin.html') {
    include './src/views/admin.html';
} elseif (file_exists( './public' . $uri)) {
    return false;
} else {
    http_response_code(404);
    echo 'Not Found';
}
