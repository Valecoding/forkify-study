/*import str from './models/Search';
// если испотльзуется дефолтный экспорт тогда мы тут даем название  переменной

//import {add as a, multiply, ID} from "./views/searchView";
// если используется экспорт нескольких переменных
// можно использовать ключевое слово "аs" для переименовывания в нужную переменную

// console.log(`Using imported functions! ${a(ID, 2)} and ${multiply(3,5)}, ${str}`);

///////////////
// Вариант экспорта всех переменных.

import * as searchView from './views/searchView';
console.log(`Using imported functions! ${searchView.add(searchView.ID, 2)} and ${searchView.multiply(3,5)}, ${str}`);
*/
///////////////////////////////////////////////////
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from "./views/base";

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes**/
const state = {};
/**TESTING*/
window.state = state; //было для тестирования



/**
 * SEARCH CONTROLLER
*/

const controlSearch = async ()=>{
    //1) Get a query from a view
    const query = searchView.getInput();
    // console.log(query);
    /**TESTING
    //const query = 'pizza';
    */
    if (query){
        // 2)New search object and add to state
        state.search = new Search(query);

        //3) Prepare UI for results
        searchView.clearImport();//очищаем импут
        searchView.clearResults();//очищаем список
        //добавляем спинер крутящийся
        renderLoader(elements.searchRes);

        //этот блок можно тоже повесть на проврку на ошибки
        try {
            //4) Search for recipes
            await state.search.getResults();//return Promise!!!

            // 5)render results on UI
            clearLoader(); //убираем спинер
            searchView.renderResults(state.search.result);//выводим результаты (result взят с объекта который вернулся с сервера) Также в этой функции 2 параметра по умолчанию
        } catch (err){
            alert('Something wrong with search...');
            clearLoader();//очищаем сптнео что бы постоянное не крутился если ошибка загрузки
        }
    }
};

//цепляем событие на кнопку поиска
elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});

/**TESTING
 * цепляем обрабочик события на окно
window.addEventListener('load', e=>{
    e.preventDefault();
    controlSearch();
});
*/

//снова используем event delegation на родителя
elements.searchResPages.addEventListener('click', e =>{
    const btn = e.target.closest('.btn-inline');//closest method возвращает ближайший родительский элемент (или сам элемент), который соответствует заданному CSS-селектору теперь при клике на любой элемент внутри кнопки будет возращать саму кнопку
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); //читаем дата атрибут goto
        // console.log(goToPage); //проверка что выводится верно
        searchView.clearResults();//очищаем список
        searchView.renderResults(state.search.result, goToPage);//загружаем список 2 страницы
    }

    // console.log(e.target); //todo проверка куда кликнул что понимать куда пришелся клик мышкой
});


/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    //Get ID from url
    //const id = window.location.hash; //window.location это ссылка в урл строке. в переменную сохраняется все что после решетки
    const id = window.location.hash.replace('#', ''); //убираем значек решетки через метод реплайс что бы иметь только значения хеша.
    //console.log(id);

    if (id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search Recipe
        if (state.search){
            searchView.highlightSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);

        /**TESTING
         * сделали  state.recipe глобальным обхектом window что бы иметь доступ к нему*/
        window.r = state.recipe;

        try {
             //Get recipe data and parse ingredients
            await state.recipe.getRecipe();//напоминаем что возращает промис
            //test
            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
               state.recipe,
                state.likes.isLiked(id)//проверка в избраном рецепт или нет
            );

            //console.log(state.recipe);
        } catch(err) {
            alert('Error processing recipe!');
        }

    }

};
/*
window.addEventListener('hashchange', controlRecipe); //событие на измниение ссылки (хеша) всче что после решетки.
 window.addEventListener('load', controlRecipe);//событие на перезагрузку страницы , тчо юбы при перезагрузке страницы она не была пустой
*/
//запись одно обработчика события на несколько событий
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList =()=>{
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};
// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;//Получаем ID из дата атрибута
// Handle the delete button

    // Handle the count update
        if (e.target.matches('.shopping__delete, .shopping__delete *')) {
            // Delete from state
            state.list.deleteItem(id);
            // Delete from UI
            listView.deleteItem(id);
        } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);//Функция parseFloat() принимает строку в качестве аргумента и возвращает десятичное число (число с плавающей точкой)
        state.list.updateCount(id, val);
    }
});
//Implementations
//Delete all items
//render button
if(state.list) listView.renderItemDeleteBtn();
//add eventlistener for implementations
elements.delAddshoppingList.addEventListener('click', e => {
    if (e.target.matches('.item__btn--delete, .item__btn--delete *')) {
        // Delete from state
        state.list.deleteAllItems();
        // Delete from UI
        listView.deleteAllItems();
        listView.deleteItemDeleteBtn();
        console.log(state.list);
    } else if (e.target.matches('.item__btn--add, .item__btn--add *')){
        //add to state
        const count = elements.addShoppingListCount.value;
        const unit = elements.addShoppingListUnit.value;
        const des = elements.addShoppingListDescription.value;

            // Create a new list IF there in none yet
            if (!state.list) state.list = new List();
            // Add ingredient to the state
            const item = state.list.addItem(count,unit,des);

        //add to UI
        // if(!document.querySelector('.btn-small').classList.contains('item__btn--delete')) listView.renderItemDeleteBtn();
        const el = document.querySelector('.item__btn--delete');
        if (!el) listView.renderItemDeleteBtn();
        listView.renderItem(item);
        console.log(state.list);
    }
});



/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
//Вешаем ивент на перезагрузку страницы
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes - восстанавливаем данные в state
    state.likes.readStorage();

    // Toggle like menu button - снова показываем кнопку лайков
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes - создаем снова список лайков из state
    state.likes.likes.forEach(like => likesView.renderLike(like));
});





//Handling recipe button clicks
//цепляем ивенты на кноппки
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {//запись означает селектор любовго ребенка внутри этого родителя
        //Decrease button is clicked
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

} else if (e.target.matches('.btn-increase, .btn-increase *')){
      //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    //Add ingredients to list
    controlList();
    const el = document.querySelector('.item__btn--delete');
    if (!el) listView.renderItemDeleteBtn();//Implementations добавляем сразу кнопку удалить все
    } else if (e.target.matches('.recipe__love, .recipe__love *')){
    //Like controller
    controlLike();
    }
//test
//console.log(state.recipe);
});

//test который позволяет использовать все наши методы нашего созданного класса
//window.l = new List();