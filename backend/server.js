const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const sha256 = require('sha256');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const io = socketIO(server);

app.use(cors(), bodyParser.raw({ type: '*/*'}));
// MONGO DB URL
const MongoUrl = 'mongodb://admin:password1@ds119442.mlab.com:19442/my-database'

//SERVER STATE
    let state = {
        messages : [],
    }
//----------------------------------------------------
//                  END POINTS
//----------------------------------------------------
app.post('/signup', (req, res) => {
    // GET THE INFO FROM FRONT END
    let body = JSON.parse(req.body.toString());

    // CHECK THAT THE USER DOESN'T EXIST ALREADY
    MongoClient.connect(MongoUrl, { useNewUrlParser: true}, (err, db) => {
        if (err) throw err;
        let dbo = db.db('my-database');
        
        // IF USER EXISTS SEND ERROR
        dbo.collection('users').findOne({username: body.username}, function(err, result) {
            if (err) throw err;

            if(result) {
                res.send(JSON.stringify({success: false, message: 'user already exists'}));
                db.close();
                return;
            } else {
                // ELSE SAVE THE INFO IN DATABASE
                dbo.collection('users').insertOne(body, (err, result) => {
                    if (err) throw err;
                    // console.log(result.ops[0].username); get username when success
                    res.send(JSON.stringify({success: true, message: 'user added', username: result.ops[0].username}));
                    db.close();
                })
            }
        });
        
        
    })

    // RESPOND AND SET COOKIE
    
})

//---------------------------------------------------
//    SOCKET IO
io.on('connection', socket => {
    console.log('connected');
    socket.on('greet', greeting => {
        console.log(greeting);
    })
    socket.on('chat message', msg => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
        MongoClient.connect(MongoUrl, { useNewUrlParser: true }, (err, db) => {
            if (err) throw err;
            let dbo = db.db('my-database');
            dbo.collection('messages').insertOne({ message: msg }, (err, res) => {
                if (err) throw err;
                console.log('message saved');
                db.close();
            })
        })
    })
    socket.on('disconnect', () => {
        console.log('disconnected');
    })
})



// LISTENERS --------------------------------------------
app.listen(5000, () => {
    console.log("app listening in port 5000");
})

server.listen(4000, () => {
    console.log("listening in port (io) 4000");
})