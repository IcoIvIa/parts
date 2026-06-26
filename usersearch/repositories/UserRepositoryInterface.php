<?php

require_once __DIR__ . '/../models/User.php';

/**
 * User（ユーザー）に対するDBアクセスの「契約」だけを定義する。
 */

interface UserRepositoryInterface
{
    public function findById(int $userId): ?User;

    /**
     * ユーザー名での検索（部分一致）
     * @return User[]
     */
    public function searchByName(string $keyword): array;
}
