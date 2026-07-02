<?php
/**
 * ログイン状態を確認する。
 *
 * はじめにセッションが開始されているかをチェックして、未開始の場合は開始します。
 * 次にログイン状態をチェックして、未ログインの場合はログインページへリダイレクトします。
 * 
 * 注意！
 *  ・session_start()を手書きしている場合は、その直後にこの関数を呼び出してください。
 *  ・書かれていない場合はプログラムの一番初めに呼び出してください。
 *
 * @return void
 */
function loginCheck(){
    // session_start() の重複呼び出しを防ぐため、未開始の場合のみセッションを開始する。
    if(session_status() === PHP_SESSION_NONE){
        session_start();
    }

    // login_system.php内で代入した$_SESSION['id'] = $member['id'];を判定。値がない場合はログインページにリダイレクト
    if(!isset($_SESSION['id'])){
        header('Location: /login.php');
        exit;
    }
}