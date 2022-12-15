const tbody = document.getElementById('body_table');
const voltar = document.querySelector('.btn-voltar');
const proximo = document.querySelector('.btn-proximo');
let page = 1;
const getHighscore = async(page)=>{
    const response = await fetch(`https://api.tibiadata.com/v3/highscores/Antica/swordfighting/paladins/${page}`)
    if(response.status==200){
        const data = await response.json()
        return data["highscores"]['highscore_list']
        
    }
}

const createTable = async(page)=>{
    const data = await getHighscore(page)
    if (data){
        
        next_page = data.next
        previous_page = data.previous

        tbody.innerHTML = ""
        
        data.forEach((element)=>{
            
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
createTable(page)

voltar.addEventListener('click', ()=>{
    if(page==1){
        console.log('Não tem mais páginas')
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