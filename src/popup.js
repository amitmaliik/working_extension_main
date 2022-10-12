import './popup.css';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

const MICROSECONDS_PER_DAY = 1000 * 60 * 60 * 24;
let user_address = false;
let count1 = 0;

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

  websiteLinks.forEach(async (websiteLink) => {
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
        console.log('final', final, 'historyData', websiteLink.title);

        if (final) {
          // var func_call = await call_universal_tf_ready_static_title(
          //   websiteLink.title
          // );

          historyData.push({
            id: websiteLink.id,
            visitCount: websiteLink.visitCount,
            title: websiteLink.title,
            url: websiteLink.url,
            category: '',
          });

          // console.warn('functioncall loop', historyData);

          // return false;
          // amit
          // use.load().then((model) => {
          //   model.embed(websiteLink.title).then((embeddings) => {
          //     // console.log(await embeddings);
          //     title_embedding = embeddings.arraySync();
          //     console.log(
          //       'vec',
          //       websiteLink.title,
          //       'vec[0]',
          //       'vec[1]',
          //       title_embedding[0]
          //     );
          //     // title = vec;
          //     // title_embedding=vec
          //   });
          // });
          // console.log('timeout complete');

          // // let title = await stackoverflow_tf_ready(websiteLink.title);

          // console.warn('running', title_embedding);
          // historyData.push({
          //   id: websiteLink.id,
          //   visitCount: websiteLink.visitCount,
          //   // title: websiteLink.title,
          //   title: title_embedding,
          //   url: websiteLink.url,
          //   category: '',
          // });
        }
      }
    }
  });
  console.log('historyData list ', historyData);
  var func_call = call_universal_tf_ready_static_title(historyData);

  console.log(historyData.length, 'historyData.length.main');
  console.log(func_call, 'func_call');
  return historyData.length;
};

function new_fun() {
  console.log(all_list.length, 'all_list.length');
  console.log(userSelectedWebsites.length, 'userSelectedWebsites.length');
  if (count1 == 0) {
    console.log(count1, 'count1');

    call_universal_tf_ready_static_title(historyData);
    console.warn('andar');

    count1 = 100;
    console.log(count1, 'count3');
  }

  console.log(historyData.length, 'Amitmalik');
  let payload = {
    historyData: historyData,
    address: 'amit',
  };

  pushData(payload);
  console.log('datapost');

  // return [payload, 'septmber'];
}

function pushData(payload) {
  // alert(JSON.stringify(payload));
  window.mypayload = payload;
  console.log(payload, 'data_pushing');
  if (payload.length == 0) {
    console.log('khaali');
    return false;
  }

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
        maxResults: 3,
      },
      (websiteLinks) => {
        historyData = checkWebsiteRegex(websiteLinks, userSelectedWebsites);
        // console.log(historyData, 'Amitmalik');
        // let payload = {
        //   historyData: historyData,
        //   address: inputValue,
        // };
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

var all_list = [];
var all_list1 = [];
async function call_universal_tf_ready_static_title(historyData) {
  // bus_embedding(categories);
  // return false;
  for (let i = 0; i < historyData.length; i++) {
    let title_val = historyData[i].title;
    console.log('site', title_val);
    console.log('inside call_universal_tf_ready_static_title function');
    await tf.ready();
    try {
      console.log(title_val, 'historyData');
      await use.load().then(async (model) => {
        tf.tensor(title_val).print();
        await model.embed(title_val).then(async (embeddings1) => {
          let tensorData1 = await embeddings1.arraySync();
          console.log('tensorData11111111', tensorData1);
          const serializedString = JSON.stringify(tensorData1);
          console.log('serializedString', serializedString);
          all_list1.push(tensorData1);
        });
      });
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  }

  console.log(all_list1, 'all_list');
  // pushData(all_list1);
  console.log('psuhing of data done to mongo');

  var aa = send_Data(all_list1);
  console.log(all_list1, all_list1.length, 'all_list1');
  // bus_embedding(categories);
  return all_list1;
}

function send_Data(all_list1) {
  // check = call_universal_tf_ready_static_title.isFulfilled();
  // if (check) {

  pushData(all_list1);
  console.log('inside send_Data');
  // }
}

// function stackoverflow_tf_ready(hd) {

// async function stackoverflow_tf_ready(sentences) {
//   console.log(sentences, 'hdd');
//   await use.load().then(async (model) => {
//     await model.embed(sentences).then(async (embeddings) => {
//       // console.log(await embeddings);
//       const vec = await embeddings.arraySync();
//       console.log('vec', sentences, 'vec[0]', 'vec[1]', vec);
//       all_list.push(vec);
//       return vec;
//     });
//   });
//   console.table('table start');
//   console.table(all_list);
//   console.table('table end');
// }

// async function call_universal_tf_ready(historyData) {
//   console.log('inside call_universal_tf_ready function');
//   let cal2 = stackoverflow_tf_ready(historyData);
//   console.console.log(cal2, 'cal2');

//   // let calll=find_similarity_pair()

//   console.console.log(calll);
//   return false;
// }

// // main function

// async function stackoverflow_tf_ready(historyData) {
//   // retrive_embedding_db();
//   await call_universal_tf_ready(historyData);
//   pushData(all_list);
// }

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

async function calcSimilarity(data_mongo_val, title) {
  // window.first_person = Object.values(data_mongo_val)[0];
  // first_person = Object.values(first_person)[0];

  // window.second_person = Object.values(data_mongo_val)[1];
  // second_person = Object.values(second_person)[0];
  // window.first_person1 = data_mongo_val[0];
  // console.log(
  //   first_person.length,
  //   first_person,
  //   'inside calcSimilarity data_mongo_val'
  // );

  // const similarity = cosineSimilarity(first_person[i], second_person[i]);
  const similarity = cosineSimilarity(data_mongo_val, title);
  // for (let i = 0; i < first_person.length; i++) {
  //   console.log(i, 'index');
  //   console.log(first_person[i], second_person[i]);
  //   const similarity = cosineSimilarity(first_person[i], second_person[i]);
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

let token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY2Mjg3OTc2MywianRpIjoiMDYxMTUzNDUtMzQ4MC00OTkyLThmMDItNDE4NzdlNGRhY2Y0IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IjFAZ21haWwuY29tIiwibmJmIjoxNjYyODc5NzYzLCJleHAiOjE2Nzg0MzE3NjN9.BbCahlTBXGjEM7H09FB7PT-J0zzIckSAAkEnzvE8lJE';

function retrive_embedding_db() {
  console.log('retrive_embedding_db');
  let parsedJwt = parseJwt(token);
  console.log('parsedJwt', parsedJwt['sub']);

  var requestOptions = {
    method: 'GET',
  };
  fetch('http://35.174.167.230/user_recommend', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(Object.values(result), 'data retrived succes');
      // calcSimilarity(Object.values(result));
      // cosinesim(Object.values(result)[0], Object.values(result)[1]);
      stackoverflow_tf_ready(Object.values(result));
    })
    .catch((error) => console.log('error in retriving data', error));
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
