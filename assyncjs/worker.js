self.onmessage = (element) =>{
    const arrayV = new Int32Array(element.data.array);
    const sinV = new Int32Array(element.data.sin);

    let xph = Math.ceil(Math.random()*49);

    while(true){
        let ek = Math.ceil(Math.random()*50);
        let ed = Math.ceil(Math.random()*50);

        while(ek==ed){
            ek=Math.ceil(Math.random()*50);

        }
        if (ek>ed){
            Atomics.wait(sinV, 0, 0);
            Atomics.store(sinV, 0, 0);

            Atomics.store(arrayV, xph, ek);
            Atomics.store(arrayV, xph+1, ed);

        }
       
    }
}