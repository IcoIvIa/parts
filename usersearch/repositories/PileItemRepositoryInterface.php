<?php

require_once __DIR__. '/../models/PileItem.php';
/**
 * PileItem（積み）に対するDBアクセスの「契約」だけを定義する。
 * 実装（SQLの内容）はここには書かない。
 * これがあることで、将来DBの種類やテーブル構造が変わっても、「このインターフェースを満たす別の実装クラス」を作るだけで済む。
 * サービス層やUI層はこのインターフェースの型しか知らないので、差し替えても呼び出し側のコードは変更不要。
 */

interface PileItemRepositoryInterface
{
    /**
     * 指定ユーザーの積み一覧を取得する
     * @return PileItem[]
     */
    public function findByUserId(int $userId): array;

    public function findById(int $id): ?PileItem;

       /**
     * 積みタイトルでの検索（OP）」
     * @return PileItem[]
     */
    public function searchByTitle(string $keyword): array;

}