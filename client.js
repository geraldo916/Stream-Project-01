var inicial_state = 500;
async function fetchData(signal){
    const response = await fetch('http://127.0.0.1:8000',{
        signal
    });
    const reader = response.body
    
    return reader
    .pipeThrough(new TextDecoderStream())  
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

function attachElement({user_id,name,date}){
    const listEl = document.querySelector('#data-list');
    
    const node =  `
    <li id=${name.split('-')[1].trim()} class='data-item' >
        <div>
            <span>Id:</span><h5>${user_id}</h5> 
        </div>
        <div>
            <span>Name:</span><h3>${name}</h3>
        </div>
        <div>
            <span>Created at:<h3>${date}</h3></span>
        </div>
    </li>
    `
    listEl.innerHTML += node;
}        

(async()=>{
    let abortController = new AbortController();
    var elementCounter = 0;
    const reader = await fetchData(abortController.signal);
    const a = await reader.getReader().read()
    console.log(a)
    //const el = document.querySelectorAll('.data-item');

    await reader.pipeTo(
            new WritableStream({
                write(data,controller){ 
                    console.log(data)                        
                    if(++elementCounter > 10){
                        attachElement(data);
                    }else{
                        abortController.abort()
                    }
                }
        }),{signal:abortController.signal})

    //const elFather = document.getElementById('data-list');

    /*document.addEventListener('hidded',()=>{
        abortController.abort()
        abortController = new AbortController()
    })*/
    
    /*var hiddenEvent = new CustomEvent('hidded',{
        detail:{
            message:"An element has hidden",
            data:{
                key:'value'
            }
        },
        bubbles:true,
        cancelable:true
    })

    elFather.onscroll = function(){
        const elemnt = document.getElementById('0');
        
        var bounding = elemnt.getBoundingClientRect();

        if(bounding.top*(-1) >= bounding.height){
            document.dispatchEvent(hiddenEvent)
        }else{
            console.log('Element is visible')
        }
    }*/
})()