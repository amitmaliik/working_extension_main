var all_list = [];
async function call_universal() {
  // calcSimilarity(title);
  // call_universal_static();
  // return false;
  // const data_mongo = retrive_embedding_db();
  // console.log('data mongo function----->', title);
  await tf.ready();
  try {
    // const sentences = [title];
        for (var i = 0; i < historyData.length; i++) {
      console.log(historyData[i], i, 'historyData');
    use.load().then((model) => {
      tf.tensor(sentences).print();
      model.embed(sentences).then((embeddings) => {
        // let amit = embeddings;
        console.log('halops');
        let tensorData = embeddings.arraySync();
        console.log(tensorData.length, 'tensorData arraySync', tensorData);
        all_list.push(tensorData);
        // calcSimilarity(title);
        embeddings.print(true);

        const serializedString = JSON.stringify(tensorData);
        // console.log(serializedString, 'serializedString stringify');

        // const comparison = tf.losses
        //   .cosineDistance(user_one_embedding, user_two_embedding, 0)
        //   .print();
        // // const model = await use.load();
        // const embeddings1 = model.embed(['queen', 'king']).unstack();
        // const gg = tf.losses
        //   .cosineDistance(embeddings[0], embeddings[1], 0)
        //   .print(); // 0.39812755584716797
        // // const comparison = retrive_embeddings_and_compute_similarity();
        // console.log('comparison function----->', gg);

          //   console.log(historyData.length, 'historyData.length');
          //   all_list.push(tensorData);
          // console.log(key, yourobject[key]);
        }
        console.log(all_list, 'all_list');
        pushData(all_list);
        // console.log(tf.memory());
      });
    });
  } catch (err) {
    console.log(`ERROR: ${err}`);
  }
}
