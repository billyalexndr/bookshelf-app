const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const REMOVED_EVENT = "removed-book";
const STORAGE_KEY = "BOOK-APP";

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById("books");
    uncompletedBOOKList.innerHTML = "";

    const completedBOOKList = document.getElementById("completed-books");
    completedBOOKList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});

function addBook() {
    const bookTitle = document.getElementById("title").value;
    const bookAuthor = document.getElementById("penulis").value;
    const bookYear = document.getElementById("tahun").value;

    const generatedId = generateId();
    const bookObject = generateBookObject(
        generatedId,
        bookTitle,
        bookAuthor,
        bookYear,
        false
    );
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
}

function makeBook(bookObject) {
    const textTitle = document.createElement("h5");
    textTitle.classList.add("card-title");
    textTitle.innerText = bookObject.title;

    const textAuthorName = document.createElement("p");
    textAuthorName.innerText = bookObject.author;

    const textAuthor = document.createElement("p");
    textAuthor.classList.add("pe-2");
    textAuthor.innerText = "Penulis:";

    const authorContainer = document.createElement("div");
    authorContainer.classList.add("d-flex");
    authorContainer.style.height = "25px";
    authorContainer.append(textAuthor, textAuthorName);

    const textYearDate = document.createElement("p");
    textYearDate.innerText = bookObject.year;

    const textYear = document.createElement("p");
    textYear.classList.add("pe-2");
    textYear.innerText = "Tahun:";

    const yearContainer = document.createElement("div");
    yearContainer.classList.add("d-flex");
    yearContainer.append(textYear, textYearDate);

    const textContainer = document.createElement("div");
    textContainer.classList.add("card-body");
    textContainer.append(textTitle, authorContainer, yearContainer);

    const container = document.createElement("div");
    container.append(textContainer);
    container.classList.add("card");
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isComplete) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("btn", "btn-success");
        undoButton.innerText = "Belum Selesai Dibaca";

        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("btn", "btn-danger");
        trashButton.innerText = "Hapus Buku";

        trashButton.addEventListener("click", function () {
            removeBookFromCompleted(bookObject.id);
        });

        textContainer.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("btn", "btn-success");
        checkButton.innerText = "Sudah Selesai Dibaca";

        checkButton.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("btn", "btn-danger");
        trashButton.innerText = "Hapus Buku";

        trashButton.addEventListener("click", function () {
            removeBookFromCompleted(bookObject.id);
        });

        textContainer.append(checkButton, trashButton);
    }

    return container;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    removeData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function removeData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(REMOVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searching() {
    let keyword = document.getElementById("keyword").value;
    let filter = keyword.toLowerCase();

    let cards = document.getElementsByClassName("card-body");

    for (var i = 0; i < cards.length; i++) {
        var cardTitle = cards[i].getElementsByClassName("card-title")[0];
        var title = cardTitle.innerText.toLowerCase();
        if (title.indexOf(filter) > -1) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    searching();
});

document.addEventListener(SAVED_EVENT, () => {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(REMOVED_EVENT, () => {
    var x = document.getElementById("snackbar");

    x.className = "show";
    x.innerText = "Anda telah menghapus Buku...";

    setTimeout(function () {
        x.className = x.className.replace("show", "");
    }, 3000);
});
