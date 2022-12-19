//Constantes globais
const tbody = document.getElementById('body-table');
const tbodyparty = document.getElementById('body-table-party');
const previous = document.querySelector('.btn-previous');
const next = document.querySelector('.btn-next');
const part = document.getElementsByClassName('btn-party');
const title = document.getElementById('category');
const partyAn = document.querySelector('.btn-partyAn');
//Váriaveis globais
let playerid = 0
let playername = ''
let partylist=[]
let page = 1;

//Define a skill aleatória
const defineSkill = () => {
    //Cria uma lista com as skills e escolhe um elemento do array aleatoriamente com base no tamanho do array
    listaS=['swordfighting','distancefighting','fishing','magiclevel','shielding'];
    elemento = listaS[Math.floor(Math.random()*listaS.length)];

    return elemento
}

//Define a vocation aleatória
const defineVocation = () => {
    //Cria uma lista com as vocações e escolhe um elemento do array aleatoriamente com base no tamanho do array
    listaW=['knights','paladins','druids','sorcerers','all'];
    elemento = listaW[Math.floor(Math.random()*listaW.length)];

    return elemento
}

//Define o mundo aleatório
const defineWorld = () => {
    //Cria uma lista com os mundos e escolhe um elemento do array aleatoriamente com base no tamanho do array
    listaW=['all','Antica','Damora','Fera','Harmonia','Illusera','Kalibra','Quelibra'];
    elemento = listaW[Math.floor(Math.random()*listaW.length)];

    return elemento
};

//Define constantes com os valores aleatórios
const world = defineWorld()
const skill = defineSkill()
const voc = defineVocation()

//Função que faz a requisição da API com os parâmetros definidos acima
const getHighscore = async(page,world,skill,voc)=>{
    //Faz a requisição da API e verifica se o status é 200 retornando os dados
    const response = await fetch(`https://api.tibiadata.com/v3/highscores/${world}/${skill}/${voc}/${page}`)
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
            for(let i=0;i<part.length;i++){
                part[i].addEventListener('click',()=>{
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

//Chama a função que cria a tabela
createTable(page,world,skill,voc)

//Função que cria os workers
const worker = () => {
    let workers = [];
    const sin = new SharedArrayBuffer(2);
    const sinview = new Int8Array(f);
    const array = new SharedArrayBuffer(20*2);

    sinview[0] = 1;

    for (let i=0;i<5;i++) {
        workers.push(new Worker('worker.js'));
        workers[i].postMessage({sin, array});
    }
};

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

partyAn.addEventListener("click", () => {
    worker()
});


