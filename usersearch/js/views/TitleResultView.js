"use strict";

import BaseResultView from "../../../searchoopStrategy/views/BaseResultView.js";

export default class TitleResultView extends BaseResultView {

    /**
    * タイトル検索結果の一覧表示を担当するクラス。
    * createListItem()で生成したli要素は、BaseResultViewのappendItems()が
    * resultArea.appendChild(li)で画面に追加する。
    */
    createListItem(item) {

        const li = document.createElement("li");
        const img = document.createElement("img");
        const span = document.createElement("span");

        span.textContent = item.title;
        img.src = item.thumbnailUrl;
        li.addEventListener("click", () => {
            console.log(item);
        })

        li.appendChild(img);
        li.appendChild(span);
        return li;
    }
}