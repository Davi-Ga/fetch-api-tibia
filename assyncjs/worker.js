self.onmessage = async ({data: buffer}) => {
    
    const bufferView = buffer[0];
    const bufferView2 = buffer[1];
    const page = buffer[2];
    const startIndexArray = buffer[3];
    const textEncoder = new TextEncoder();
    console.log('Worker received buffer:', page);
        
        await fetch(`https://api.tibiadata.com/v4/highscores/all/shielding/all/${page}`)
            .then(response => response.json())
            .then(data => {

                const jsonString = JSON.stringify(data.highscores.highscore_list);
                data.highscores.highscore_list[0]
                const encodedText = textEncoder.encode(jsonString);
                let startIndex = Atomics.load(startIndexArray, 0);
                console.log(bufferView)
                
                if (encodedText.length > bufferView2.length - startIndex) {
                    throw new Error('Buffer is not large enough to store the data');
                }
                
                // Copie os dados para o bufferView
                for (let i = 0; i < encodedText.length; i++) {
                    
                    Atomics.store(bufferView2, startIndex+i, encodedText[i]);
                    
               }
            
                Atomics.add(startIndexArray, 0, encodedText.length);
                self.postMessage([bufferView, bufferView2]);
                console.log('SharedArray filled in worker:', bufferView2);




            })
            .catch(error => {
                // Handle the error
                console.error('Error:', error);
            });
    }