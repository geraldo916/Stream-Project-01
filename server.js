import http from 'node:http';




function handler(req,res){
    
}

http.createServer(handler)
.listen(8000)
.on("listening",()=>console.log("Server is running at 8000"));