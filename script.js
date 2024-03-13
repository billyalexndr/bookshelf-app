const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF-APPS";

document.addEventListener("DOMContentLoaded", () => {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, () => {
    const unclompetedBOOKList = document.getElementById("books");
});

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}
