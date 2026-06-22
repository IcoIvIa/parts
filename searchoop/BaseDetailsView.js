"use strict";
 
export default class BaseDetailsView {
 
    constructor(detailsArea) {
        this.detailsArea = detailsArea;
    }
 
    render(item) {
        this.detailsArea.innerHTML = "";
        const lines = this.createDetailLines(item);
        lines.forEach(text => {
            const p = document.createElement("p");
            p.textContent = text;
            this.detailsArea.appendChild(p);
        });
    }
 
    createDetailLines(item) {
        throw new Error("createDetailLines はサブクラスで実装してください");
    }
}