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
        console.log(data[0])
        workerData = JSON.parse(data[0]);
        console.log(workerData)
           
    }).catch(error => {
        console.error('Error:', error);
    }).finally(() => {
        
        workerData.slice(0, 10).map((group,index) => {
            console.log(group)
            let test = group.groupWeight *(10 - index+1)
            // Criar uma nova tabela para cada grupo
            const table = `
            <table>
                <thead>
                    <tr>
                        <th colspan="2">Group ${index + 1} ${test}</th>
                    </tr>
                </thead>
                <tbody>
                    ${group.members.slice(0, 5).map((member) => `
                    <tr>
                        <th>${member.name}</th>
                        <th>${member.vocation}</th>
                    </tr>
                    `).join('')}
                </tbody>
            </table>
            `;
        
            tbodypartymaker.innerHTML += table;
            });
        });
});

//Função que cria os workers
function worker () {
    
    
    const buffer = new SharedArrayBuffer(1024**2);
    const bufferView = new Uint8Array(buffer);
    
    const textDecoder = new TextDecoder();

    
    blockSize = 1024*200;
    let promises = [];
        for (let i = 0; i < 2; i++) { 
            const worker = new Worker('worker.js');
            let promise = new Promise((resolve, reject) => {
            worker.onmessage = event => {
                const sharedBufferFromWorker = event.data;
                const data = sharedBufferFromWorker[0].filter(value => value !== 0);
                let decodedText = textDecoder.decode(data);
                decodedText = decodedText.replace(/\]\[/g, ",");
                decodedText = decodedText.replace(/\}\{/g, ",");
                let groupsObject = JSON.parse(decodedText);

                // Converter o objeto em um array   
                let groups = Object.values(groupsObject);

                // Ordenar os grupos
                groups.sort((a, b) => b.groupWeight - a.groupWeight);
                decodedText = JSON.stringify(groups);

               
                resolve(decodedText);
                worker.terminate(); 
            };
            worker.onerror = error => {
                reject(error);
                worker.terminate(); // Encerra o Worker em caso de erro
            };
            const startIndexBuffer = new SharedArrayBuffer(512);
            const startIndexArray = new Int32Array(startIndexBuffer);
            let pages = Array.from({length: 5}, (_, index) => (i * 5) + index + 1);
            startIndexArray[0] = i * blockSize;  
            worker.postMessage([bufferView,pages,startIndexArray, i]);

        });
        promises.push(promise);
    };
    return Promise.all(promises);
}
/* 1  2  3  4  5     0 * 5 + 1
   6  7  8  9  10    1 * 5 + 1
   11 12 13 14 15    2 
   16 17 18 19 20    3
   21 22 23 24 25    4
   */


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

