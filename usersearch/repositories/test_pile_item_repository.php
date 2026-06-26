<pre>
<?php

require_once __DIR__ . '/../repositories/PileItemRepository.php';

// ====== ここをご自身のXAMPP環境に合わせて書き換えてください ======
$host = 'localhost';
$dbName = 'serchtestfordb';      // ← phpMyAdminで作ったデータベース名
$dbUser = 'root';         // ← XAMPPのデフォルトは 'root'
$dbPassword = '';         // ← XAMPPのデフォルトは空文字
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

$repository = new PileItemRepository($pdo);

echo "=== 1. findByUserId のテスト ===\n";
// ↓ pile_itemsテーブルに実際に存在するuser_idに変えて試してください
$userId = 1;
$items = $repository->findByUserId($userId);
echo "user_id={$userId} の積みアイテム数: " . count($items) . "\n";
foreach ($items as $item) {
    echo " - [{$item->getId()}] {$item->getTitle()} (発売日: " . ($item->getReleaseDate() ?? '不明') . ")\n";
}

echo "\n=== 2. findById のテスト ===\n";
// ↓ 実際に存在するpile_item_idに変えて試してください
$pileItemId = 1;
$item = $repository->findById($pileItemId);
if ($item === null) {
    echo "pile_item_id={$pileItemId} は見つかりませんでした\n";
} else {
    echo "見つかりました: {$item->getTitle()}\n";
}

echo "\n--- 存在しないIDも試す（nullが返るはず） ---\n";
$notFound = $repository->findById(999999);
echo $notFound === null ? "想定通り null が返りました\n" : "予期しない結果です\n";

echo "\n=== 3. searchByTitle のテスト ===\n";
// ↓ pile_itemsに実際に登録されているタイトルの一部に変えて試してください
$keyword = 'ドラゴン';
$results = $repository->searchByTitle($keyword);
echo "「{$keyword}」を含むタイトルの件数: " . count($results) . "\n";
foreach ($results as $result) {
    echo " - {$result->getTitle()}\n";
}
