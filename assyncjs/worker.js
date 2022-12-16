//Luta de x1 de habilidade característica
self.onmessage = (element) =>{
    const aView = new Int32Array(element.data.v);
    const fView = new Int32Array(element.data.f);

    let duel = Math.ceil(Math.random()*49);

    while(true){
        tibiano = Math.ceil(Math.random()*50);
        tibiano2 = Math.ceil(Math.random()*50);

        while(tibiano1==tibiano2){
            tibiano1=Math.ceil(Math.random()*50);
           
        }
        if (tibiano1['value']>tibiano2['value']){
            Atomics.wait(fView, 0, 0);
            Atomics.store(fView, 0, 0);

            Atomics.store(aView, duel, tibiano1['value']);
            Atomics.store(aView, duel+1, tibiano1['value']);

        }
        Atomics.store(fView, 0, 1);
        Atomics.notify(fView, 0, 1);
    }
}