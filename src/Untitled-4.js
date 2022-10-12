import './popup.css';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

const MICROSECONDS_PER_DAY = 1000 * 60 * 60 * 24;
let globarr = {};
let user_address = false;
let count1 = 0;
// const globarr = {setTimeout(embed_s3_call, 20000)}

document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('download-btn')
    .addEventListener('click', onClickDownload);
});

const checkUserCheckBox = () => {
  let userSelectedWebsites = [];
  if (document.getElementById('youtube').checked == true) {
    userSelectedWebsites.push('youtube');
  }
  if (document.getElementById('twitter').checked == true) {
    userSelectedWebsites.push('twitter');
  }
  if (document.getElementById('spotify').checked == true) {
    userSelectedWebsites.push('spotify');
  }
  if (document.getElementById('quora').checked == true) {
    userSelectedWebsites.push('quora');
  }
  if (document.getElementById('medium').checked == true) {
    userSelectedWebsites.push('medium');
  }
  if (document.getElementById('google-news').checked == true) {
    userSelectedWebsites.push('news.google.com');
  }
  if (document.getElementById('all').checked == true) {
    userSelectedWebsites.push('all');
  }
  console.log(userSelectedWebsites);
  return userSelectedWebsites;
};

const checkWebsiteRegex = (websiteLinks, userSelectedWebsites) => {
  let historyData = [];
  console.log(userSelectedWebsites, 'console.log(userSelectedWebsites)');
  websiteLinks.forEach((websiteLink) => {
    for (let i = 0; i < userSelectedWebsites.length; i++) {
      let userSelectedWebsite = userSelectedWebsites[i];
      console.log('inside for loop indivaiduallll', userSelectedWebsite);
      if (userSelectedWebsite == 'all') {
        historyData.push({
          id: websiteLink.id,
          visitCount: websiteLink.visitCount,
          title: websiteLink.title,
          url: websiteLink.url,
          category: '',
        });
      } else {
        function useRegex(input, site) {
          let rex = new RegExp('^(https?://)?((www.)?' + site + '.com)');
          return rex.test(input);
        }
        let final = useRegex(websiteLink.url, userSelectedWebsite);
        console.log('final', final);

        if (final) {
          historyData.push({
            id: websiteLink.id,
            visitCount: websiteLink.visitCount,
            title: websiteLink.title,
            // title: callUniversal(websiteLink.title),
            url: websiteLink.url,
            category: '',
          });
        }
      }
    }
  });
  console.log(historyData);
  console.log(userSelectedWebsites.length, 'userSelectedWebsites.length');
  if (count1 == 0) {
    console.log(count1, 'count1');
    callUniversal(historyData);
    count1 = 3;
    console.log(count1, 'count3');
  }
};

function pushData(payload) {
  // alert(JSON.stringify(payload));
  window.mypayload = payload;
  console.log(payload, 'data_pushing');
  let objj = {};
  objj['embeddings'] = payload;
  objj['address'] = user_address;
  console.log(objj);
  // fetch('http://35.174.167.230/embed_push', {
  fetch('http://35.174.167.230/push_data', {
    // fetch('http://127.0.0.1:5000/push_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(objj),
  })
    .then(function (response) {
      return response.text();
    })
    .then(function (response) {
      console.log('success! history pushed to db for recommendation!');
    })
    .catch(function (response) {
      // alert(response);
    })
    .finally(() => {
      document.getElementById('download-btn').innerText = 'Put History';
    });
}

export var historyData = [];
function onClickDownload() {
  const inputValue = document.getElementById('input-data').value;
  user_address = inputValue;
  let userSelectedWebsites = checkUserCheckBox();
  if (inputValue) {
    document.getElementById('download-btn').innerText = 'Preparing...';
    const startTime = new Date().getTime() - MICROSECONDS_PER_DAY * 365 * 2;

    chrome.history.search(
      {
        text: '',
        startTime: startTime,
        maxResults: 250,
      },
      (websiteLinks) => {
        historyData = checkWebsiteRegex(websiteLinks, userSelectedWebsites);
        console.log(historyData);
        let payload = {
          historyData: historyData,
          address: inputValue,
        };
        // pushData(payload);
      }
    );

    console.log(historyData, 'amit');
    document.getElementById('download-btn').innerText =
      'Push history to DB for recommendation.';
  } else {
    alert('Please enter a address');
  }
}

async function call_universal_tf_ready(historyData) {
  console.log('inside call_universal_tf_ready function');
  await tf.ready();
  try {
    for (var i = 0; i < historyData.length; i++) {
      console.log(
        historyData.length,
        '<------------------------historyData.length'
      );
      let title_val = historyData[i].title;
      console.log(title_val, i, 'historyData');
      await use.load().then((model) => {
        tf.tensor(title_val).print();
        model.embed(title_val).then((embeddings) => {
          console.log('halops');
          let tensorData = embeddings.arraySync();
          console.log('tensorData arraySync', tensorData);
          all_list.push(tensorData);
          calcSimilarity(tensorData);
          embeddings.print(true);
          const serializedString = JSON.stringify(tensorData);
          // console.log(serializedString, 'serializedString stringify');
        });
      });
    }
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}

var all_list = [];
async function callUniversal(historyData) {
  retrive_embedding_db();
  // await call_universal_tf_ready(historyData);
  // pushData(all_list);
}

// Helper functions
const dotProduct = (a, b) => {
  let product = 0;
  for (let i = 0; i < a.length; i++) {
    product += a[i] * b[i];
  }
  return product;
};

const magnitude = (vector) => {
  let sum = 0;
  for (let value of vector) {
    sum += value * value;
  }
  return Math.sqrt(sum);
};

const cosineSimilarity = (a, b) => {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
};

// const globarr = {setTimeout(embed_s3_call, 20000)}
// var data_mongo = setTimeout(retrive_embedding_db, 10000);

// var data_mongo_val = retrive_embedding_db();
// // var data_mongo_val = Object.values(data_mongo);
// console.log(data_mongo_val, 'retrive_embedding_db data_mongo_val');
// console.log(typeof data_mongo_val, 'typeof data_mongo_val');

async function calcSimilarity(data_mongo_val,title="i love milk") {
  // window.first_person = Object.values(data_mongo_val)[0];
  // first_person = Object.values(first_person)[0];

  // window.second_person = Object.values(data_mongo_val)[1];
  // second_person = Object.values(second_person)[0];
  // window.first_person1 = data_mongo_val[0];
  console.log(first_person.length, first_person, 'data_mongo_val');

  const similarity = cosineSimilarity(first_person[i], second_person[i]);
  console.log(`${(similarity * 100).toFixed(2)}% similarity`);
  // for (let i = 0; i < first_person.length; i++) {
  //   console.log(i, 'index');
  //   console.log(first_person[i], second_person[i]);
  //   const similarity = cosineSimilarity(first_person[i], second_person[i]);
  //   console.log(`${(similarity * 100).toFixed(2)}% similarity`);
  // }
}

// async function retrive_embeddings_and_compute_similarity(
//   user_one_embedding,
//   user_two_embedding
// ) {
//   // const model = await use.load();
//   // const embeddings = (await model.embed(['queen', 'king', 'kind'])).unstack();
//   // tf.losses.cosineDistance(embeddings[0], embeddings[1], 0).print(); // 0.39812755584716797
//   tf.losses.cosineDistance(user_one_embedding, user_two_embedding, 0).print(); // 0.39812755584716797
// }

function retrive_embedding_db() {
  console.log('retrive_embedding_db');

  var requestOptions = {
    method: 'GET',
  };
  fetch('http://35.174.167.230/user_recommend', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(Object.values(result), 'data retrived succes');
      calcSimilarity(Object.values(result));
    })
    .catch((error) => console.log('error in retriving data', error));
}
