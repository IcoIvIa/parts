<pre>
<?php

require_once __DIR__ . '/models/Comment.php';
require_once __DIR__ . '/services/PileService.php';
require_once __DIR__ . '/repositories/CommentRepository.php';
require_once __DIR__ . '/repositories/PileItemRepository.php';
require_once __DIR__ . '/repositories/UserRepository.php';

// ====== ここをご自身のXAMPP環境に合わせて書き換えてください ======
$host = 'localhost';
$dbName = 'serchtestfordb';      // ← phpMyAdminで作ったデータベース名
$dbUser = 'root';
$dbPassword = '';
// ================================================================

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbName};charset=utf8mb4",
        $dbUser,
        $dbPassword,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch (PDOException $e) {
    die('DB接続に失敗しました: ' . $e->getMessage());
}

$pileItemRepository = new PileItemRepository($pdo);
$commentRepository = new CommentRepository($pdo);
$userRepository = new UserRepository($pdo);

$pileService = new PileService(
            $pileItemRepository,
            $commentRepository,
            $userRepository
            );

            // if(isset($_GET['test'])){
            // echo 'getPileItemsCommentedByUserの結果';
            // print_r($pileService->getPileItemsCommentedByUser($_GET['test']));
            // }

            if(isset($_GET['test'])){
            echo 'getUserNameByPileItemの結果';
            print_r($pileService->getUserNameByPileItem($_GET['test']));
            }
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <form action="" method="get">
        <p>検索欄</p>
        <input type="text" name="test" id="">
        <input type="submit" value="テストする">
    </form>
</body>

</html>