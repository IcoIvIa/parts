<?php

/**
 * コメント1件を表す型。
 */
class Comment
{
    public function __construct(
        private int $id,
        private string $content,
        private int $authorUserId,
        private int $pileItemId,
        private string $commentedAt,
        private bool $isReported
    ) {}

    public function getId(): int
    {
        return $this->id;
    }

    public function getContent(): string
    {
        return $this->content;
    }

    public function getAuthorUserId(): int
    {
        return $this->authorUserId;
    }

    public function getPileItemId(): int
    {
        return $this->pileItemId;
    }

    public function getCommentedAt(): string
    {
        return $this->commentedAt;
    }

    public function isReported(): bool
    {
        return $this->isReported;
    }
}