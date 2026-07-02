"use strict";

class PileApi {

    async fetchPHP(mode, query) {
        try {
            const response = await fetch(`suggest.php?mode=${mode}&query=${query}`);
            const data = await response.json();
            return data

        } catch (error) {
            console.error(error);
            return [];
        }

    }
}