import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database(database,(err)=>err?console.log(err):console.log("Database created"));

export default class SqliteConnection{
    constructor(){
        this.db = db;
    }

    insert(data){
       const keys = Object.keys(data);
       this.db.run(`INSERT INTO users (${keys.toString(",")}) VALUES (${keys.map((item,index)=>'?')})`, keys.map((item)=>data[item]),(err)=>{err?console.log("Something went wrong",err):undefined});

       return this;
    }

    select(fields){
        this.db.get("");

        
        return this;
    }

}

