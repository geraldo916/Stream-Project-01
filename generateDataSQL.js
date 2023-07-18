import db from "./dbSQLite";
import {promisify} from 'util'

const createTable = promisify(db.run).bind(db)

const res = createTable("CREATE TABLE users (id TXT ,name TXT, at TXT)")


const randomNames = [
    ["George", "Antonio", "Paulo", "Cristina", "Alexa", "Simão", "Geraldo", "Samuel", "Inacio", "Mohammed", "Sam", "Phineas", "Calvin", "Lee", "Khalid", "Ramos", "Gloria", "Alexo", "Maria", "Selena", "Miquelmina", "Olivia", "Gregorio"],
    ["Munhika", "Da Silva", "Raul", "Calueto", "Obamah", "Sousa", "de Palmeiras", "Smith", "Grey", "Wheesley", "Wall", "de Jesus", "Antonio", "Santiago", "Fernadez", "Pinto", "Mala", "Gregorio", "Mouse", "Campbel", "Soccer", "Ball", "Steel", "Grama", "de Gama", "Paredes", "Múcua", "Ligia", "Tree", "Gym"]];
  
  // A function that handles names
function createData(index) {
    const name = {
      firstName: randomNames[0][Math.floor(Math.random() * randomNames[0].length)],
      secondName: randomNames[1][Math.floor(Math.random() * randomNames[1].length)]
    };
    const data = {
      "id": crypto.randomUUID(),
      "Name": `${name.firstName} ${name.secondName} - Index - ${index}`
    };
    return data
}


function * run(){
    for(let i = 0;i<=1000;i++){
        
        yield createData(i);
    }
}

for(const data of run()){
    db.run(`INSERT INTO users VALUES(?, ?, ?)`,[data.id,data.name,data.at],(err)=>{
        if(err)console.log("Something went wrong",err);
    });
}