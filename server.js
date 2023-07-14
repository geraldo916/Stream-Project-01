import http from 'node:http';
import db from './sqlLite.js';
import { Readable, Transform, Writable } from 'node:stream';
import { setTimeout } from 'node:timers/promises';
const PORT = process.env.PORT || 8000;
const HOST = '127.0.0.1';

function handler(req,res){

    //cors policy headers
    const headers = {
        'Access-Control-Allow-Origin':'*',
    }

    //send the response header
    res.writeHead(200,headers)

    // Execute a query and stream the results
    const writeStream = new Readable({
        read(){
            db.each('SELECT * FROM users', (err, row) => {
                if (err) {
                    console.error(err);
                }else{
                // Process each row here
                    this.push(JSON.stringify(row))
                }
            },() => {
                // This callback is called when the streaming is complete
                console.log('Streaming complete');
                this.push(null)
            })
        }
    })
    writeStream.pipe(
        Transform({
            async transform(chunk,enc,cb){
                const data = JSON.parse(chunk);
                const dataParsed = {
                    user_id: data.id,
                    name:data.name,
                    date: data.at
                }

                //This allows the event loop to process other tasks and ensures 
                //that the transformed data is correctly sent through the stream 
                await setTimeout(0)
                //This ensures that each transformed chunk is separated by a newline.
                cb(null,JSON.stringify(dataParsed).concat('\n'));
            }
        })
    ).pipe(res)
}

http.createServer(handler)
.listen(PORT,HOST)
.on("listening",()=>console.log("Server is running at 8000"));