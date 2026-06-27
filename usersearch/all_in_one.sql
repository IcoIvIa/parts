-- =========================================================
-- 積みゲー/積み本管理アプリ用 データベーススキーマ＋ダミーデータ（まとめ版）
-- =========================================================

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pile_items (
    pile_item_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(500) NULL,
    release_date DATE NULL,
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (pile_item_id),
    CONSTRAINT fk_pile_items_user
        FOREIGN KEY (user_id) REFERENCES users (user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE comments (
    comment_id INT NOT NULL AUTO_INCREMENT,
    content TEXT NOT NULL,
    author_user_id INT NOT NULL,
    pile_item_id INT NOT NULL,
    commented_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_reported TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (comment_id),
    CONSTRAINT fk_comments_author
        FOREIGN KEY (author_user_id) REFERENCES users (user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comments_pile_item
        FOREIGN KEY (pile_item_id) REFERENCES pile_items (pile_item_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (user_id, user_name, password, is_admin) VALUES
    (1, 'たろう', 'dummy_password_1', 0),
    (2, 'はなこ', 'dummy_password_2', 0),
    (3, 'はなこ2号', 'dummy_password_3', 0),
    (4, 'ゆうた', 'dummy_password_4', 0);

INSERT INTO pile_items (pile_item_id, user_id, title, thumbnail_url, release_date, registered_at) VALUES
    (1, 1, 'ドラゴンクエストXI', 'https://example.com/dq11.jpg', '2017-07-29', NOW()),
    (2, 1, 'ドラゴンクエストV', 'https://example.com/dq5.jpg',  '1992-09-27', NOW()),
    (3, 1, 'ファイナルファンタジーVII', 'https://example.com/ff7.jpg', '1997-01-31', NOW()),
    (4, 2, 'ドラゴンボールZ カカロット', 'https://example.com/kakarot.jpg', '2020-01-16', NOW());

INSERT INTO comments (comment_id, content, author_user_id, pile_item_id, commented_at, is_reported) VALUES
    (1, '面白かったです！', 2, 1, NOW(), 0),
    (2, 'ストーリーが良かった', 2, 1, NOW(), 0),
    (3, 'ネタバレ注意な内容でした', 1, 1, NOW(), 0),
    (4, '懐かしい一作ですね', 2, 2, NOW(), 0);
