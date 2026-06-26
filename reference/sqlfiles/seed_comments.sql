-- =========================================================
-- 動作確認用ダミーデータ（コメント）
-- test_comment_repository.php の動作確認にそのまま使えます。
-- 前回の seed_data.sql（users, pile_items）が
-- すでに投入済みであることを前提にしています。
-- =========================================================

-- pile_item_id=1（ドラゴンクエストXI）に3件、pile_item_id=2に1件のコメント
-- author_user_id=2（はなこ）が pile_item_id=1, 2 にコメントしている想定
INSERT INTO comments (comment_id, content, author_user_id, pile_item_id, commented_at, is_reported) VALUES
    (1, '面白かったです！', 2, 1, NOW(), 0),
    (2, 'ストーリーが良かった', 2, 1, NOW(), 0),
    (3, 'ネタバレ注意な内容でした', 1, 1, NOW(), 0),
    (4, '懐かしい一作ですね', 2, 2, NOW(), 0);
