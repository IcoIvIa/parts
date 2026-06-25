<?php
 
require_once __DIR__ . '/PileItemRepositoryInterface.php';
require_once __DIR__ . '/../models/PileItem.php';
 
/**
 * 「本・ゲーム登録テーブル」専用の実装。
 *
 * ★★★ ここがアプリ全体の中で唯一、テーブル名・列名を知っている場所 ★★★
 * 今後テーブル構造が変わったら（例: 列名を変える、本テーブルとゲームテーブルに
 * 分割する等）、直すのはこのファイルの中だけでいい。
 * サービス層・UI層は PileItem オブジェクトしか見ないので無修正のまま動く。
 */