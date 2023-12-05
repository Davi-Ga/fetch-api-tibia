//Constantes globais
const tbody = document.getElementById('body-table');
const tbodyparty = document.getElementById('body-table-party');
const tbodypartymaker = document.getElementById('body-table-party-maker');
const previous = document.querySelector('.btn-previous');
const next = document.querySelector('.btn-next');
const party = document.getElementsByClassName('btn-party');
const title = document.getElementById('category');
const partyAn = document.querySelector('.btn-partyAn');
//Váriaveis globais
let playerid = 0
let playername = ''
let partylist=[]
let page = 1;
let results = [];


//Define a skill aleatória
const defineSkill = () => {
    //Cria uma lista com as skills e escolhe um elemento do array aleatoriamente com base no tamanho do array
    const skills = ['swordfighting', 'distancefighting', 'fishing', 'magiclevel', 'shielding'];
    return skills[Math.floor(Math.random() * skills.length)];

}

//Define a vocation aleatória
const defineVocation = () => {
    //Cria uma lista com as vocações e escolhe um elemento do array aleatoriamente com base no tamanho do array
    const vocations = ['knights', 'paladins', 'druids', 'sorcerers', 'all'];
    return vocations[Math.floor(Math.random() * vocations.length)];
}

//Define o mundo aleatório
const defineWorld = () => {
    //Cria uma lista com os mundos e escolhe um elemento do array aleatoriamente com base no tamanho do array
     const worlds = ['all', 'Antica', 'Damora', 'Harmonia', 'Kalibra', 'Quelibra'];
    return worlds[Math.floor(Math.random() * worlds.length)];
};

//Define constantes com os valores aleatórios
const world = defineWorld()
const skill = defineSkill()
const voc = defineVocation()

//Função que faz a requisição da API com os parâmetros definidos acima
const getHighscore = async(page,world,skill,voc)=>{
    //Faz a requisição da API e verifica se o status é 200 retornando os dados
    const response = await fetch(`https://api.tibiadata.com/v4/highscores/${world}/${skill}/${voc}/${page}`)
    if(response.status==200){
        const data = await response.json()
        return data
    }
}

//Função que cria a tabela com os dados da API
const createTable = async(page,world,skill,voc)=>{
    //Aguarda a requisição da API e armazena os dados em uma variável data
    const data = await getHighscore(page,world,skill,voc)
    //Verifica se os dados não são nulos
    if (data){
        //Define o título da tabela com o nome da skill e a tabela como vazia
        title.innerHTML = data['highscores']['category']
        tbody.innerHTML = ""
        
        //Percorre a lista de highscores e cria uma linha para cada player
        data["highscores"]['highscore_list'].forEach((element)=>{
            
            //Cria uma constante com o html da linha
            const highscores = `
            <tr>
                <th>${element.rank}</th>
                <th>${element.name}</th>
                <th>${element.vocation}</th>
                <th>${element.world}</th>
                <th>${element.level}</th>
                <th>${element.value}</th>
                <td><button class="btn btn-info btn-party">Add</button></td>

            </tr>
            `
            //Adiciona a linha na tabela
            tbody.innerHTML += highscores

            //Laço de repetição para adicionar o evento de click no botão de adicionar player na party
            for(let i=0;i<party.length;i++){
                party[i].addEventListener('click',()=>{
                    //Variável flag para verificar se o player já está na party
                    let sin=0
                    //Verifica se o player já está na party utilizando seu nome
                    for(j=0;j<partylist.length;j++){
                        if(partylist[j].name==data['highscores']['highscore_list'][i]['name']){
                            //Se o player já estiver na party, ele não é adicionado e uma mensagem de erro é exibida
                            alert('Esse player está na party, escolha outro')
                            sin=1
                        }
                    }
                    //Verifica se a party está cheia
                    if(partylist.length<4){
                        //Se o player não estiver na party, ele é adicionado
                        if(sin!=1){
                            //Variável que armazena o nome do player através da lista de highscore definido por um índice i
                            playername=(data['highscores']['highscore_list'][i]['name'])
                            playervoc=(data['highscores']['highscore_list'][i]['vocation'])
                            //Adiciona o player na lista de party e cria uma linha na tabela de party
                            partylist.push({name:playername,vocation:playervoc})
                            
                            //Cria uma constante com o html da linha
                            const partytable=` 
                            <tr>
                            <th>${playername}</th>
                            <th>${playervoc}</th>
                            <tr>
                            `

                            //Adiciona a linha na tabela
                            tbodyparty.innerHTML += partytable
                        }
                    }else{
                        //Se a party estiver cheia, uma mensagem de erro é exibida
                        alert('Sua party está cheia')
                    }      
                })
            }
           

        })
    }
};

let workerData
let decodedTextResult
//Chama a função que cria a tabela
createTable(page,world,skill,voc)


partyAn.addEventListener("click", () => {
    worker().then(data => {
        data = data[data.length - 1]
        decodedTextResult = data.replace(/\]\[/g, ",");
        const jsonObject = JSON.parse(decodedTextResult);
        workerData = jsonObject;
           
    }).catch(error => {
        console.error('Error:', error);
    }).finally(() => {
        console.log('Decoded text:',workerData)
    });
});

//Função que cria os workers
function worker () {
    
    
    const buffer = new SharedArrayBuffer(1024**2);
    const buffer2 = new SharedArrayBuffer(1024**2);
    const bufferView = new Uint8Array(buffer);
    const bufferView2 = new Uint8Array(buffer2);
    let workers = [];
    const textDecoder = new TextDecoder();

    
    blockSize = 6900;
    bufferView[0] = 0;
    let promises = [];
        for (let i = 0; i < 25; i++) {
            const worker = new Worker('worker.js');
            workers.push(worker);
            let promise = new Promise((resolve, reject) => {
            worker.onmessage = event => {
                const sharedBufferFromWorker = event.data;
                console.log('Received buffer from worker:', sharedBufferFromWorker);
                const data = sharedBufferFromWorker[1].filter(value => value !== 0);
                let decodedText = textDecoder.decode(data);
                decodedText = decodedText.replace(/\]\[/g, ",");
               
                resolve(decodedText);
            };
            worker.onerror = reject;
            const page = i+1;
            const startIndexBuffer = new SharedArrayBuffer(512);
            const startIndexArray = new Int32Array(startIndexBuffer);
            startIndexArray[0] = i * blockSize;  
            worker.postMessage([bufferView,bufferView2,page,startIndexArray]);

        });
        promises.push(promise);
    };
    return Promise.all(promises);
}



//Eventos dos botões de paginação
previous.addEventListener('click', ()=>{
    if(page==1){
       alert('Não tem mais páginas')
    }
    else{
        page-=1
        return createTable(page,world,skill,voc)
    }
});

next.addEventListener('click', ()=>{
    page+=1
    
    return createTable(page,world,skill,voc)
});

