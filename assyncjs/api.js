const tbody = document.getElementById('body_table');
const tbodyDuel = document.getElementById('body_table_duel');

const info = document.querySelector('.btn-times');

const previous = document.querySelector('.btn-previous');
const next = document.querySelector('.btn-next');


const title = document.getElementById('category');
let page = 1;

const worker = () => {
    const f = new SharedArrayBuffer(4);
    const v = new SharedArrayBuffer(100*4);

    const fView = new Int8Array(f);
    const vView = new Int32Array(v);

    fView[0] = 1;

    let workers =[];

    for (let i = 0; i < 10; i++) {
        workers.push(new Worker('worker.js'));
        workers[i].postMessage({f, v});
    }
};

const defineSkill = () => {
    listaS=['swordfighting','distancefighting','fishing','magiclevel','shielding'];
    elemento = listaS[Math.floor(Math.random()*listaS.length)];

    return elemento
}

const defineVocation = () => {
    listaW=['knights','paladins','druids','sorcerers','all'];
    elemento = listaW[Math.floor(Math.random()*listaW.length)];

    return elemento
}

const defineWorld = () => {
    listaW=['all','Antica','Damora','Fera','Harmonia','Illusera','Kalibra','Quelibra'];
    elemento = listaW[Math.floor(Math.random()*listaW.length)];

    return elemento
};
const world = defineWorld()
const skill = defineSkill()
const voc = defineVocation()

const getHighscore = async(page,world,skill,voc)=>{
    const response = await fetch(`https://api.tibiadata.com/v3/highscores/${world}/${skill}/${voc}/${page}`)
    if(response.status==200){
        const data = await response.json()
        return data
    }
}

const createTable = async(page,world,skill,voc)=>{
    const data = await getHighscore(page,world,skill,voc)
    
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

createTable(page,world,skill,voc)

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

info.addEventListener('click', ()=>{  
    worker()
});