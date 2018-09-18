// DEPENDANCIES
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
// CONSTANTS
const MongoUrl = 'mongodb://admin:password1@ds119442.mlab.com:19442/my-database'
const COOKIE_NAME = 'chatID';

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
                // CREATE COLLECTION THAT WILL STORE MESSAGES
                dbo.createCollection(body.username, function (err, res) {
                    if (err) throw err;
                    console.log("collection created");
                });

                // ELSE SAVE THE INFO IN DATABASE
                dbo.collection('users').insertOne(body, (err, result) => {
                    if (err) throw err;
                    // console.log(result.ops[0].username); get username when success
                    
                    // RESPOND AND SET COOKIE
                    let token = Math.floor(Math.random() * 100000) + '';
                    res.cookie(COOKIE_NAME, token);
                    res.send(JSON.stringify({success: true, message: 'user added', username: result.ops[0].username}));
                    db.close();
                })
            }
        }); 
    })   
})
app.post('/getMessages', (req, res) => {
    let messages = [];
    // GET THE INFO FROM FRONT END
    let room = JSON.parse(req.body).room;
    
    // GET THE ROOM NAME AND SEARCH IN DB
    MongoClient.connect(MongoUrl, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        let dbo = db.db('my-database');
        
        dbo.collection(room).find({}).toArray(function (err, result) {
            if(err) throw err;
            messages = result;
            console.log(messages);
            db.close();
            res.send(JSON.stringify({status: true, messages}));
        })
    })
    // SEND THE MSGS BACK IN ARRAY FORM
    
    
})

//---------------------------------------------------
//    SOCKET IO
//---------------------------------------------------
io.on('connection', socket => {
    console.log('connected');
    // ONCE THE CLIENT IS CONNECTED THEY CREATE THE ROOM THEY WILL JOIN
    socket.on('room', room => {
        socket.join(room);
        console.log('room joined ' + room);
    })
    // 'END POINT' FOR WHEN USERS SEND CHAT MESSAGES
    socket.on('chat message', msgObject => {
        /*io.emit('chat message', msg);
        console.log('message: ' + msg);
        MongoClient.connect(MongoUrl, { useNewUrlParser: true }, (err, db) => {
            if (err) throw err;
            let dbo = db.db('my-database');
            dbo.collection('messages').insertOne({ message: msg }, (err, res) => {
                if (err) throw err;
                console.log('message saved');
                db.close();
            })
        })*/
        let message = {user: msgObject.user, message: msgObject.message}
        io.in(msgObject.room).emit('chat message', message);
        MongoClient.connect(MongoUrl, { useNewUrlParser: true }, (err, db) => {
            if (err) throw err;
            let dbo = db.db('my-database');
            dbo.collection(msgObject.room).insertOne({ user: msgObject.user, message: msgObject.message },
                (err, res) => {
                    if (err) throw err;
                    console.log('message saved');
                    db.close();
                }
            )
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