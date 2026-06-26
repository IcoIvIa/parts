<?php

require_once __DIR__ . '/UserRepositoryInterface.php';
require_once __DIR__ . '/../models/User.php';

/**
 * 「users」テーブル専用の実装。
 * ここだけが、usersテーブルの列名を知っている場所。
 */
class UserRepository implements UserRepositoryInterface
{
    private PDO $pdo;

    private const USERS_SELECT_ALL_SQL =
    'SELECT user_id, user_name, password, is_admin
    FROM users ';

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    #[Override]
    public function findById(int $userId): ?User
    {
        try {
            $stmt = $this->pdo->prepare(
                self::USERS_SELECT_ALL_SQL .
                    'WHERE user_id = :userId'
            );
            $stmt->bindValue(':userId', $userId);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return null;
            } else {
                return $this->mapRowToEntity($row);
            }
        } catch (PDOException $e) {
            throw new \RuntimeException("ユーザーの取得に失敗しました: " . $e->getMessage());
        }
    }

    #[Override]
    public function searchByName(string $keyword): array
    {
        try {
            $stmt = $this->pdo->prepare(
                self::USERS_SELECT_ALL_SQL .
                    'WHERE user_name LIKE :keyword'
            );
            $stmt->bindValue(':keyword', '%' . trim($keyword) . '%');
            $stmt->execute();

            return array_map(
                fn(array $row) => $this->mapRowToEntity($row),
                $stmt->fetchAll(PDO::FETCH_ASSOC)
            );
        } catch (PDOException $e) {
            throw new \RuntimeException("ユーザー検索に失敗しました: " . $e->getMessage());
        }
    }
    /**
     * DBの行（連想配列）→ アプリ内のUser型へ変換する。
     * 列名が変わったら、ここの右辺（$row['列名']）だけ直せばよい。
     */
    private function mapRowToEntity(array $row): User
    {
        return new User(
            (int) $row['user_id'],
            $row['user_name'],
            (bool) $row['is_admin']
        );
    }
}
