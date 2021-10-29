

const {  parentPort, workerData  } = require('worker_threads')  //we will need this to comunicate with the main code


const Chance = require('chance');  //module that generate random name like : cassandra nicolls
const chance = new Chance();        //we initialise the function into a variable
const Kahoot = require("kahoot.js-updated");   //here is the module that we will use to create bot


  const bots = [...Array(workerData.numberofbotsneeded).keys()].map((i) => { //this is just a for in range with the number of bot needed as arguments
     const client = new Kahoot();                     //we initialise one client
     if(workerData.response.randomname == "on") {     //if on the webpagge we decided to give random name then this will execute
     const name = chance.name();                      //this set the name to a random name generated using chance
     }else{                                           //if we decide to give ousrelf the name of the bot
      const name = workerData.response.names + "#" + i  //this will set the name of the bot as : name given + the number of the bot
     }
     client.join(workerData.pin, name);               //then we connect the client using the pin and we give his name
     console.log(`I have logged in as ${name}`);      //we log his connection
     client.on("QuestionStart", question => {         //when the question will start 
       question.answer(Math.floor(Math.random() * 4));   //the client will pick one random answer between the 4
     });
     return client;                                   //then we return it 
 });



const message = 'finished logging everyone'     
parentPort.postMessage(message)                        //this will indicate that the pool finished his job