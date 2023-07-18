import sqlite3 from 'sqlite3';

sqlite3.verbose();

const db = new sqlite3.Database('./src/myData',(err)=>err?console.log(err):console.log("Database created"));


export default db;