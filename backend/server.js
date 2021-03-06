// DEPENDANCIES
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
const io = socketIO(server);

app.use(cors(), bodyParser.raw({ type: "*/*" }));
// CONSTANTS
const MongoUrl =
  "mongodb://admin:password1@ds119442.mlab.com:19442/my-database";
const COOKIE_NAME = "chatID";

//----------------------------------------------------
//                  FUNCTIONS
//----------------------------------------------------
function getSession(req) {
  const cookies = req.headers.cookie;
  if (!cookies) return;
  try {
    // console.log("headers:", req.headers);
    // get the starting index
    if (cookies.indexOf(COOKIE_NAME) === -1) return 0;
    let chatIndex = cookies.indexOf(COOKIE_NAME) + COOKIE_NAME.length + 1;
    let session =
      cookies != undefined &&
      cookies.slice(chatIndex, cookies.indexOf(";", chatIndex));
    // console.log(session, chatIndex, COOKIE_NAME);
    return chatIndex !== -1 ? session : 0;
  } catch (err) {
    console.log("error getting cookie", err);
  }
}
//----------------------------------------------------
//                  END POINTS
//----------------------------------------------------

// *** On page load ***
app.get("/session", (req, res) => {
  // Get info from front-end
  let currentSession = getSession(req);
  console.log("session: " + currentSession);
  // Call getSession to get the ID
  if (currentSession) {
    MongoClient.connect(
      MongoUrl,
      { useNewUrlParser: true },
      (err, db) => {
        if (err) throw err;
        let dbo = db.db("my-database");

        //Find if session is active
        dbo
          .collection("sessions")
          .findOne({ token: currentSession, active: true }, (err, result) => {
            if (err) {
              console.log(err);
              throw err;
            }
            console.log("sessionObject: ", result);
            res.send(JSON.stringify({ success: true, result }));
          });
      }
    );
  } else {
    res.send(JSON.stringify({ success: false }));
  }

  // Send back if user has an active session or not
});

// *** When an user wants to sign up ***
app.post("/signup", (req, res) => {
  // Get info from front end
  let body = JSON.parse(req.body.toString());

  // Check that user does not exist already
  MongoClient.connect(
    MongoUrl,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;
      let dbo = db.db("my-database");

      dbo
        .collection("users")
        .findOne({ username: body.username }, function(err, result) {
          if (err) throw err;
          // If user exists send succes false
          if (result) {
            res.send(
              JSON.stringify({ success: false, message: "user already exists" })
            );
            db.close();
            return;
          } else {
            // Create collection that will store messages
            dbo.createCollection(body.username, function(err, res) {
              if (err) throw err;
              console.log("collection created");
            });

            // Save the info in database
            dbo.collection("users").insertOne(body, (err, result) => {
              if (err) throw err;
              // console.log(result.ops[0].username); get username when success

              // Create cookie
              let token = Math.floor(Math.random() * 100000) + "";
              // Save session in DB
              dbo
                .collection("sessions")
                .insertOne(
                  { token, username: result.ops[0].username, active: true },
                  (err, result) => {
                    if (err) throw err;
                    console.log("session added");
                  }
                );
              res.cookie(COOKIE_NAME, token);
              res.send(
                JSON.stringify({
                  success: true,
                  message: "user added",
                  username: result.ops[0].username
                })
              );
              db.close();
            });
          }
        });
    }
  );
});

// *** When user wants to log in ***
app.post("/login", (req, res) => {
  // Get info from front end
  let body = JSON.parse(req.body.toString());

  // Find user in database
  MongoClient.connect(
    MongoUrl,
    { useNewUrlParser: true },
    (err, db) => {
      if (err) throw err;

      let dbo = db.db("my-database");

      dbo
        .collection("users")
        .findOne(
          { username: body.username, password: body.password },
          (err, result) => {
            if (err) throw err;
            // if user does not exist send send success false
            if (!result) {
              db.close();
              res.send({ success: false });
            } else {
              // if user exists set cookie and send success true and info back
              console.log(result);
              // Create cookie
              let token = Math.floor(Math.random() * 100000) + "";
              // Save session in DB
              dbo
                .collection("sessions")
                .insertOne(
                  { token, username: result.username, active: true },
                  (err, result) => {
                    if (err) throw err;
                    console.log("session added");
                  }
                );
              db.close();
              res.cookie(COOKIE_NAME, token);
              res.send(
                JSON.stringify({
                  success: true,
                  username: result.username
                })
              );
            }
          }
        );
    }
  );
});
// *** when chat component is loaded it will get messages ***
app.post("/getMessages", (req, res) => {
  let messages = [];
  // Get info from fron end
  let room = JSON.parse(req.body).room;

  // Get the room name and search in DB
  MongoClient.connect(
    MongoUrl,
    { useNewUrlParser: true },
    function(err, db) {
      if (err) throw err;
      let dbo = db.db("my-database");

      dbo
        .collection(room)
        .find({})
        .toArray(function(err, result) {
          if (err) throw err;
          messages = result;
          // console.log(messages);
          db.close();
          // Send the messages back in array form
          res.send(JSON.stringify({ status: true, messages }));
        });
    }
  );
});
// *** When main user logs in, gets other users to chat with ***
app.get("/users", (req, res) => {
  // check the user has an active session
  let users = [];
  let currentSession = getSession(req);
  if (currentSession) {
    // get all users from db
    MongoClient.connect(
      MongoUrl,
      { useNewUrlParser: true },
      function(err, db) {
        if (err) throw err;
        let dbo = db.db("my-database");
        dbo
          .collection("users")
          .find({})
          .toArray((err, result) => {
            if (err) throw err;
            users = result;
            let finalRes = result
              .filter(user => user.username !== "davidneios")
              .map(user => {
                const { username, firstName } = user;
                return { username, firstName };
              });

            db.close();
            // send the users back to front end
            res.send(JSON.stringify({ status: true, finalRes }));
          });
      }
    );
  }
});

// *** When user wants to log out ***
app.post("/logout", (req, res) => {
  // Get info from front end
  let params = JSON.parse(req.body.toString());
  console.log("params", params);
  let session = getSession(req);
  let query = {
    username: params.username,
    token: session,
    active: true
  };
  let newValue = {
    $set: { active: false }
  };
  // cancel the session in db
  MongoClient.connect(
    MongoUrl,
    { useNewUrlParser: true },
    function(err, db) {
      if (err) throw err;
      let dbo = db.db("my-database");
      dbo.collection("sessions").updateOne(query, newValue, (err, result) => {
        if (err) throw err;
        db.close();
        res.clearCookie(COOKIE_NAME);
        res.clearCookie("io");
        res.send(
          JSON.stringify({
            success: true,
            message: "logout complete"
          })
        );
      });
    }
  );
});
//---------------------------------------------------
//    SOCKET IO
//---------------------------------------------------
io.on("connection", socket => {
  console.log("connected");
  // ONCE THE CLIENT IS CONNECTED THEY CREATE THE ROOM THEY WILL JOIN
  socket.on("room", room => {
    socket.join(room);
    console.log("room joined " + room);
  });
  // 'END POINT' FOR WHEN USERS SEND CHAT MESSAGES
  socket.on("chat message", msgObject => {
    // Receive message and store it in an object
    let message = { user: msgObject.user, message: msgObject.message };
    // Emit the message
    io.in(msgObject.room).emit("chat message", message);
    // Store the message in database
    MongoClient.connect(
      MongoUrl,
      { useNewUrlParser: true },
      (err, db) => {
        if (err) throw err;
        let dbo = db.db("my-database");
        dbo
          .collection(msgObject.room)
          .insertOne(
            { user: msgObject.user, message: msgObject.message },
            (err, res) => {
              if (err) throw err;
              console.log("message saved");
              db.close();
            }
          );
      }
    );
  });
  socket.on("leave", room => {
    socket.leave(room);
    console.log("room left: " + room);
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

// LISTENERS --------------------------------------------
app.listen(5000, () => {
  console.log("app listening in port 5000");
});

server.listen(4000, () => {
  console.log("listening in port (io) 4000");
});
