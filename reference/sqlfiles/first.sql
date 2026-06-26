-- =========================================================
-- 動作確認用ダミーデータ
-- test_pile_item_repository.php の動作確認にそのまま使えます。
-- すでに users / pile_items テーブルが作成済みの状態で実行してください。
-- =========================================================
 
-- -------------------------------
-- users（テスト用ユーザー2人）
-- -------------------------------
INSERT INTO users (user_id, user_name, password, is_admin) VALUES
    (1, 'たろう', 'dummy_password_1', 0),
    (2, 'はなこ', 'dummy_password_2', 0);
 
-- -------------------------------
-- pile_items（user_id=1 に3件、user_id=2 に1件）
-- searchByTitle('ドラゴン') で2件ヒットする想定
-- -------------------------------
INSERT INTO pile_items (pile_item_id, user_id, title, thumbnail_url, release_date, registered_at) VALUES
    (1, 1, 'ドラゴンクエストXI', 'https://example.com/dq11.jpg', '2017-07-29', NOW()),
    (2, 1, 'ドラゴンクエストV', 'https://example.com/dq5.jpg',  '1992-09-27', NOW()),
    (3, 1, 'ファイナルファンタジーVII', 'https://example.com/ff7.jpg', '1997-01-31', NOW()),
    (4, 2, 'ドラゴンボールZ カカロット', 'https://example.com/kakarot.jpg', '2020-01-16', NOW());