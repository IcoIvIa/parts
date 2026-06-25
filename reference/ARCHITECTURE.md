# DB変更に強いアーキテクチャ — ファイル構成ガイド

このドキュメントは、`php-db-resilient/` 配下の各ファイルが「何を担当しているか」と
「DBのテーブル構造が変わったときに、どこを直せばいいか」を整理したものです。

---

## 1. 全体の依存関係図

```mermaid
flowchart TB
    subgraph UI["UI層 / 呼び出し側"]
        EX["example_usage.php"]
    end

    subgraph SVC["サービス層（ビジネスロジック）"]
        PS["services/PileService.php"]
    end

    subgraph IF["インターフェース層（契約）"]
        PII["repositories/PileItemRepositoryInterface.php"]
        CRI["repositories/CommentRepositoryInterface.php"]
    end

    subgraph REPO["リポジトリ層（DB構造を知っている）"]
        PIR["repositories/PileItemRepository.php"]
        CR["repositories/CommentRepository.php"]
    end

    subgraph MODEL["モデル層（独自の型）"]
        M1["models/User.php"]
        M2["models/PileItem.php"]
        M3["models/Comment.php"]
    end

    DB[("DB\n本ゲーム登録テーブル\nコメントテーブル\nユーザーテーブル")]

    EX -->|new PileItemRepository等を生成して注入| PS
    PS -->|型として依存| PII
    PS -->|型として依存| CRI
    PIR -.->|実装する| PII
    CR -.->|実装する| CRI
    PIR -->|SQL実行| DB
    CR -->|SQL実行| DB
    PIR -->|変換して返す| M2
    CR -->|変換して返す| M3
```

**読み方**：矢印が実線のものは「使う／依存する」、点線は「インターフェースを実装する」関係です。
`PileService`（サービス層）は実線でインターフェースにしか繋がっておらず、具体的な
`PileItemRepository`（実装クラス）には繋がっていません。これが「DB構造を知らない」状態です。

---

## 2. DBが変わったとき、どこまで影響が伝わるか

```mermaid
flowchart LR
    A["テーブル構造の変更\n例: 列名変更／テーブル分割"] --> B["PileItemRepository.php\nの SQL と mapRowToEntity"]
    B -.->|ここで影響が止まる| C["PileService.php\n（無修正）"]
    C -.-> D["example_usage.php\n（無修正）"]

    style A fill:#F09595,stroke:#A32D2D,color:#501313
    style B fill:#F0997B,stroke:#993C1D,color:#4A1B0C
    style C fill:#97C459,stroke:#3B6D11,color:#173404
    style D fill:#97C459,stroke:#3B6D11,color:#173404
```

赤〜オレンジの箇所（リポジトリ層）だけが修正対象で、緑の箇所（サービス層・呼び出し側）は
**無修正のまま動き続ける**、というのがこの構成の狙いです。

---

## 3. ファイルごとの役割一覧

| ファイル | 役割 | DBのテーブル構造を知っているか |
|---|---|---|
| `models/User.php` | ユーザー1人を表す独自の型。`id`, `name`, `isAdmin`のみ保持 | ❌ 知らない |
| `models/PileItem.php` | 積み（本・ゲーム）1件を表す独自の型 | ❌ 知らない |
| `models/Comment.php` | コメント1件を表す独自の型 | ❌ 知らない |
| `repositories/PileItemRepositoryInterface.php` | 積みデータ取得の「契約」だけを定義。メソッド名と戻り値の型のみ | ❌ 知らない |
| `repositories/CommentRepositoryInterface.php` | コメントデータ取得の「契約」だけを定義 | ❌ 知らない |
| `repositories/PileItemRepository.php` | 実際にSQLを書いて`本ゲーム登録テーブル`にアクセスする実装 | ✅ **唯一知っている場所** |
| `repositories/CommentRepository.php` | 実際にSQLを書いて`コメントテーブル`にアクセスする実装 | ✅ **唯一知っている場所** |
| `services/PileService.php` | 「ユーザーの積み一覧を取る」「コメントしたユーザーの積みを集める」などの業務ロジック。インターフェースの型にしか依存しない | ❌ 知らない |
| `example_usage.php` | PDO接続を作り、リポジトリを実体化してサービスに注入する「組み立て」の場所 | △ 接続情報のみ知っている（テーブル構造は知らない） |

---

## 4. 「テーブル構造が変わったらどうなるか」の具体例

例: `本ゲーム登録テーブル`を `本テーブル` と `ゲームテーブル` に分割する場合

1. **修正するファイル**：`repositories/PileItemRepository.php`のみ
   - `findByUserId`等のSQLを「2つのテーブルをUNIONする」または「種別に応じて呼び分ける」処理に変更
   - `mapRowToEntity`の中の `$row['本ゲーム名']` のような列名参照を、新しい列名に合わせて修正
2. **修正不要なファイル**：
   - `models/PileItem.php`（型の形は変わらない）
   - `services/PileService.php`（インターフェースしか見ていない）
   - `example_usage.php`（`new PileItemRepository($pdo)`という1行は変わらない）

この「直す場所が1ファイルに閉じている」状態を保てているかどうかが、設計が機能しているかの目安になります。
