<pre>
<?php

require_once __DIR__ . '/UserRepository.php';

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

$repository = new UserRepository($pdo);

echo "=== 1. findById のテスト ===\n";
// ↓ usersテーブルに実際に存在するuser_idに変えて試してください
$userId = 1;
$user = $repository->findById($userId);
if ($user === null) {
    echo "user_id={$userId} は見つかりませんでした\n";
} else {
    echo "見つかりました: {$user->getName()}（管理者: " . ($user->isAdmin() ? 'はい' : 'いいえ') . "）\n";
}

echo "\n--- 存在しないIDも試す（nullが返るはず） ---\n";
$notFound = $repository->findById(999999);
echo $notFound === null ? "想定通り null が返りました\n" : "予期しない結果です\n";

echo "\n=== 2. searchByName のテスト ===\n";
// ↓ usersに実際に登録されている名前の一部に変えて試してください
$keyword = 'はな';
$results = $repository->searchByName($keyword);
echo "「{$keyword}」を含む名前の件数: " . count($results) . "\n";
foreach ($results as $result) {
    echo " - [{$result->getId()}] {$result->getName()}\n";
}
