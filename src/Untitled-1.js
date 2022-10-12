import './popup.css';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

const MICROSECONDS_PER_DAY = 1000 * 60 * 60 * 24;
let globarr = {};
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
            title: call_universal(websiteLink.title),
            url: websiteLink.url,
            category: '',
          });
        }
      }
    }
  });
  return historyData;
};

export function pushData(payload) {
  console.log(payload, 'payload');
  // alert(JSON.stringify(payload));
  console.log(payload, 'data_pushing');
  fetch('http://35.174.167.230/embed_push', {
    // fetch('http://127.0.0.1:5000/push_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

export let historyData = [];

function onClickDownload() {
  const inputValue = document.getElementById('input-data').value;

  let userSelectedWebsites = checkUserCheckBox();
  if (inputValue) {
    document.getElementById('download-btn').innerText = 'Preparing...';
    const startTime = new Date().getTime() - MICROSECONDS_PER_DAY * 365 * 2;

    chrome.history.search(
      {
        text: '',
        startTime: startTime,
        maxResults: 50,
      },
      (websiteLinks) => {
        historyData = checkWebsiteRegex(websiteLinks, userSelectedWebsites);
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
let all_list = [];
async function call_universal(title) {
  call_universal_static();
  return false;
  // const data_mongo = retrive_embedding_db();
  console.log('data mongo function----->', data_mongo);
  await tf.ready();
  try {
    const sentences = [title];
    use.load().then((model) => {
      console.log(title, 'sentences');
      console.log(model, 'model');
      tf.tensor(sentences).print();
      model.embed(sentences).then((embeddings) => {
        let amit = embeddings;
        console.log('halops');
        let tensorData = embeddings.arraySync();
        embeddings.print(true);
        console.log(tensorData, 'tensorData');

        const serializedString = JSON.stringify(tensorData);
        console.log(serializedString, 'serializedString');
        let user_one_embedding = 'queen';
        let user_two_embedding = 'king';
        const comparison = tf.losses
          .cosineDistance(user_one_embedding, user_two_embedding, 0)
          .print();

        // const model = await use.load();
        const embeddings1 = model.embed(['queen', 'king']).unstack();
        const gg = tf.losses
          .cosineDistance(embeddings[0], embeddings[1], 0)
          .print(); // 0.39812755584716797

        // const comparison = retrive_embeddings_and_compute_similarity();
        console.log('comparison function----->', gg);

        all_list.push(tensorData);
        pushData(all_list);
        // console.log(tf.memory());
      });
    });
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}


function cosine_similarity_matrix(matrix){
    let cosine_similarity_matrix = [];
    for(let i=0;i<matrix.length;i++){
      let row = [];
      for(let j=0;j<i;j++){
        row.push(cosine_similarity_matrix[j][i]);
      }
      row.push(1);
      for(let j=(i+1);j<matrix.length;j++){
        row.push(this.similarity(matrix[i],matrix[j]));
      }
      cosine_similarity_matrix.push(row);
    }
    return cosine_similarity_matrix;
  }

async function call_universal_static(
  title1 = 'An adroit and proficient Software Engineer, Amit has 2+ years of experience in the software industry, successfully developing IT solutions, especially for different agencies following their enterprise grade development processes. He has expertise in designing high-performance, secure, and scalable web applications using the Python stack along with exposure in architecture, design, development, and maintenance of key components of web applications, integrating 3rd-party solutions, system deployment, OOP, and design patterns. He has skills in Machine Learning, solidity for Blockchain and on cloud services such as AWS and Azure.',
  title2 = 'Alpa is an open-source system for training and serving large-scale neural networks. Alpa aims to automate large-scale distributed training and serving with just a few lines of code. Alpa was initially developed by folks in the Sky Lab, UC Berkeley. Some advanced techniques used in Alpa have been written in a paper published in OSDI2022. Alpa community is growing with new contributors from Google, Amazon, Meta, and more.'
) {
  // const data_mongo = retrive_embedding_db();
  // console.log('data mongo function----->', data_mongo);
  await tf.ready();
  try {
    const sentences = [title1, title2];
    window.sentences1 = [title1, title2];
    use.load().then((model) => {
      console.log(title1, 'sentences');
      console.log(model, 'model');
      tf.tensor(sentences).print();
      model.embed(sentences).then((embeddings) => {
        window.amit = embeddings;

        let cosine_similarity_matrix = this.cosine_similarity_matrix(
          embeddings.arraySync()
        );
        console.log('cosine_similarity_matrix------->', cosine_similarity_matrix);

        // const comparison = tf.losses
        //   .cosineDistance(amit[0], amit[1], 0)
        //   .print();

        // console.log('comparison function----->', comparison);
        // const model = await use.load();
        // window.sentences1;
        window.embeddings1 = model.embed([sentences]).unstack();
        console.log('window.embeddings1----->', embeddings1);
        // window.embeddings1;
        window.gg = tf.losses
          .cosineDistance(embeddings1[0], embeddings1[1], 0)
          .print(); // 0.39812755584716797
        // const comparison = retrive_embeddings_and_compute_similarity();
        console.log('comparison function ggg----->', gg);
      });
    });
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
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

async function retrive_embedding_db() {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };
  fetch('http://35.174.167.230/gpt4', requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error));
}
