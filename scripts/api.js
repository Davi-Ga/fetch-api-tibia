const tbody = document.getElementById('body_table');
const voltar = document.querySelector('.btn-voltar');
const proximo = document.querySelector('.btn-proximo');
const title = document.getElementById('category');
let page = 1;

const defineWorld = () => {
    listaW=['Antica','Belobra','Calmera','Damora','Fera','Gentebra','Harmonia','Illusera','Kalibra','Quelibra',]
    elemento = listaW[Math.floor(Math.random()*listaW.length)]

    return elemento
}
const world = defineWorld()
const getHighscore = async(page,world)=>{
    const response = await fetch(`https://api.tibiadata.com/v3/highscores/${world}/swordfighting/knight/${page}`)
    if(response.status==200){
        const data = await response.json()
        console.log(data['highscores']['category'])
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
}
createTable(page,world)
voltar.addEventListener('click', ()=>{
    if(page==1){
       alert('Não tem mais páginas')
    }
    else{
        page-=1
        return createTable(page)
    }
})

proximo.addEventListener('click', ()=>{
    page+=1
    return createTable(page)
    
})