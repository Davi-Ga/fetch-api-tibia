//Luta de x1 de habilidade característica
self.onmessage = (element) =>{
    const aV = new Int32Array(element.data.v);
    const fV = new Int32Array(element.data.f);

    let duel = Math.ceil(Math.random()*10);

    while(true){
        partyD=[];
        partyC=[];
        tibiano = Math.ceil(Math.random()*50);
        tibiano2 = Math.ceil(Math.random()*50);


        if (tibiano1['value']>tibiano2['value']){
            Atomics.wait(fV, 0, 0);
            Atomics.store(fV, 0, 0);

            Atomics.store(aV, duel, tibiano1['value']);
            Atomics.store(aV, duel+1, tibiano1['value']);

        }
        Atomics.store(fV, 0, 1);
        Atomics.notify(fV, 0, 1);
    }
}