import http from 'node:http';
import db from './sqlLite.js';
import { Readable, Writable } from 'node:stream';


function handler(req,res){
    // Execute a query and stream the results

    const writeStream = new Readable({
        read(){
            db.each('SELECT * FROM users', (err, row) => {
                if (err) {
                console.error(err);
                } else {
                // Process each row here
                    console.log("Requesting")
                    this.push(row.toString())
                }
            },() => {
                // This callback is called when the streaming is complete
                console.log('Streaming complete');
                this.push(null)
                // Close the database connection
                db.close((err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Database connection closed.');
                }
                });
            });
        }
    })
    writeStream.pipe(res)

}

http.createServer(handler)
.listen(8000)
.on("listening",()=>console.log("Server is running at 8000"));