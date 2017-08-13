<?php

require_once __DIR__ . '/../vendor/autoload.php';

$code = isset($_REQUEST['code']) ? $_REQUEST['code'] : '';
$format = isset($_REQUEST['format']) ? $_REQUEST['format'] : '';
$parser = (new PhpParser\ParserFactory)->create(PhpParser\ParserFactory::PREFER_PHP7);

try {
    $statements = $parser->parse($code);

    switch ($format) {
        case 'var_export':
            $result = ['mime' => 'text/x-php', 'code' => var_export($statements, true)];
            break;

        case 'NodeDumper':
            $result = ['mime' => 'text/plain', 'code' => (new PhpParser\NodeDumper)->dump($statements)];
            break;

        case 'JSON':
            $result = ['mime' => 'application/json', 'code' => json_encode($statements, JSON_PRETTY_PRINT)];
            break;

        case 'XML':
            $result = ['mime' => 'application/xml', 'code' => (new PhpParser\Serializer\XML)->serialize($statements)];
            break;

        default:
            $result = ['error' => 'Unexpected output format "'.$format.'".'];
    }
} catch (\Exception $ex) {
    $result = ['error' => (string)$ex];
}

echo json_encode($result);
