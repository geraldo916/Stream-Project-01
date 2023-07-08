import { WriteStream } from 'node:fs';
import {get} from 'node:http';
import { Transform,Writable } from 'node:stream';
import { createReadStream,createWriteStream } from 'node:fs';

const responseStream = () => new Promise((resolve)=>get('http://localhost:8000',res=>resolve(res)));
const readableStream = await responseStream();
const readFileStream = createReadStream('index.html');


readableStream.pipe(
    Transform({
        objectMode:true,
        transform(chunk,enc,cb){
            //console.log(JSON.parse(chunk));
            //const item = JSON.parse(chunk);
            //console.log(item);
            //item.at = `${new Date(item.at).toLocaleDateString()}`

            cb(null,chunk)
        }
        
})).pipe(process.stdout)