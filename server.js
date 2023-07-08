import http from 'node:http';
import db from './sqlLite.js';
import { Readable, Writable,Transform } from 'node:stream';
import { createReadStream,createWriteStream } from 'node:fs';

function handler(req,res){
    // Execute a query and stream the results
    const fileWriteStream = createWriteStream('index.html');
    const fileReadStream = createReadStream('index.html');

            db.each('SELECT * FROM users', (err, row) => {
                fileWriteStream.write("<html>")
                if (err) {
                    console.error(err);
                }else{
                // Process each row here
                    fileWriteStream.write(`${JSON.stringify(row)}`)
                }
            },() => {
                // This callback is called when the streaming is complete
                console.log('Streaming complete');
                fileWriteStream.write("</html>")
                fileWriteStream.end()
                fileReadStream.pipe(Transform({
                    transform(chunk,enc,cb){
                        const item = JSON.parse(chunk);
                        item.at = new Date(item.at).toDateString()

                        cb(null,JSON.stringify(item))
                    }
                })).pipe(res);
            })
        
    
}

http.createServer(handler)
.listen(8000)
.on("listening",()=>console.log("Server is running at 8000"));