<?php
/**
 * 「積み」1件（本・ゲーム1冊/1本）を表す型。
 * 元のテーブルの列名（本ゲーム名、サムネURL等）とは独立させて、
 * アプリ側で使いやすい名前にしている。
 */

 class PileItem
{
    private int $id;
    private int $userId;
}