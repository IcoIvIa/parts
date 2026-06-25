<?php
/**
 * アプリ内で使うユーザーの型。
 * DBのテーブル名・列名が変わっても、このクラスの形（プロパティ・メソッド名）が
 * 変わらなければ、これを使う側のコードは一切修正不要。
 */
class User
{
    private int $id;
    private string $name;
    private bool $isAdmin;

    public function __construct(int $id, string $name, bool $isAdmin)
    {
        $this->id = $id;
        $this->name = $name;
        $this->isAdmin = $isAdmin;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function isAdmin(): bool
    {
        return $this->isAdmin;
    }
}