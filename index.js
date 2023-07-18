import http from 'node:http';
import db from './db/dbSQLite.js';
import { Readable, Transform, Writable } from 'node:stream';
import { setTimeout } from 'node:timers/promises';
const PORT = process.env.PORT || 8000;
const HOST = '127.0.0.1';

function handler(req,res){

    //cors policy headers
    const headers = {
        'Access-Control-Allow-Origin':'*',
        'Access-Control-Allow-Methods':'*'
    }

    //send the response header
    try{
        res.writeHead(200,headers)

        const  abortController = new AbortController();

    req.once('close',()=>{
        console.log("Connection was closed");
        abortController.abort()
    })

    // Execute the query retrieving the result one by one and stream the results
    const dataStream = new Readable(
        {
            read(size){
                console.log(size)
                db.each('SELECT * FROM users', (err, row) => {
                    if (err) {
                        console.error(err);
                    }else{
                    // Process each row here
                        this.push(JSON.stringify(row).concat('\n'))
                    }
                },() => {
                    // This callback is called when the streaming is complete
                    console.log('Streaming complete');
                    this.push(null)
                })
            }
        })
        Readable.toWeb(dataStream).pipeThrough(
            new TransformStream({
                async transform(chunk,controller){
                    const data = JSON.parse(Buffer.from(chunk));
                    const dataParsed = {
                        user_id: data.id,
                        name:data.name,
                        date: data.at
                    }
                    //This allows the event loop to process other tasks and ensures 
                    //that the transformed data is correctly sent through the stream 
                    await setTimeout(0)
                    //This ensures that each transformed chunk is separated by a newline.
                    controller.enqueue(JSON.stringify(dataParsed).concat('\n'))
                }
            })
        ).pipeTo(
            Writable.toWeb(res),
            {
                signal:abortController.signal
            }
        )
    }catch(err){
        if(err.message.includes('abort'))return;
        console.log("Something hapenned",err)
    }
}

http.createServer(handler)
.listen(PORT,HOST)
.on("listening",()=>console.log("Server is running at 8000"));