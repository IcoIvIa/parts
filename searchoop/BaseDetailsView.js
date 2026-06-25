"use strict";
 
export default class BaseDetailsView {
 
    constructor(detailsArea) {
        this.detailsArea = detailsArea;
    }
 
    render(item) {
        this.detailsArea.innerHTML = "";
        const lines = this.createDetailLines(item);
        lines.forEach(line => {
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
    }
 
    createDetailLines(item) {
        throw new Error("createDetailLines はサブクラスで実装してください");
    }
}