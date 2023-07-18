var inicial_state = 500;
let elementCounter = 0
async function fetchData(signal){

    const response = await fetch('http://127.0.0.1:8000',{
        signal:signal
    });
    const reader = response.body.getReader() 
    
    return new ReadableStream({
        async start(controller){
            while(true){
                const {value,done} = await reader.read()
                if(done)break;
                controller.enqueue(value)
                await new Promise(resolve => setTimeout(()=>resolve(),50))
            }
        }
    }).pipeThrough(new TextDecoderStream())  
    .pipeThrough(
        new TransformStream({
            transform(chunk,controller){ 
                
                    for(const item of chunk.split('\n')){
                        try{
                            if(!item.length)continue;
                            const dataParsed = JSON.parse(item)
                            const data = {
                                ...dataParsed,
                                date: new Date(dataParsed.date).toLocaleDateString()
                            }
    
                            controller.enqueue(data);
                        }catch(err){
    
                        }
                    }
                
            }
    }))       
}

(async()=>{
    let abortController = new AbortController();
    const start = document.getElementById('start');
    const pause = document.getElementById('pause');
    let cardCounter = 0;
    let hide = false;
    start.onclick = async function(){
        try{
            const reader = await fetchData(abortController.signal);
            const listEl = document.querySelector('#data-list');

            const consumer = new WritableStream({

                    write({user_id,name,date},controller){  
                        
                        const node =  `
                        <li id=${cardCounter} class="${hide?'hidded':'data-item'} ">
                            <div class="id_user" >
                                <span>Id:</span><h5>${user_id}</h5> 
                            </div>
                            <div class="name_user" >
                                <span>Name:</span><h3>${name}</h3>
                            </div>
                            <div class="created">
                                <span>Created at</span>:<h4>${date}</h4>
                            </div>
                        </li>
                        `
                        if(++cardCounter > 10){
                            hide = true;
                        }

                        
                        listEl.innerHTML += node;
                    },
                    abort(reason){
                        console.log("aborted*",reason)
                    }
            })
            await reader.pipeTo(consumer,
               {signal:abortController.signal})
        }catch(error){
            if(!error.message.includes('abort')) throw error;
        }
        
    }

    pause.onclick = function(){
        abortController.abort();
        console.log("Abortig...");
        abortController = new AbortController()
    }

    const elFather = document.getElementById('data-list');
    
    elFather.onscroll = function(){
        const viewedElement = document.querySelectorAll('.data-item');
        const viewLength = viewedElement.length;

        const element = document.getElementById(`${viewLength-11}`);
        var bounding = element.getBoundingClientRect();
        if(bounding.top*(-1) >= 0){
            document.getElementById(`${viewLength+1}`).className = 'data-item'
        }else{
            console.log('Element is visible')
        }
    }
})()