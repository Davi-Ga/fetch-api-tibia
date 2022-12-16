const tbody = document.getElementById('body_table');
const tbodyDuel = document.getElementById('body_table_duel');

const info = document.querySelector('.btn-times');

const previous = document.querySelector('.btn-previous');
const next = document.querySelector('.btn-next');


const title = document.getElementById('category');
let page = 1;

const worker = () => {
    const flag = new SharedArrayBuffer(4);
    const vetor = new SharedArrayBuffer(100*4);

    const flagView = new Int8Array(flag);
    const vetorView = new Int32Array(vetor);

    flagView[0] = 1;

    let workers =[];

    for (let i = 0; i < 10; i++) {
        workers.push(new Worker('worker.js'));
        workers[i].postMessage({flag, vetor});
    }
};

const defineWorld = () => {
    listaW=['Antica','Belobra','Calmera','Damora','Fera','Gentebra','Harmonia','Illusera','Kalibra','Quelibra',];
    elemento = listaW[Math.floor(Math.random()*listaW.length)];

    return elemento
};
const world = defineWorld()

const getHighscore = async(page,world)=>{
    const response = await fetch(`https://api.tibiadata.com/v3/highscores/${world}/swordfighting/knight/${page}`)
    if(response.status==200){
        const data = await response.json()
        return data
    }
}

const createTable = async(page,world)=>{
    const data = await getHighscore(page,world)
    
    if (data){
        title.innerHTML = data['highscores']['category']
        tbody.innerHTML = ""
        data["highscores"]['highscore_list'].forEach((element)=>{
            
            const highscores = `
            <tr>
                <th>${element.rank}</th>
                <th>${element.name}</th>
                <th>${element.vocation}</th>
                <th>${element.world}</th>
                <th>${element.level}</th>
                <th>${element.value}</th>

            </tr>
            `
            tbody.innerHTML += highscores
        })
        
    }
};

createTable(page,world)

previous.addEventListener('click', ()=>{
    if(page==1){
       alert('Não tem mais páginas')
    }
    else{
        page-=1
        return createTable(page,world)
    }
});

next.addEventListener('click', ()=>{
    page+=1
    
    return createTable(page,world)
    

});

info.addEventListener('click', ()=>{  
    worker()
});