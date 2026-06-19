<pre>
<?php
// 検索クエリ（URLエンコードは必須・英語でもここに入れてOK）
$keyword = urlencode('プログラミング');

$apikey = '';

// APIのURL
$url = 'https://www.googleapis.com/books/v1/volumes?q=' . $keyword . '&key=' . $apikey;
// $url = 'https://www.googleapis.com/books/v1/volumes?q=' . $keyword . '&key=' . $apikey . '&maxResults=40';

// APIからデータを取得
$response = file_get_contents($url);

// 取得したJSONデータを配列に変換
$data = json_decode($response, true);

// データを表示
if (isset($data['items'])) {
    foreach ($data['items'] as $book) {
        print_r($book);
        echo '<hr>';
    }
} else {
    echo '該当する書籍が見つかりませんでした。';
}
?>