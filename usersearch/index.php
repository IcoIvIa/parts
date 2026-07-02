<pre>
<?php

require_once __DIR__ . '/models/Comment.php';
require_once __DIR__ . '/services/PileService.php';
require_once __DIR__ . '/repositories/CommentRepository.php';
require_once __DIR__ . '/repositories/PileItemRepository.php';
require_once __DIR__ . '/repositories/UserRepository.php';

// ====== ここからPDO処理 ======
$host = 'localhost';
$dbName = 'serchtestfordb';      // ← phpMyAdminで作ったデータベース名
$dbUser = 'root';
$dbPassword = '';

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
// ================================================================
$pileItemRepository = new PileItemRepository($pdo);
$commentRepository = new CommentRepository($pdo);
$userRepository = new UserRepository($pdo);
$searchPileByTitle = '';

$pileService = new PileService(
    $pileItemRepository,
    $commentRepository,
    $userRepository
);

if (isset($_GET['query'])) {
    $searchPileByTitle = $pileService->searchPileByTitle($_GET['query']);
    echo '---------for debug------------<br>';
    echo 'searchPileByTitleの結果';
    print_r($searchPileByTitle);
    echo '---------for debug------------';
}

// if(isset($_GET['test'])){
// echo 'getUserNameByPileItemの結果';
// print_r($pileService->getUserNameByPileItem($_GET['test']));
// }
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
        <p>---検索欄---</p>
        <input type="text" name="query" id="">
        <input type="submit" value="検索">
        <p>---検索欄---</p>

        <input type="radio" name="searchField" id="searchTitleField" value="searchTitle">
        <label for="searchTitleField">タイトル検索</label>

        <input type="radio" name="searchField" id="searchUserField" value="searchUser">
        <label for="searchUserField">ユーザーネーム検索</label>

        <p>---サジェストテスト表示---</p>
        <p>未実装</p>
        <p>---サジェストテスト表示---</p>
        
<p>---検索結果表示---</p>
    <?php
    // タイトルの重複をなくし、ユニークなタイトルだけ取り出す
    // 注意: 同じタイトルが複数件存在する場合、サムネ・発売日は
    // 最後に見つかった1件の値が代表として使われる
    $uniqueTitles = [];
    foreach ($searchPileByTitle as $v) {
        $uniqueTitles[$v->getTitle()] = $v; // タイトルをキーにして重複排除
    }
    ?>

    <?php foreach ($uniqueTitles as $title => $v) : ?>

        <img 
        src="<?= $v->getThumbnailUrl() ?>" alt="<?= $title ?>の画像"
        >

        <h2><?= $title ?></h2>

        <p>===このタイトルを登録したユーザー=====</p>
        <?php foreach ($pileService->getUsersBytitle($title) as $user) : ?>
            <p><?= $user->getName() ?></p>
        <?php endforeach; ?>
        <p>===ここまで=====</p>
    <?php endforeach; ?>
<p>---検索結果表示終了---</p>
    </form>
</body>

</html>