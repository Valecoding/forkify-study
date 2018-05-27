import axios from 'axios';
import {key, proxy} from "../config";

export default class Recipe{
    constructor(id) {
        this.id = id;
    }

    async getRecipe(){
        try{
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);//библиотека сразу вернет JSON
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;//все эти пути мы берем с объекта котрый нам вернулся на запрос data.recipe
        }catch  (error) {
            console.log(error);
            alert('something went wrong :(');
        }
    }

    //метод для подсчета времени готовк, это сайт не выдает
    calcTime(){
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }



    calcServings(){
        this.servings = 4;
    }

    //разделяем ингридиенты из массива
    parseIngredients(){
        //к первому заданию: делаем массивы как они есть воригинале
        const unitsLong = ['tablespoons', 'tablespoon','ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz','tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];//// пример использования деструтуризации

        const newIngredients = this.ingredients.map(el =>{
            //1) Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i)=>{//проходимся по массиву с долгими названиями и если находит то заменяет такст с еттойже позицией индекса из массива с коротким именем
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2) Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');//тема регулярные выражения

            //3) Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');//перводим массив предложения в массив с отдельными словами
            const unitIndex =arrIng.findIndex(el2 => units.includes(el2));//findIndex если проверка(колбэк функция) вернет тру выдаст номер индекса элемента в массиве. Колбэк функция перебиает массив с сокращениеми и проверяет на соответствие

            let objIng;
            if(unitIndex >-1){
                //There is a unit
                //Ex. 4 1/2 cups, arrCount is [4, 1/3]  --> eval("4+1/2") --> 4.5
                //Ex. 4 cups, arrCount is [4]
                //Проверка сколько єлементов перед єлементом со знчением ед.измернеия
                const arrCount = arrIng.slice(0,unitIndex);

                let count;
                if (arrCount.length ===1){
                    count = eval(arrIng[0].replace('-', '+'));//частный случай когда в значении количества ингридиента дробь не через пробел а через тире
                    // Метод eval() выполняет JavaScript код, представленный строкой.
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            }else if(parseInt(arrIng[0],10)) {
                //there is NO unit, but 1st element in number
                objIng = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')//Метод slice() возвращает новый массив, содержащий копию части исходного массива. //join() думаю понятно что делает
                }
            }else if(unitIndex ===-1){
                //there is NO unit
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient //напоминание соответствует ingredient:ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    //увеличение уменьшение ингридиентов
    updateServings (type){
        //Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);//классическая математика отношение величин
        });
        this.servings = newServings;
    }


}