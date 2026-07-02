-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- ホスト: 127.0.0.1
-- 生成日時: 2026-07-02 13:17:05
-- サーバのバージョン： 10.4.32-MariaDB
-- PHP のバージョン: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `kadaiseisaku`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `comments`
--

CREATE TABLE `comments` (
  `comment_id` bigint(20) NOT NULL,
  `pile_item_id` int(11) NOT NULL COMMENT '外部キー：pile_itemsテーブル',
  `parent_comment_id` bigint(20) DEFAULT NULL,
  `user_id` int(11) NOT NULL COMMENT '外部キー：users',
  `target_title` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime NOT NULL,
  `reported` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `comments`
--

INSERT INTO `comments` (`comment_id`, `pile_item_id`, `parent_comment_id`, `user_id`, `target_title`, `comment`, `created_at`, `reported`) VALUES
(1, 1, NULL, 1, 'ドラゴンクエストXI', 'これはよいものです', '2026-06-26 12:15:59', 0),
(2, 1, 1, 2, 'ドラゴンクエストXI', 'おもしろかったですよ', '2026-06-27 12:15:59', 0),
(3, 2, NULL, 3, 'ドラゴンクエストV', 'これはよかったです', '2026-06-25 12:15:59', 0);

-- --------------------------------------------------------

--
-- テーブルの構造 `pile_items`
--

CREATE TABLE `pile_items` (
  `pile_item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT '外部キー：usersテーブル',
  `product_id` int(11) NOT NULL COMMENT '外部キー：productsテーブル',
  `title` varchar(255) NOT NULL,
  `registered_at` datetime NOT NULL DEFAULT current_timestamp(),
  `one_word_comment` varchar(255) DEFAULT NULL,
  `cleared_status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `pile_items`
--

INSERT INTO `pile_items` (`pile_item_id`, `user_id`, `product_id`, `title`, `registered_at`, `one_word_comment`, `cleared_status`) VALUES
(1, 1, 3, 'ドラゴンクエストXI', '2026-06-26 12:15:59', '名作らしいので楽しみ', 0),
(2, 1, 2, 'ドラゴンクエストV', '2026-06-26 12:15:59', NULL, 1),
(3, 1, 4, 'ファイナルファンタジーVII', '2026-06-26 12:15:59', 'リメイクより先に原作をやる', 2),
(4, 2, 5, 'ドラゴンボールZ カカロット', '2026-06-26 12:15:59', NULL, 0);

-- --------------------------------------------------------

--
-- テーブルの構造 `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `source_api_id` varchar(20) NOT NULL,
  `source_api_type` varchar(20) NOT NULL,
  `title` varchar(255) NOT NULL,
  `thumbnail_url` varchar(20) NOT NULL,
  `release_date` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `products`
--

INSERT INTO `products` (`product_id`, `source_api_id`, `source_api_type`, `title`, `thumbnail_url`, `release_date`) VALUES
(1, 'Hm2BzwEACAAJ', 'book', 'アルジャーノンに花束を', '', '1978'),
(2, '205595', 'game', 'ドラゴンクエストV', 'co4vsl.jpg', '1992年9月27日'),
(3, '11667', 'game', 'ドラゴンクエストXI', '', NULL),
(4, '393025', 'game', 'ファイナルファンタジーVII', '', NULL),
(5, '2566', 'game', 'ドラゴンボールZ カカロット', 'co57c6.jpg', '2005年2月10日');

-- --------------------------------------------------------

--
-- テーブルの構造 `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `mail` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `role` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- テーブルのデータのダンプ `users`
--

INSERT INTO `users` (`user_id`, `name`, `mail`, `pass`, `role`) VALUES
(1, 'sample', 'sample@test.com', '$2y$10$juvmptGvCOyy3oeMXwutveB.oqj7nujXBHrHZwnOUoFi2w5Jclxbu', 1),
(2, 'sample2', 'sample2@test.com', '$2y$10$KDOUPkIIXBhnxrNnQDqfE.0efEaH.ZURmeRz/aExqWun46pVdLDza', 0),
(3, 'sample3', 'sample3@test.com', '$2y$10$UuoVFDZnYcuYihqCvFnMceqY6Y//UoId5bvXqO57/Oz1H58YPOPem', 1),
(4, 'sample4', 'sample4@test.com', '$2y$10$fIWTV9d5T7yhMbCzKPbkhu8SH/m8RvytBlSIa7SDh8qQTde4C2Yra', 0),
(5, 'sample5', 'sample5@test.com', '$2y$10$NMxsze7WTQDa1aT.BHvEYu7Hhzfrb2VPFGM7Pp/SLKOZd8VYXYO4S', 0);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `pile_item_id` (`pile_item_id`),
  ADD KEY `user_id` (`user_id`);

--
-- テーブルのインデックス `pile_items`
--
ALTER TABLE `pile_items`
  ADD PRIMARY KEY (`pile_item_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- テーブルのインデックス `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- テーブルのインデックス `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- テーブルの AUTO_INCREMENT `pile_items`
--
ALTER TABLE `pile_items`
  MODIFY `pile_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- テーブルの AUTO_INCREMENT `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- テーブルの AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`pile_item_id`) REFERENCES `pile_items` (`pile_item_id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- テーブルの制約 `pile_items`
--
ALTER TABLE `pile_items`
  ADD CONSTRAINT `pile_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `pile_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;