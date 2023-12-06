
self.onmessage = async ({ data: buffer }) => {
    const bufferView = buffer[0];
    const bufferView2 = buffer[1];
    const page = buffer[2];
    const startIndexArray = buffer[3];
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    let peso = 1;
    console.log('Worker received buffer:', page);
    const vocationWeights = {
        'Elite Knight': 50,
        'Elder Druid': 30,
        'Master Sorcerer': 20,
        'Royal Paladin': 45,
        'Knight': 15,
        'Druid': 5,
        'Sorcerer': 1,
        'Paladin': 10,
    };
    const worldsWeights = {
        'Antica': 60,
        'Ambra': 30,
        'Descubra': 20,
        'Celebra': 50,
        'Gentebra': 30,
        'Ombra': 15,
        'Solidera': 25,
        'Zuna': 55,
    };
        

        await fetch(`https://api.tibiadata.com/v4/highscores/all/shielding/all/${page}`)
            .then(response => response.json())
            .then(data => {
                const jsonString = JSON.stringify(data.highscores.highscore_list);
                const encodedText = textEncoder.encode(jsonString);
                let startIndex = Atomics.load(startIndexArray, 0);
                
                if (encodedText.length > bufferView2.length - startIndex) {
                    throw new Error('Buffer is not large enough to store the data');
                }
                
                // Copie os dados para o bufferView
                for (let i = 0; i < encodedText.length; i++) {
                    
                    Atomics.store(bufferView2, startIndex+i, encodedText[i]);
                    
                }
                const dataRefactor = bufferView2.filter(value => value !== 0);
                let decodedText = textDecoder.decode(dataRefactor);
                decodedText = decodedText.replace(/\]\[/g, ",");
                let decodedTextJson = JSON.parse(decodedText);
                
                decodedTextJson.sort((a, b) => {
                    const weightA = vocationWeights[a.vocation] || 0; // If vocation is not in the weights object, assign it a weight of 0
                    const weightB = vocationWeights[b.vocation] || 0;
                    return weightB - weightA;// Sort in descending order of weights
                }).sort((a, b) => {
                    const weightA = worldsWeights[a.world] || 0; // If world is not in the weights object, assign it a weight of 0
                    const weightB = worldsWeights[b.world] || 0;
                    return weightB - weightA;// Sort in descending order of weights
                });
                
                console.log('Decoded text ordenated:', decodedTextJson);

                const jsonStringRefac = JSON.stringify(decodedTextJson);
                const encodedTextRefac = textEncoder.encode(jsonStringRefac);

                for (let i = 0; i < encodedTextRefac.length; i++) {
                  

                    Atomics.store(bufferView, startIndex+i, encodedTextRefac[i]);
                    
                }
                Atomics.add(startIndexArray, 0, encodedText.length);
                self.postMessage([bufferView, bufferView2]);

            })
            .catch(error => {
                // Handle the error
                console.error('Error:', error);
            });
}
    /* EU TE AMO UM TANTÃO */