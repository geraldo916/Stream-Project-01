import http from 'node:http';
import db from './sqlLite.js';
import { Readable, Transform, Writable } from 'node:stream';
const PORT = process.env.PORT || 8000;
const HOST = '127.0.0.1';

function handler(req,res){
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
            transform(chunk,enc,cb){
                const data = JSON.parse(chunk);
                const dataParsed = {
                    user_id: data.id,
                    name:data.name,
                    date: data.at
                }
                cb(null,JSON.stringify(dataParsed).concat('\n'));
            }
        })
    ).pipe(res)
}

http.createServer(handler)
.listen(PORT,HOST)
.on("listening",()=>console.log("Server is running at 8000"));