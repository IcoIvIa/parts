<pre>
<?php

require_once __DIR__ . '/repositories/CommentRepository.php';

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

$repository = new CommentRepository($pdo);

echo "=== 1. findByPileItemId のテスト ===\n";
// ↓ comments テーブルに実際に存在する pile_item_id に変えて試してください
$pileItemId = 1;
$comments = $repository->findByPileItemId($pileItemId);
echo "pile_item_id={$pileItemId} のコメント数: " . count($comments) . "\n";
foreach ($comments as $comment) {
    echo " - [{$comment->getId()}] author_user_id={$comment->getAuthorUserId()}: {$comment->getContent()}\n";
}

echo "\n=== 2. findByAuthorUserId のテスト ===\n";
// ↓ 実際にコメントを投稿したuser_idに変えて試してください
$userId = 2;
$myComments = $repository->findByAuthorUserId($userId);
echo "author_user_id={$userId} が投稿したコメント数: " . count($myComments) . "\n";
foreach ($myComments as $comment) {
    echo " - [{$comment->getId()}] pile_item_id={$comment->getPileItemId()}: {$comment->getContent()}\n";
}

echo "\n=== 3. save のテスト ===\n";
// 新規コメントを作る（idは0でも何でも構わない。saveの中で無視される）
$newComment = new Comment(
    id: 0,
    content: 'テスト投稿です',
    authorUserId: 1,
    pileItemId: 1,
    commentedAt: '',  // saveの中で無視される（DB側でNOW()が入る）
    isReported: false
);
$newCommentId = $repository->save($newComment);
echo "新規コメントが作成されました。comment_id={$newCommentId}\n";

echo "\n=== 4. delete のテスト ===\n";
echo "今保存したコメント（comment_id={$newCommentId}）を削除します\n";
$repository->delete($newCommentId);

// 削除後、もう一度同じpile_item_idで検索して件数が変わらないか確認
$afterDelete = $repository->findByPileItemId($pileItemId);
echo "削除後の pile_item_id={$pileItemId} のコメント数: " . count($afterDelete) . "（保存前と同じ数になっていればOK）\n";
