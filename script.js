const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF-APPS";

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
    const unclompetedBOOKList = document.getElementById("books");
    unclompetedBOOKList.innerHTML = "";

    const completedBOOKList = document.getElementById("completed-books");
    completedBOOKList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            unclompetedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
    console.log("buku" + books);
});

function addBook() {
    const judulBuku = document.getElementById("judulBuku").value;
    const penulisBuku = document.getElementById("penulisBuku").value;
    const tahunBuku = document.getElementById("tahunBuku").value;
    const generateID = generateID();

    const bookObject = generateBookObject(
        generateID,
        judulBuku,
        penulisBuku,
        tahunBuku,
        false
    );
    books.push(bookObject);
    // console.log("tets" + bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateID() {
    return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isCompleted,
    };
}

function makeBook(bookObject) {
    const bookTitle = document.createElement("h5");
    bookTitle.innerText = bookObject.judul;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("pe-2");

    const bookAuthorName = document.createElement("p");
    bookAuthorName.innerText = bookObject.penulis;

    const bookYear = document.createElement("p");
    bookYear.classList.add("pe-2");

    const bookYearDate = document.createElement("p");
    bookYearDate.innerText = bookObject.tahun;

    const bookAuthorContainer = document.createElement("div");
    bookAuthorContainer.classList.add("d-flex");
    bookAuthorContainer.style.add("height: 25px");
    bookAuthor.append(bookAuthor, bookAuthorName);

    const bookYearContainer = document.createElement("div");
    bookYearContainer.classList.add("d-flex");
    bookYearContainer.append(bookYear, bookYearDate);

    const container = document.createElement("div");
    container.classList.add("card-body");
    container.append(bookTitle, bookAuthorContainer, bookYearContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("btn btn-success");
        undoButton.innerText = "Belum Selesai Dibaca";

        undoButton.addEventListener("click", function () {
            undoBookFromCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("btn btn-danger");
        trashButton.innerText = "Hapus Buku";

        trashButton.addEventListener("click", function () {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("btn btn-succes");
        checkButton.innerText = "Belum Selesai Dibaca";

        checkButton.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("btn btn-danger");
        trashButton.innerText = "Hapus Buku";

        trashButton.addEventListener("click", function () {
            removeBookFromCompleted(bookObject.id);
        });

        container.append(checkButton, trashButton);
    }

    return container;
}

function addBookToCompleted() {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
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
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
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

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    // // Get the snackbar DIV
    // var x = document.getElementById("snackbar");

    // // Add the "show" class to DIV
    // x.className = "show";
    // x.innerText = "Haii ini adalah Toast Message...";

    // // After 3 seconds, remove the show class from DIV
    // setTimeout(function () {
    //     x.className = x.className.replace("show", "");
    // }, 3000);
});
