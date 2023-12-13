
self.onmessage = async ({ data: buffer }) => {
    const bufferView = buffer[0];
    const pages = buffer[1];
    const startIndexArray = buffer[2];
    const textEncoder = new TextEncoder();
    const nome = buffer[3];
   
    const vocationWeights = [
        'Elite Knight',
        'Elder Druid',
        'Master Sorcerer',
        'Royal Paladin',
        'Knight',
    ];
   
    const defineSkill = () => {
        const skills = ['swordfighting', 'distancefighting', 'axefighting', 'shielding'];
        return skills[Math.floor(Math.random() * skills.length)];
    
    }
    
        for (let i = 0; i < pages.length; i++) {
            skills = defineSkill()

            await fetch(`https://api.tibiadata.com/v4/highscores/all/${skills}/all/${pages[i]}`)
            .then(response => response.json())
            .then(data => {
                const groupSize = 5;

                const groups = data.highscores?.highscore_list.reduce((acc, element, index) => {
                    const groupIndex = Math.floor(index / groupSize);
                    if (!acc[groupIndex]) {
                        acc[groupIndex] = {
                            vocations: [...vocationWeights], 
                            members: []
                        };
                    }
                    const vocation = acc[groupIndex].vocations.splice(Math.floor(Math.random() * acc[groupIndex].vocations.length), 1)[0];
                    element.vocation = vocation;
                    acc[groupIndex].members.push(element);
                    return acc;
                }, {});

                console.log(JSON.stringify(groups, null, 2));
                
                const jsonString = JSON.stringify(data.highscores?.highscore_list);

                const encodedText = textEncoder.encode(jsonString);
                let startIndex = Atomics.load(startIndexArray, 0);
                console.log("pagina numero", pages[i],"worker numero", nome)
                console.log()
            
            
                // Copie os dados para o bufferView
                for (let i = 0; i < encodedText.length; i++) {
                    
                    Atomics.store(bufferView, startIndex+i, encodedText[i]);
                    
                }
              
                Atomics.add(startIndexArray,0, encodedText.length);

            })
            .catch(error => {
                // Handle the error
                console.error('Error:', error);
            });
        }
        self.postMessage([bufferView, startIndexArray]);



}

// 10 grupos de 5 personagens
// rankear todos os 1200 personagens


       //XUXUZINHO MEU EU TE AMOI
    /* EU TE AMO UM TANTÃO te amo te*/