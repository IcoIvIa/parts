<?php

require_once __DIR__ . '/../repositories/PileItemRepositoryInterface.php';
require_once __DIR__ . '/../repositories/CommentRepositoryInterface.php';
require_once __DIR__ . '/../repositories/UserRepositoryInterface.php';

/**
 * ビジネスロジック層。
 *
 * ポイント: コンストラクタで受け取る型は「インターフェース」。
 * 具体的な実装クラス（PileItemRepository等）の名前はどこにも出てこない。
 * テーブル構造の知識は一切ここに持たない。
 */
class PileService
{
    private PileItemRepositoryInterface $pileItemRepository;
    private CommentRepositoryInterface $commentRepository;
    private UserRepositoryInterface $userRepository;

    public function __construct(
        PileItemRepositoryInterface $pileItemRepository,
        CommentRepositoryInterface $commentRepository,
        UserRepositoryInterface $userRepository
    ) {
        $this->pileItemRepository = $pileItemRepository;
        $this->commentRepository = $commentRepository;
        $this->userRepository = $userRepository;
    }

    /** @return PileItem[] */
    public function getUserPile(int $userId): array
    {
        return $this->pileItemRepository->findByUserId($userId);
    }

    /** @return PileItem[] */
    public function searchPileByTitle(string $keyword): array
    {
        return $this->pileItemRepository->searchByTitle($keyword);
    }

    /**
     * 「コメントから検索」機能のベース:
     * あるユーザーがコメントした積みアイテムの一覧を返す。
     * @return PileItem[]
     */
    public function getPileItemsCommentedByUser(int $userId): array
    {
        $comments = $this->commentRepository->findByAuthorUserId($userId);

        $items = [];
        foreach ($comments as $comment) {
            $item = $this->pileItemRepository->findById($comment->getPileItemId());
            if ($item !== null) {
                $items[$item->getId()] = $item; // 重複排除
            }
        }

        return array_values($items);
    }

    /**
     * ある積みアイテムとそのコメント一覧をまとめて返す
     * @return array{item: PileItem|null, comments: Comment[]}
     */
    public function getPileItemWithComments(int $pileItemId): array
    {
        return [
            'item' => $this->pileItemRepository->findById($pileItemId),
            'comments' => $this->commentRepository->findByPileItemId($pileItemId),
        ];
    }
    /**
     * ユーザーネームからその積みアイテム一覧をまとめて返す
     * @return array{item: PileItem|null, comments: Comment[]}
     */
    public function getPileItemsByUserName(string $name): array
    {

    }
}