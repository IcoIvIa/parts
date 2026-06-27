"use strict";

/**
 * 検索結果1件分の詳細表示を担当する基底クラス
 *
 * 「詳細エリアの描画」と「登録フォームへの値の流し込み」という
 * 共通の手順だけをここで定義し、データの中身の取り出し方
 * （createDetailLines / getFormValues）はサブクラスに委ねる。
 *
 * 【処理の流れ】
 *   render(item)
 *     → detailsArea をクリア
 *     → createDetailLines(item) で表示行（テキスト or 画像）を作成し描画
 *     → fillSuggestionForm(item) で登録フォームに値を同期
 *   fillSuggestionForm(item)
 *     → getFormValues(item) で { title, isbn, ... } 形式の値を取得（中身はサブクラスが実装）
 *     → 対応する data-suggestion 属性のinputに値を入れる
 *
 * @class
 */
export default class BaseDetailsView {

    /**
     * @param {HTMLElement} detailsArea - 詳細情報を表示するコンテナ要素
     * @param {NodeListOf<HTMLInputElement>} dataSuggestions - data-suggestion属性を持つinput要素群（登録フォーム）
     */
    constructor(detailsArea, dataSuggestions) {
        this.detailsArea = detailsArea;
        this.dataSuggestions = dataSuggestions;
    }

    /**
     * 詳細情報を描画し、登録フォームにも値を同期する。
     * @param {Object} item - 詳細表示したい1件分のデータ
     * @returns {void}
     */
    render(item) {
        this.detailsArea.innerHTML = "";
        const lines = this.createDetailLines(item);

        lines.forEach(line => {
            // line の形によって、画像 or テキストどちらで描画するか分岐する
            if (line.imageUrl) {
                const img = document.createElement("img");
                img.src = line.imageUrl;
                this.detailsArea.appendChild(img);
            } else if (line.text) {
                const p = document.createElement("p");
                p.textContent = line.text;
                this.detailsArea.appendChild(p);
            }
        });

        this.fillSuggestionForm(item);
    }

    /**
     * 登録フォーム（data-suggestion属性のinput群）に、現在の詳細データの値を入れる。
     * 既存の入力値は一度すべてクリアしてから入れ直す。
     * @param {Object} item - 詳細表示中の1件分のデータ
     * @returns {void}
     */
    fillSuggestionForm(item) {
        this.dataSuggestions.forEach(input => {
            input.value = "";
        });

        const formValues = this.getFormValues(item);

        for (const key in formValues) {
            const input = document.querySelector(`input[data-suggestion="${key}"]`);
            if (input) {
                input.value = formValues[key];
            }
        }
    }

    /**
     * 詳細エリアに表示する行データを作る。サブクラスで必ず実装すること。
     * @param {Object} item - 詳細表示したい1件分のデータ
     * @returns {Array<{text?: string, imageUrl?: string}>} 表示行の配列（テキスト行 or 画像行）
     */
    createDetailLines(item) {
        throw new Error("createDetailLines はサブクラスで実装してください");
    }

    /**
     * 登録フォームに入れる値を作る。サブクラスで必ず実装すること。
     * @param {Object} item - 詳細表示中の1件分のデータ
     * @returns {Object} data-suggestion属性の値をキーとした、フォーム用の値オブジェクト
     */
    getFormValues(item) {
        throw new Error("getFormValues はサブクラスで実装してください");
    }
}