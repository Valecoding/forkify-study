/*export default 'I am an exported string';*/

import axios from 'axios';//путь можно не использовать webpack автоматически соберет библиотеку установленую
import {key, proxy} from "../config";

export default class Search{
    constructor(query){
        this.query = query;
    }
    //doing AJAX
    async getResults() {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);//библиотека сразу вернет JSON
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error){
            alert(error);
        }
    }
}