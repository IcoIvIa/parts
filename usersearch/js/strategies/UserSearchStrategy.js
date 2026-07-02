"use strict";

export default class UserSearchStrategy {
    constructor(api) {
        this.api = api;
    }

    async search(query){
        return this.api.fetchPHP('user',query);
    }
}