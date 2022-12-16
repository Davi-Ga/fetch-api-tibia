//Luta de x1 de habilidade característica
self.onmessage = (element) =>{
    const arrayView = new Int32Array(element.data.vetor);
    const flagView = new Int32Array(element.data.flag);

    let duel = Math.ceil(Math.random()*49);

    while(true){
        tibiano = Math.ceil(Math.random()*50);
        tibiano2 = Math.ceil(Math.random()*50);

        while(tibiano1==tibiano2){
            tibiano1=Math.ceil(Math.random()*50);
           
        }
        if (tibiano1['value']>tibiano2['value']){
            Atomics.wait(flagView, 0, 0);
            Atomics.store(flagView, 0, 0);

            Atomics.store(arrayView, duel, tibiano1['value']);
            Atomics.store(arrayView, duel+1, tibiano1['value']);

        }
        Atomics.store(flagView, 0, 1);
        Atomics.notify(flagView, 0, 1);
    }
}