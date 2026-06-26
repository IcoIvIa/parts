<?php

require_once __DIR__ . '/../models/Comment.php';
require_once __DIR__ . '/../repositories/CommentRepositoryInterface.php';

class CommentRepository implements CommentRepositoryInterface
{

    private PDO $pdo;

    function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    #[Override]
    public function findByPileItemId(int $pileItemId): array
    {
        try {
            $stmt = $this->pdo->prepare(
                'SELECT comment_id, content, author_user_id, pile_item_id, commented_at, is_reported
            FROM comments
            WHERE pile_item_id = :pileItemId
            ORDER BY commented_at ASC'
            );
            $stmt->bindValue(':pileItemId', $pileItemId);
            $stmt->execute();

            $array = array_map(
                function ($row) {
                    return $this->mapRowToEntity($row);
                },
                $stmt->fetchAll(PDO::FETCH_ASSOC)
            );

            return $array;
        } catch (PDOException $e) {
            throw new \RuntimeException("コメントの取得に失敗しました: " . $e->getMessage());
        }
    }

    #[Override]
    public function findByAuthorUserId(int $userId): array
    {
        try {
            $stmt = $this->pdo->prepare(
                'SELECT comment_id, content, author_user_id, pile_item_id, commented_at, is_reported
            FROM comments
            WHERE author_user_id = :userId
            ORDER BY commented_at ASC'
            );
            $stmt->bindValue(':userId', $userId);
            $stmt->execute();

            $array = array_map(
                function ($row) {
                    return $this->mapRowToEntity($row);
                },
                $stmt->fetchAll(PDO::FETCH_ASSOC)
            );

            return $array;
        } catch (PDOException $e) {
            throw new \RuntimeException("コメントの取得に失敗しました: " . $e->getMessage());
        }
    }

    /**
     * コメントを新規登録する。
     * @param Comment $comment 登録するコメント（idは無視される。DB側でAUTO_INCREMENTにより自動採番される）
     * @return int 新規作成されたコメントのID（comment_id）
     */
    #[Override]
    public function save(Comment $comment): int
    {
        try {
            $stmt = $this->pdo->prepare(
                'INSERT INTO comments (content, author_user_id, pile_item_id, commented_at, is_reported)
            VALUES (:content, :authorUserId, :pileItemId, now(), 0)'
            );
            $stmt->bindValue(':content', $comment->getContent());
            $stmt->bindValue(':authorUserId', $comment->getAuthorUserId());
            $stmt->bindValue(':pileItemId', $comment->getPileItemId());
            $stmt->execute();

            return (int) $this->pdo->lastInsertId();
        } catch (PDOException $e) {
            throw new \RuntimeException("コメントの保存に失敗しました: " . $e->getMessage());
        }
    }

    /**
     * 指定したコメントIDのコメントを削除する。
     * @param int $commentId 削除対象のコメントID（comment_id）
     * @return void
     */
    #[Override]
    public function delete(int $commentId): void
    {
        try {
            $stmt = $this->pdo->prepare(
                'DELETE FROM comments 
            WHERE comment_id = :commentId'
            );
            $stmt->bindValue(':commentId', $commentId);
            $stmt->execute();
        } catch (PDOException $e) {
            throw new \RuntimeException("コメントの削除に失敗しました: " . $e->getMessage());
        }
    }

    /**
     * DBの行（連想配列）→ アプリ内のComment型へ変換する。
     * 列名が変わったら、ここの右辺（$row['列名']）だけ直せばよい。
     */
    private function mapRowToEntity(array $row): Comment
    {
        return new Comment(
            id: (int) $row['comment_id'],
            content: $row['content'],
            authorUserId: (int) $row['author_user_id'],
            pileItemId: (int) $row['pile_item_id'],
            commentedAt: $row['commented_at'],
            isReported: (bool) $row['is_reported']
        );
    }
}
