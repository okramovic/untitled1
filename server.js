// https://stackoverflow.com/questions/8837236/how-to-connect-two-node-js-servers-with-websockets
// https://www.npmjs.com/package/osc-js

const express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http),
OSC = require('osc-js')


const options = { send: { port: 11245 } }
const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) })


/*osc.on('open', () => {
  const message = new OSC.Message('/test', 12.221, 'hello')
  osc.send(message)
 
  //osc.send(bundle, { host: '192.168.178.5' })
})*/


app.use(express.static('public')) // http://expressjs.com/en/starter/static-files.html

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/dj2.html')
})


io.on('connection', function(socket){
  console.log('a user connected');
  
  socket.on('coords', vals =>{
      console.log('vals', vals)
      io.emit('coords', vals)
  })
});

http.listen(3000, ()=> console.log('listening on *:3000') );


/*const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})*/