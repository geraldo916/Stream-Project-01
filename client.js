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
                            controller.enqueue(JSON.parse(item));
                        }catch(err){
                            console.log(err);
                        }
                    }
                }
            })
        ).pipeTo(
            new WritableStream({
                write(data){
                    console.log(data)
                    console.log(i)
                }
            })
        )

/*
readableStream.pipe(
    Transform({
        objectMode:true,
        transform(chunk,enc,cb){
            const item = JSONStream.parse(chunk);
            item.at = `${new Date(item.at).toLocaleDateString()}`
            cb(null,JSONStream.stringify(item).)
        }
        
})).pipe(process.stdout)*/