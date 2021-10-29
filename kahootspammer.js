const express = require('express')             //used to create the site
const bodyParser = require('body-parser')      //same
const app = express()                          //we define app as our site

const { Worker } = require('worker_threads')   //we will use this to multithread the client


function _useWorker (filepath, pin, numberofbotsneeded, response) {   //thats just define how will the pool work
  return new Promise((resolve, reject) => {                           //this will say that the pool shouldn't stop until it finished 
    const worker = new Worker(filepath, {                            //this will describe what arguments the pool need to work 
      workerData: {
        pin: pin, 
        numberofbotsneeded: numberofbotsneeded,
        response: response,
        path: './bot.js'


      }
    });
    worker.on('online', () => { console.log('Launching the pool') })
    worker.on('message', messageFromWorker => {
      console.log(messageFromWorker)
      return resolve
    })
    worker.on('error', reject)
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
}


app.use(bodyParser.json())                             //initialisation of the site 
app.use(bodyParser.urlencoded({extended:true}))         //initialisation of the site 
app.use(express.static('public'))                        //initialisation of the public file of the site
app.get('/', function (req, res) {                      //wen you go on https://yoursite.com/ it will render
   res.sendFile('index.html', { root: __dirname })      //index.html
}).post('/', async function(req, res){                   //and when a form is post on / 
   
let response = req.body                                  //it will get the form
    console.log(response);                               //log it

    const pin = response.idroom                           //extract the pin
    if(!pin) return  res.redirect("/")                    //if there isn't a pin then it return to a refresh of the webpage 
    if(!response.numberofbots) numberofbotsneeded = 150   //if the user doesn't specifie how many bot there should be it will be 150
    let numberofbotsneeded = response.numberofbots        //but if the user precise how many bot it need then the variable numberofbotsneeded is initialised with this value
    numberofbotsneeded = Number(numberofbotsneeded)       //it convert the value from a str to a int 
    console.log(numberofbotsneeded)                      //we log that number 
     
    _useWorker('./bot.js', pin, numberofbotsneeded, response)   //we start the pool with the pin the number of bot needed and the form of the webpage 

    
    
    res.redirect("/")  //that refresh the page 
})



app.listen(3000, function () {                                //we launch the webpage 
 console.log('your app is available on localhost:3000 !')
})
