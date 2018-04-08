/* 
  https://codepen.io/search/pens/?depth=everything&order=popularity&page=1&q=sequencer&show_forks=false

  https://codepen.io/markmurray/pen/NbdpMJ?editors=1010
  
*/

//console.log(loadSounds)


const currContainer = {
  name: 'Test Container 1',
  links: [
    "https://cdn.glitch.com/eeb58a6b-dbe9-4510-a689-ef7ed30f587c%2Fpatatap%20gray%20L%20shaker.mp3?1523210415617",
    "https://cdn.glitch.com/eeb58a6b-dbe9-4510-a689-ef7ed30f587c%2Fpatatap%20gray%20U%20kickshaker.mp3?1523210415998",
    "https://cdn.glitch.com/eeb58a6b-dbe9-4510-a689-ef7ed30f587c%2Fpatatap%20orange%20N%20shaker.mp3?1523210415423",
    "https://cdn.glitch.com/eeb58a6b-dbe9-4510-a689-ef7ed30f587c%2Fpatatap%20orange%20T%20bass1.mp3?1523210415833",
    "https://cdn.glitch.com/eeb58a6b-dbe9-4510-a689-ef7ed30f587c%2Fpatatap%20orange%20V%20shaker.mp3?1523210416357"
  ]
}
const buffers = []

const camW = 640, camH = 480 
const cols = 16 , rows = 5
const socket = io()//'https://80.110.105.110:5500');
//const socket = io('https://192.168.0.150:5500');

window.AudioContext = window.AudioContext || window.webkitAudioContext
const context = new AudioContext()
let soundSource, soundBuffer
let source, 
    soundUrl, //not used now
    currBuffI


let currSound
let samplePlay = false

let currentSq

//console.log('socekt', socket);

socket.on('coords', vals =>{
    //console.log('new vals', vals )
    let x = Math.ceil( vals[0]/ (camW/cols) )
    let y = Math.ceil( vals[1]/ (camH/rows) )    
    //console.log(y)      // 640, 480

    //soundUrl = currContainer.links[y]
    if (!y || y < 0 ) return console.log('no Y value');
  
    currBuffI = y-1
    updateHeader(y-1)  
    
    //console.log('currBuffI ',y, currBuffI)
  
    $('.square').removeClass('test')
    $('.square.row-' + y + '.column-' + x).toggleClass('test')
    //currentSq = $('.square.row-' + y + '.column-' + x)
    
})


$(function(){
    //$('#touchBut').attr('disabled', true)
    //loadSamples()
  
    $('#activate').click(ev =>{
        currentSq.click()
    })
  
    $('#touchBut').mousedown(function(ev){
        //console.log('touchBut', this)
        samplePlay = true
        $(this).addClass('samplePressed');
        startSound() 
    })
    $('#touchBut').mouseup(function(ev){
        //console.log('touch up')
        samplePlay = false
        $(this).removeClass('samplePressed')
    })
  
  

  
})

function startSound() {
        //console.log ('play sound') //  https://developer.mozilla.org/en-US/docs/Web/API/Body/arrayBuffer
  
        //soundUrl = 'https://cdn.glitch.com/eeb58a6b-dbe9-4510-a689-ef7ed30f587c%2Fpatatap%20orange%20T%20bass1.mp3?1523210415833';
        //currBuffI
        fetch(currContainer.links[currBuffI])
        .then(result => result.arrayBuffer() )
        .then( buffer => {
            //console.log(buffers)
  
            source = context.createBufferSource()
            //console.log('buff', buffers[currBuffI])
            //context.decodeAudioData(buffers[currBuffI], decodedData =>{
            context.decodeAudioData(buffer , decodedData =>{

                source.buffer = decodedData
                source.connect(context.destination)
                source.start(0)
            })
        })
        
}


function playSound(src) {
        // play the source now
        soundSource.noteOn(context.currentTime);
    }
function stopSound(src) {
        // stop the source now
        soundSource.noteOff(context.currentTime);
    }

function loadSamples(){
  
    currContainer.links.forEach((link,i) =>
        fetch(link)
        .then(result => 
              result.arrayBuffer() 
              
        ).then( buffer => {
                
                if (buffer.byteLength === 0) alert('error getting sample') //throw('no buffer')
      
                var copy = new ArrayBuffer(buffer.byteLength);
                new Uint8Array(copy).set(new Uint8Array(buffer));
                console.log(copy)          
      
                buffers[i] = copy
      
                //buffers[i] = buffer//.clone()
                if (++i === currContainer.links.length){
                    $('#touchBut').attr('disabled', false)
                    $('#touchBut').addClass('ready')
                }
        })
    )
}


function updateHeader(y){
  let newHeader 
  
  let audios = $('audio')//.attr('data-label')
  
  //console.log(audios[y].getAttribute("data-label"))
  $('#containerDescr').text( audios[y].getAttribute('data-label')  )
  return;
  
  for (let i=0; i<audios.length; i++){
    if (audios[i].getAttribute('src') == soundUrl) newHeader = audios[i].getAttribute('data-label')
  }
  
  $('#containerDescr').text(newHeader)
  
  /*switch(y){
    case 1: ; break;
    case 2: ; break;
    case 3: ; break;
    case 4: ; break;
    case 5: ; break;
      
  }*/
}


