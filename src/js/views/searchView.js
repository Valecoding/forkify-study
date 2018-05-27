/*
export const add = (a,b) => a+b;
export const multiply = (a,b) => a*b;
export const ID = 23;
*/

import {elements} from "./base";

export const getInput = () => elements.searchInput.value;
//Очистака инпута
export const clearImport = () =>{
    elements.searchInput.value = '';
};
//очистка списка результатов
export const clearResults = () =>{
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

//подсветка активного рецепта
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));//создаем массив с нод листа
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active')
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

/*обрезка названия что бі вмещалось на одну строку
'Pasta with tomato and spinach'
acc:0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc:5 / acc + cur.length = 9 / newTitle = ['Pasta','with']
acc:9 / acc + cur.length = 15 / newTitle = ['Pasta','with','tomato']
acc:15 / acc + cur.length = 18 / newTitle = ['Pasta','with','tomato']
acc:18 / acc + cur.length = 24 / newTitle = ['Pasta','with','tomato']
*/
export const limitRecipeTitile = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit){
        title.split(' ').reduce((acc,cur) => {//split выдаст массив из слов названия
            if (acc + cur.length <= limit){
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);

        //return the result
        //Метод join() объединяет все элементы массива (или массивоподобного объекта) в строку.
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};
/*
Альтернативные варианты фунцкции

change the output of the reduce( ) function?
Kevin ·Лекция132 · 13 дней назад
I can't help but feel there is another way to use reduce() here that is more in line with common usage. By using the accumulator as a counter, we end up discarding the function output as an artifact rather than utilizing the output to return the transformation of the input string itself.

Here's a tweak that changes that:

const limitRecipeTitle = (title, limit = 17) => {
  if (title.length > limit) {

    let charCount;

    return title.split(' ').reduce((result, word) => {
      // set initial charCount value
      if (!charCount) charCount = result.length;

      if (charCount + word.length + 1 <= limit) {
        charCount += word.length + 1; // + 1 adds room for a leading space
        return result.concat(` ${word}`);
      }

      charCount += word.length + 1;
      return result;
    }).concat(` ...`);
  }

  return title;
};
It's a bit longer, but it's quite readable and the output can be returned (with or without additional transformations).

(just to note, when you do not provide an initial value for the accumulator for reduce(), the first array value is used as the initial value and the reduce function begins iterating @ index 1)

Alternatively, here's a version that eschews the string conversion altogether:

const limitRecipeTitle = (title, limit = 17) => {
  if (title.length > limit) {
    return title.substr(0, title.substr(0, limit + 1).lastIndexOf(' ')).concat(` ...`);
  }
  return title;
}

еще один вариант
if (title.length > limit) {
    return title.substring(0, title.substring(0, limit).lastIndexOf(' ')) + '...';
}
return title;
...which takes the string and cuts it down to the limit. Then it looks for the last index of the space character, then gets the substring up to that index.
* */


const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitile(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};
//recipe_id, publisher, image_url берется с объекта что вернулся с сервера
//простая функция для вівода одного рецепта. почему для одного для того что бі организовать пагинацию

/*
//без использования пагинации
export const renderResults = recipes => { //функция для получения из массива всех рецптов потом вывода в UI
    recipes.forEach(renderRecipe); //вспоминиаем кодбек фнкция которая как аргумент идет без скобок
};*/

//Пагинация
//type 'prev' or 'next'
const createButton = (page, type) => `
                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev'? page -1 : page + 1}>
                    <span>Page ${type === 'prev'? page -1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev'? 'left' : 'right'}"></use>
                    </svg>
                </button>`
;

const renderButtons = (page, numResults, resPerPage) => {
    const  pages = Math.ceil(numResults/resPerPage);
    let button;
    if (page === 1 && pages>1){//проверка что бы кнопка е отображалась если страница всего одна
        //only button to go to next page
        button = createButton(page,'next');
    } else if(page<pages){
        //both buttons
        button = `${createButton(page,'prev')}
        ${createButton(page,'next')}
        `;
    } else if(page === pages){
        //Only button to go to prev page
        button = createButton(page,'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page=1, resPerPage=10) => { //функция для получения из массива всех рецптов потом вывода в UI
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe); //вспоминиаем кодбек фнкция которая как аргумент идет без скобок

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};