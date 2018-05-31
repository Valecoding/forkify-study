import { elements } from "./base";

export const renderItem = item => {
    const markup = `
                <li class="shopping__item" data-itemid=${item.id}>
                    <div class="shopping__count">
                        <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
                        <p>${item.unit}</p>
                    </div>
                    <p class="shopping__description">${item.ingredient}</p>
                    <button class="shopping__delete btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-cross"></use>
                        </svg>
                    </button>
                </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

export const deleteItem = id => {
 const item = document.querySelector(`[data-itemid="${id}"`);
 if (item)item.parentElement.removeChild(item);
};

//Implementations
//add new buttons
export const deleteAllItems = () => {
    const item = document.querySelectorAll('.shopping__item');
    Array.from(item).forEach(el => el.parentElement.removeChild(el));//преобразуем в массив потом орудуем массивом
};

//Implementations
export const renderItemDeleteBtn = () => {
    const markup = `
                <button class="btn-small item__btn--delete" style="min-width: 190px; width: 100%;margin-left:auto;margin-right:auto;margin-top: 2rem;">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-circle-with-cross"></use>
                    </svg>
                    <span>delete all items</span>
                </button>
    `;
    elements.delAddshoppingList.insertAdjacentHTML('beforeend', markup);
};

//delete button
export const deleteItemDeleteBtn = () =>{
    const el =document.querySelector('.item__btn--delete');
    if(el) el.parentElement.removeChild(el);
};