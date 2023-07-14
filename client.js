
async function fetchData(){
    const response = await fetch('http://127.0.0.1:8000');
    const reader = response.body
    let i = 0

    reader.pipeThrough(new TextDecoderStream())  
            .pipeThrough(
                new TransformStream({
                    transform(chunk,controller){
                        
                        for(const item of chunk.split('\n')){
                        try{
                                if(!item.length)continue;
                                i = i +1
                                const dataParsed = JSON.parse(item)
                                const data = {
                                    ...dataParsed,
                                    date: new Date(dataParsed.date).toLocaleDateString()
                                }

                                controller.enqueue(data);
                            }catch(err){
                                //console.log(err);
                            }
                        }
                    }
                }))
                    .pipeTo(
                    new WritableStream({
                        write(data){
                            attachElement(data)
                        }
                    }))
}




function attachElement({user_id,name,date}){
    const listEl = document.querySelector('#data-list');

    const node =  `
    <li>
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
    await fetchData()
})()