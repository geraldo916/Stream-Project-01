import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('myData',(err)=>err?console.log(err):console.log("Database created"));

export default db;

/*
db.run("CREATE TABLE users (id TXT ,name TXT, at TXT)",(err)=>{
    if(err)console.log("Something went wrong:",err);
    console.log("Table created")
})

function * run(){
    for(let i = 0;i<=1000;i++){
        const rawData = {
            id:crypto.randomUUID(),
            name:`Geraldo - ${i}`,
            at:new Date().toString()
        }
        yield rawData;
    }
}


for(const data of run()){
    db.run(`INSERT INTO users VALUES(?, ?, ?)`,[data.id,data.name,data.at],(err)=>{
        if(err)console.log("Something went wrong",err);
    });
}
*/

