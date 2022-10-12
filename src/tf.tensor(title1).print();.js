          tf.tensor(title1).print();
          model.embed(title1).then((embeddings1) => {
          console.log('halops');
          let tensorData1 = embeddings1.arraySync()
          console.log('tensorData arraySync', tensorData1);