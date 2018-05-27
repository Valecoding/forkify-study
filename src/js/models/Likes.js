export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        // Perist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Perist data in localStorage
        this.persistData();
    }
    //проверка в лайках рецепт или нет
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;//если -1 вернется то фолс
    }

    getNumLikes() {
        return this.likes.length;
    }
    //метод для сохранения в localStorage
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes)); //переводим наш массив данных в стринг
    }

    //метод что бы получить даненые из локалСторадж данные после перезагрузки страницы
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));//ковектируем обратно со Стринга в данные

        // Restoring likes from the localStorage
        if (storage) this.likes = storage; //проверка если в локалСторадж данные
    }
}
