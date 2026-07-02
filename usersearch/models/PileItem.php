<?php
/**
 * 「積み」1件（本・ゲーム1冊/1本）を表す型。
 * 元のテーブルの列名（本ゲーム名、サムネURL等）とは独立させて、
 * アプリ側で使いやすい名前にする。
 */

 class PileItem
{
    private int $id;
    private int $userId;
    private string $title;
    private ?string $thumbnailUrl;
    private ?string $releaseDate;
    private string $registeredAt;
    private ?string $oneWordComment;
    private int $clearedStatus;


        public function __construct(
        int $id,
        int $userId,
        string $title,
        ?string $thumbnailUrl,
        ?string $releaseDate,
        string $registeredAt,
        ?string $oneWordComment,
        int $clearedStatus
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->title = $title;
        $this->thumbnailUrl = $thumbnailUrl;
        $this->releaseDate = $releaseDate;
        $this->registeredAt = $registeredAt;
        $this->oneWordComment = $oneWordComment;
        $this->clearedStatus = $clearedStatus;
    }

        public function getId(): int
    {
        return $this->id;
    }
 
    public function getUserId(): int
    {
        return $this->userId;
    }
 
    public function getTitle(): string
    {
        return $this->title;
    }
 
    public function getThumbnailUrl(): ?string
    {
        return $this->thumbnailUrl;
    }
 
    public function getReleaseDate(): ?string
    {
        return $this->releaseDate;
    }
 
    public function getRegisteredAt(): string
    {
        return $this->registeredAt;
    }

        public function getOneWordComment(): ?string
    {
        return $this->oneWordComment;
    }
    /**
     * 0=未着手, 1=消化中, 2=消化済み
     */
    public function getClearedStatus(): int
    {
        return $this->clearedStatus;
    }
 
}