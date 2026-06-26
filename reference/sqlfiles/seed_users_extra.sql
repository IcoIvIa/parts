-- =========================================================
-- 動作確認用ダミーデータ（追加ユーザー）
-- test_user_repository.php の searchByName('はな') が
-- 複数件ヒットするように、似た名前のユーザーを追加します。
-- 前回の seed_data.sql（user_id=1,2）が投入済みであることが前提です。
-- =========================================================

INSERT INTO users (user_id, user_name, password, is_admin) VALUES
    (3, 'はなこ2号', 'dummy_password_3', 0),
    (4, 'ゆうた', 'dummy_password_4', 0);
