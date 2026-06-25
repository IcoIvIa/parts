"use strict";
 
export default class BaseDetailsView {
 
    constructor(detailsArea, dataSuggestions) {
        this.detailsArea = detailsArea;
        this.dataSuggestions = dataSuggestions;
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

        this.fillSuggestionForm(item);
    }

    fillSuggestionForm(item){
        this.dataSuggestions.forEach(input => {
            input.value = "";
        });

        for (const key in this.getFormValues(item)) {
            document.querySelector(`input[data-suggestion="${key}"]`).value = this.getFormValues(item)[key];
        }
    }
 
    createDetailLines(item) {
        throw new Error("createDetailLines はサブクラスで実装してください");
    }

    getFormValues(item){
        throw new Error("getFormValues はサブクラスで実装してください");
    }
}