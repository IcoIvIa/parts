"use strict";

import BaseResultView from "./BaseResultView.js";

export default class GameResultView extends BaseResultView {
      /**
    * タイトル検索結果の一覧表示を担当するクラス。
    * createListItem()で生成したli要素は、BaseResultViewのappendItems()が
    * resultArea.appendChild(li)で画面に追加する。
    */

    createListItem(item) {
        const li = document.createElement("li");
        li.textContent = item.title;
        li.addEventListener("click", () => {
            this.onResultSelected(item);
        })
        return li;
    }

}