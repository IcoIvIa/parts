<?php

require_once __DIR__ . '/../repositories/PileItemRepositoryInterface.php';
require_once __DIR__ . '/../repositories/CommentRepositoryInterface.php';
require_once __DIR__ . '/../repositories/UserRepositoryInterface.php';

/**
 * ビジネスロジック層。
 *
 * ポイント: コンストラクタで受け取る型は「インターフェース」。
 * 具体的な実装クラス（PileItemRepository等）の名前は出てこない。
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
    // TODO: 現状は array_push に ... 展開を使っており、複数ユーザーの
    // PileItemが1つのフラットな配列に混ざってしまい、どれが誰の分か
    // 区別できない。意図としては「1人分の配列」を1要素として積みたい
    // （ユーザーごとに仕分けたい）ので、... 展開を外して
    // array_push($array, $this->pileItemRepository->findByUserId($userId));
    // にする。ただしその場合、$array[0]や$array[1]がどのユーザーか
    // 分からないので、必要なら ['user' => $user, 'items' => $items]
    // のような形でユーザー情報も持たせることを検討する。
    public function getPileItemsByUserName(string $name): array
    {
        $users = $this->userRepository->searchByName($name);
        $array = [];
        foreach ($users as $user) {
            $userId = $user->getId();
            array_push(
                $array,
                ...$this->pileItemRepository->findByUserId($userId)
            );
        }
        return $array;
    }

    /**
     * その積みアイテムの持ち主であるユーザーを1人返す
     */
    public function getUserNameByPileItem(int $pileItemId): ?User
    {
        $pileItem = $this->pileItemRepository->findById($pileItemId);

        if ($pileItem === null) {
            return null;
        }

        $userId = $pileItem->getUserId();

        return $this->userRepository->findById($userId);
    }

    /**
     * その積みアイテムの持ち主であるユーザー一覧を返す
     * DBの構造上タイトル検索のみ可能（主キーで判定できないので同名タイトルを判断できない）
     */
    public function getUsersBytitle(string $title): array
    {
        $items = $this->pileItemRepository->searchByTitle($title);

        $users = [];
        foreach ($items as $item) {
            $userId = $item->getUserId();

            // 重複を避けるためにKEYをUSER＿IDにして重複をチェック。
            if (!isset($users[$userId])) {
                $usersObject = $this->userRepository->findById($userId);

                if ($usersObject !== null) {
                    $users[$userId] = $usersObject;
                }
            }
        }
        return array_values($users);
    }


    //  コメント欄 → コメントした人一覧 → 個別ページ
    // CommentRepository.findByPileItemId → 重複排除 → UserRepository.findById（複数回）
    // 重複排除のロジックだけ新規に書く（getPileItemsCommentedByUserと同じパターン　これは後でかく
}
