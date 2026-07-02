<?php

require_once __DIR__ . '/services/PileService.php';
require_once __DIR__ . '/repositories/CommentRepository.php';
require_once __DIR__ . '/repositories/PileItemRepository.php';
require_once __DIR__ . '/repositories/UserRepository.php';

header('Content-Type: application/json; charset=utf-8');

// ====== ここからPDO処理 ======
$host = 'localhost';
$dbName = 'serchtestfordb';
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
    http_response_code(500);
    echo json_encode(['error' => 'DB接続に失敗しました']);
    exit;
}
// ================================================================

$pileItemRepository = new PileItemRepository($pdo);
$commentRepository = new CommentRepository($pdo);
$userRepository = new UserRepository($pdo);

$pileService = new PileService(
    $pileItemRepository,
    $commentRepository,
    $userRepository
);

$mode = $_GET['mode'] ?? '';
$keyword = $_GET['query'] ?? '';

if($query === ''){
    echo json_encode([]);
    exit;
} 

if($mode === 'title') {
    $items = $pileService->searchPileByTitle($query);

    $result = array_map(function ($item) {
        return [
            'id' => $item->getId(),
            'userId' => $item->getUserId(),
            'title' => $item->getTitle(),
            'thumbnailUrl' => $item->getThumbnailUrl(),
            'releaseDate' => $item->getReleaseDate(),
            'registeredAt' => $item->getRegisteredAt(),
            'oneWordComment' => $item->getOneWordComment(),
            'clearedStatus' => $item->getClearedStatus(),
        ];
    }, $items);

    echo json_encode($result);
    exit;
}

if($mode === 'user') {
    $users = $userRepository->searchByName($query);

    $result = array_map(function ($user) {
        return [
            'id' => $user->getId(),
            'name' => $user->getName(),
            'isAdmin' => $user->isAdmin(),
        ];
    }, $users);

    echo json_encode($result);
    exit;
}

// modeが不正な場合
http_response_code(400);
echo json_encode(['error' => 'modeが不正です']);