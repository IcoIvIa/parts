<?php

require_once __DIR__ . '/../models/Comment.php';

interface CommentRepositoryInterface
{
    /**
     * ある積みアイテムに対するコメント一覧を取得
     * @return Comment[]
     */
    public function findByPileItemId(int $pileItemId): array;

    /**
     * あるユーザーが投稿したコメント一覧
     * （「コメントからの検索」「コメントしたユーザーをたどる」用）
     * @return Comment[]
     */
    public function findByAuthorUserId(int $userId): array;

    public function save(Comment $comment): int;
    public function delete(int $commentId): void;
}