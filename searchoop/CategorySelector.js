"use strict";

export default class CategorySelector {

    constructor(categoryRadios, searchFieldAreas, onCategoryChanged) {
        this.categoryRadios = categoryRadios;
        this.searchFieldAreas = searchFieldAreas;
        this.onCategoryChanged = onCategoryChanged;

        this.categoryRadios.forEach(radio => {
            radio.addEventListener("change", (e) => {
                const category = e.target.dataset.category;
                this.showFieldArea(category);
                this.onCategoryChanged(category);
            });
        });
    }

    showFieldArea(category) {
        this.searchFieldAreas.forEach(area => {
            if (area.dataset.searchfield === category) {
                area.classList.remove("hidden");
            } else {
                area.classList.add("hidden");
            }
        });
    }
}