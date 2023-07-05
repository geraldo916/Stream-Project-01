import SqliteConnection from "./sqlLite.js";

const database = new SqliteConnection('myData');

const res = database.insert({
    id:1,
    name:"Geraldo"
})