if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/js/sw.js').then(() => {
    console.log('sw registered');
  });
}

const videos = [{'name': 'shader'}, {'name': 'twitter'}];

const db_name = 'videos';

let db;
let request = window.indexedDB.open(db_name, 1);

request.onerror = () => {
  console.error('Database failed to open');
};

request.onsuccess = () => {
  console.log(`Database opened successfully`);

  db = request.result;

  init();
};

request.onupgradeneeded = e => {
  let db = e.target.result; // onsuccessの前にonupgradeneededが呼ばれる可能性があり、その場合requestを参照できない

  let objectStore = db.createObjectStore(db_name, {
    keyPath: 'name',
    autoIncrement: true
  });
  // Databaseのスキーマを定義
  objectStore.createIndex('mp4', 'mp4', {unique: false});

  console.log('Database setup complete');
};

const init = () => {
  for (let v of videos) {
    let objectStore = db.transaction('videos').objectStore('videos');
    let request = objectStore.get(v.name);

    request.onsuccess = () => {
      if (request.result) {
        console.log('taking videos from IDB');
        displayVideo(request.result.mp4, request.result.name);
      } else {
        fetchVideoFromNetwork(v);
      }
    }
  }
};

const displayVideo = (blob, name) => {
  const article = document.createElement('div');

  const h2 = document.createElement('h2');
  h2.textContent = name;

  const video = document.createElement('video');
  video.controls = true;
  article.appendChild(video);

  const source = document.createElement('source');
  source.src = URL.createObjectURL(blob);
  source.type = 'video/mp4';
  video.appendChild(source);

  document.body.appendChild(article);
};

const fetchVideoFromNetwork = async video => {
  const response = await fetch(`videos/${video.name}.mp4`);
  const data = await response.blob();

  displayVideo(data, video.name);
  storeVideo(data, video.name);
};

const storeVideo = (mp4, name) => {
  const newItem = {
    name: name,
    mp4: mp4
  };

  const objectStore = db.transaction(['videos'], 'readwrite').objectStore('videos');

  var request = objectStore.add(newItem);

  request.onsuccess = () => {
    console.log(`${name}.mp4 is stored!!`);
  };

  request.onerror = () => {
    console.error(`attempt to store ${name}.mp4 is failed.`);
  }
};