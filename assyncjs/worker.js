self.onmessage = async ({data: buffer}) => {
    const bufferView = new Uint8Array(buffer[0]);
    const bufferView2 = new Uint8Array(buffer[1]);

    console.log('SharedArray received in worker:', bufferView);

    const textEncoder = new TextEncoder();

    await fetch('https://api.tibiadata.com/v3/highscores/all/shielding/all/2')
        .then(response => response.json())
        .then(data => {
            const jsonString = JSON.stringify(data.highscores.highscore_list);
            const encodedText = textEncoder.encode(jsonString);
            console.log('Encoded text:', encodedText.length);
            console.log(bufferView2.length);
            if (encodedText.length > bufferView2.length) {
                throw new Error('Buffer is not large enough to store the data');
            }

            // Copie os dados para o bufferView
            for (let i = 0; i < encodedText.length; i++) {
                bufferView2[i] = encodedText[i];
            }
           

            self.postMessage([bufferView, bufferView2]);
            console.log('SharedArray filled in worker:', bufferView2);

        })
        .catch(error => {
            // Handle the error
            console.error('Error:', error);
        });
}