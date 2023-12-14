
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

    const skillWeights = {
        'swordfighting': 16.3,
        'distancefighting': 10.7,
        'axefighting': 12.3,
        'shielding': 11.8,
    };
    
        for (let i = 0; i < pages.length; i++) {
            const skill = defineSkill()

            await fetch(`https://api.tibiadata.com/v4/highscores/all/${skill}/all/${pages[i]}`)
            .then(response => response.json())
            .then(data => {
                const groupSize = 5;
                const workerNumber = nome+1; // This should be the number of the current worker
                const offset =  10 * (workerNumber - 1); // Calculate the offset based on the worker number
                
                const groups = data.highscores?.highscore_list.reduce((acc, element, index) => {
                    const groupIndex = Math.floor(index / groupSize) + offset; // Add the offset to the group index
                    if (!acc[groupIndex]) {
                        acc[groupIndex] = {
                            vocations: [...vocationWeights], 
                            members: [],
                            groupWeight: 0 // Initialize groupWeight
                        };
                    }
                    const vocation = acc[groupIndex].vocations.splice(Math.floor(Math.random() * acc[groupIndex].vocations.length), 1)[0];
                    element.vocation = vocation;
                    acc[groupIndex].members.push(element);
                
                    acc[groupIndex].groupWeight += element.value * skillWeights[skill]; // Multiply the value with the skill weight
                
                    return acc;
                }, {});
                
                const jsonString = JSON.stringify(groups);

                const encodedText = textEncoder.encode(jsonString);
                let startIndex = Atomics.load(startIndexArray, 0);
                console.log("pagina numero", pages[i],"worker numero", nome)
            
            
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