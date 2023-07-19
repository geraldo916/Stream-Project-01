import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('./src/db/myData',(err)=>err?console.log(err):console.log("Database created"));


export default db;