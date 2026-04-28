const maxBooks = 10;
let books = [
    { title: "To Kill a Mockingbird", author: "Harper Lee" },
    { title: "1984", author: "George Orwell" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "Pride and Prejudice", author: "Jane Austen" }
];

function displayBooks() {
    const ul = document.getElementById('book-ul');
    ul.innerHTML = '';
    books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} by ${book.author}`;
        ul.appendChild(li);
    });
}

function updateRemoveSelect() {
    const select = document.getElementById('remove-select');
    select.innerHTML = '<option value="">Select a book to remove</option>';
    books.forEach((book, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${book.title} by ${book.author}`;
        select.appendChild(option);
    });
}

document.getElementById('add-btn').addEventListener('click', () => {
    const title = document.getElementById('book-title').value.trim();
    const author = document.getElementById('book-author').value.trim();
    const message = document.getElementById('add-message');
    if (!title || !author) {
        message.textContent = 'Please enter both title and author.';
        return;
    }
    if (books.length >= maxBooks) {
        message.textContent = 'Catalogue is full. Cannot add more books.';
        return;
    }
    const exists = books.some(book => book.title.toLowerCase() === title.toLowerCase());
    if (exists) {
        message.textContent = 'Book with this title already exists.';
        return;
    }
    books.push({ title, author });
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    message.textContent = 'Book added successfully!';
    displayBooks();
    updateRemoveSelect();
    setTimeout(() => message.textContent = '', 3000);
});

document.getElementById('search-btn').addEventListener('click', () => {
    const searchTitle = document.getElementById('search-title').value.trim().toLowerCase();
    const results = document.getElementById('search-results');
    if (!searchTitle) {
        results.innerHTML = '<p>Please enter a title to search.</p>';
        return;
    }
    const found = books.filter(book => book.title.toLowerCase().includes(searchTitle));
    if (found.length === 0) {
        results.innerHTML = '<p>No books found with that title.</p>';
    } else {
        results.innerHTML = '<ul>' + found.map(book => `<li>${book.title} by ${book.author}</li>`).join('') + '</ul>';
    }
});

document.getElementById('remove-btn').addEventListener('click', () => {
    const select = document.getElementById('remove-select');
    const index = select.value;
    const message = document.getElementById('remove-message');
    if (index === '') {
        message.textContent = 'Please select a book to remove.';
        return;
    }
    books.splice(index, 1);
    message.textContent = 'Book removed successfully!';
    displayBooks();
    updateRemoveSelect();
    setTimeout(() => message.textContent = '', 3000);
});

// Initial display
displayBooks();
updateRemoveSelect();
