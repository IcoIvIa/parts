"use strict";

export default class GamesApi {
    constructor() {
    }

    async fetchGames(keyword) {

        const res = await fetch(
            'https://testproject.stackgametest.workers.dev/api/igdb/games/search',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keyword,
                }),
            },
        );
        const data = await res.json();

        // fordebug
        // console.log(data)

return data;
    }

}