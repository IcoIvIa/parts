<?php

require_once __DIR__ . '/PileItemRepositoryInterface.php';
require_once __DIR__ . '/../models/PileItem.php';

/**
 * 「本・ゲーム登録テーブル」専用の実装。

 * ここがアプリ全体の中で唯一、テーブル名・列名を知っている場所。 フェッチしたデータをmapRowToEntityで変換することで差異を吸収する。
 * 今後テーブル構造が変わったら（例: 列名を変える、本テーブルとゲームテーブルに分割する等）、直すのはこのファイルの中だけでいい。
 * サービス層・UI層は PileItem オブジェクトしか見ないので影響を最小限にできる。
 */

class PileItemRepository implements PileItemRepositoryInterface
{

    private PDO $pdo;

    function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    private const PILE_ITEMS_SELECT_ALL_SQL =
            'SELECT pile_item_id, user_id, title, thumbnail_url, release_date, registered_at
            FROM pile_items ';

    #[Override]
    public function findByUserId(int $userId): array
    {
        try{
        $stmt = $this->pdo->prepare(
            self::PILE_ITEMS_SELECT_ALL_SQL.
            'WHERE user_id = :userId'
        );
        $stmt->bindValue(':userId',$userId);
        $stmt->execute();
        
        $array = array_map(function($row) {return $this->mapRowToEntity($row);},
        $stmt->fetchAll(PDO::FETCH_ASSOC)
         );
        return $array;

        } catch(PDOException $e) {
            throw new \RuntimeException("積みアイテムの取得に失敗しました: " . $e->getMessage());
        }
    }

    #[Override]
    public function findById(int $id): ?PileItem
    {
        try{
            $stmt = $this->pdo->prepare(
                self::PILE_ITEMS_SELECT_ALL_SQL.
                'WHERE pile_item_id = :pile_item_id'
            );
            $stmt->bindValue(':pile_item_id',$id);
            $stmt->execute();

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if(!$row) {
                return null;
            } else {
                return $this->mapRowToEntity($row);
            }
        } catch (PDOException $e) {
            throw new \RuntimeException("積みアイテムの取得に失敗しました: " . $e->getMessage());
        }
    }

    #[Override]
    public function searchByTitle(string $keyword): array
    {
        try {
            $stmt = $this->pdo->prepare(
                self:: PILE_ITEMS_SELECT_ALL_SQL.
                'WHERE title LIKE :keyword'
            );
            $stmt->bindValue(':keyword','%' . $keyword . '%');
            $stmt->execute();

            $array = array_map(function($row) {return $this->mapRowToEntity($row);},
            $stmt->fetchAll(PDO::FETCH_ASSOC)
         );
        return $array;

        } catch (PDOException $e) {
            throw new \RuntimeException("積みアイテムの取得に失敗しました: " . $e->getMessage());
        }
    }

    /**
     * DBの行（連想配列）→ アプリ内のPileItem型へ変換する。
     * 列名が変わったら、ここの右辺（$row['列名']）だけ直せばよい。
     */
    private function mapRowToEntity(array $row): PileItem
    {
        return new PileItem(
            id: (int) $row['pile_item_id'],
            userId: (int) $row['user_id'],
            title: $row['title'],
            thumbnailUrl: $row['thumbnail_url'],
            releaseDate: $row['release_date'],
            registeredAt: $row['registered_at']
        );
    }
}
