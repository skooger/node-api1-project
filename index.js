// implement your API here
const express = require('express');

const Lambda = require('./data/db.js')

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.json({ server: 'Is running'})
})

server.post('/api/users', (req, res) => {

    const userInfo = req.body;

    if(!userInfo.name || !userInfo.bio){
        res.status(400).json({errorMessage: 'Please provide name or bio for the user.'})
    }else{
        Lambda.insert(userInfo)
        .then(user => {
            res.status(201).json(user)
        }).catch(err => {
              console.log(err);
              res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })

        })

    }
    

})

server.get('/api/users', (req,res) => {

    Lambda.find()
          .then(data => {
              res.status(200).json(data)
          })
          .catch(err => {
            console.log(err); 
            res.status(500).json({ errorMessage: "The users information could not be retrieved." })
          })

})

server.get('/api/users/:id', (req,res) => {

    const {userId} = req.params;

    Lambda.find(userId)
          .then(data => {
              if(!data)
              {
                  res.status(404).json({ message: "The user with the specified ID does not exist." })
              }
              else{
                  res.status(200).json(data)
              }
          })
          .catch(err => {
              res.status(500).json({ errorMessage: "The user information could not be retrieved." })
          })

})

server.delete('/api/users/:id', (req,res) => {
    const {userId} = req.params;

    Lambda.findById(userId)
          .then(data => {
              if(!data)
              {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
              }
              else{
                  Lambda.remove(userId)
                        .then(data => {
                            res.status(200).json(data)
                        })
                        .catch(err => {
                            res.status(500).json({ errorMessage: "The user information could not be retrieved." })
                        })
              }
          })
          .catch(err => {
              res.status(500).json({ errorMessage: "The user information could not be retrieved." })
          })
})

server.put('/api/users:id', (req,res) =>{

    const userInfo = req.body;

    if(!userInfo.name || !userInfo.bio){
        res.status(400).json()

    }else{
        const {userId} = req.params;
        Lambda.findById(userId)
              .then(data => {
                  if(!data){
                      res.status(404).json({ message: "The user with the specified ID does not exist." })
                  }
                  else{
                      Lambda.update(userId,data)
                            .then(data => {
                                res.status(200).json(data)
                            })
                    }
              })
    }
   
})

const port = 5000;
server.listen(port, () => console.log(`\n** API on port ${port} \n`))