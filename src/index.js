// Create needed constants
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

let db;
let request = window.indexedDB.open('notes', 1);

request.onerror = () => {
  console.error('Database failed to open');
};

request.onsuccess = () => {
  console.log('Database opened successfully');

  db = request.result;

  displayData();
};

request.onupgradeneeded = e => {
  let db = e.target.result; // onsuccessの前にonupgradeneededが呼ばれる可能性があり、その場合requestを参照できない

  let objectStore = db.createObjectStore('notes', {
    keyPath: 'id',
    autoIncrement: true
  });
  // Databaseのスキーマを定義
  objectStore.createIndex('title', 'title', {unique: false});
  objectStore.createIndex('body', 'body', {unique: false});

  console.log('Database setup complete');
};

const addData = e => {
  e.preventDefault();

  let newItem = {
    title: titleInput.value,
    body: bodyInput.value
  };

  let transaction = db.transaction(['notes'], 'readwrite');

  let objectStore = transaction.objectStore('notes');

  var request = objectStore.add(newItem);
  request.onsuccess = () => {
    titleInput.value = '';
    bodyInput.value = '';
  };

  transaction.oncomplete = () => {
    console.log('Transaction completed: database modification finished.');

    displayData();
  };

  transaction.onerror = () => {
    console.log('Transaction not opened due to error');
  }
};

const deleteItem = e => {
  let noteId = +e.target.parentNode.getAttribute('data-note-id');

  let transaction = db.transaction(['notes'], 'readwrite');
  let objectStore = transaction.objectStore('notes');
  let request = objectStore.delete(noteId);

  transaction.oncomplete = () => {
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    console.log(`Note ${noteId} deleted.`);

    checkListEmpty();
  }
};

const displayData = () => {
  clearList();
  let objectStore = db.transaction('notes').objectStore('notes');

  objectStore.openCursor().onsuccess = e => {
    let cursor = e.target.result;

    if (cursor) {
      let listItem = createListItem(cursor.value.title, cursor.value.body, cursor.value.id);
      list.appendChild(listItem);

      cursor.continue();
    } else {
      checkListEmpty();

      console.log('Notes all displayed');
    }
  };
};

const clearList = () => {
  while (list.firstChild) list.removeChild(list.firstChild);
};

const createListItem = (title, body, id) => {
  let listItem = document.createElement('li');
  listItem.setAttribute('data-note-id', id);

  let h3 = document.createElement('h3');
  h3.textContent = title;
  listItem.appendChild(h3);

  let para = document.createElement('p');
  para.textContent = body;
  listItem.appendChild(para);

  let deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = deleteItem;
  listItem.appendChild(deleteBtn);

  return listItem;
};

const checkListEmpty = () => {
  if (!list.firstChild) {
    let listItem = document.createElement('li');
    listItem.textContent = 'No notes stored.';
    list.appendChild(listItem);
  }
};

form.onsubmit = addData;

