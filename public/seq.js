// Synthisizer stuff
var ac = new AudioContext();
var gainNode = ac.createGain();
var filterNode = ac.createBiquadFilter();
gainNode.gain.value = 0;
filterNode.type = "lowpass";
var max_filter_freq = 6000; //Hz

filterNode.connect(gainNode);
gainNode.connect(ac.destination);

function build_oscillators(num, waveform, scale){
    // Detune by cents (100 cents in a semitone)
    var minor_array = [200,300,500,700,800,1000,1200,1400,1500,1700,1900,2000,2200,2400];
    var major_array = [200,400,500,700,900,1100,1200,1400,1600,1700,1900,2100,2300,2400];
    
    for(var x = 0; x < num; x++) {
        eval("osc"+(x+1) + "=ac.createOscillator();");
        eval("osc"+(x+1) + ".type='"+waveform+"';");
        eval("osc"+(x+1) + ".connect(filterNode);");
    }
    
    /*if(scale.toUpperCase() === 'MAJOR' || scale === '1') {
        for(var y = 0; y < (num - 1); y++) {
            eval("osc"+(y+2) + ".detune.value = "+major_array[y]+";");
        }
    } else if (scale.toUpperCase() === 'MINOR' || scale === '2') {
        for(var y = 0; y < (num - 1); y++) {
            eval("osc"+(y+2) + ".detune.value = "+minor_array[y]+";");
        }
    }
    for(var z = 0; z < num; z++) {
        eval("osc" + (z+1) + ".start();");
    }*/
};

/* C0:17 // A0:26 // C1:29 // A1:38 // C2:41 // A2:50 // C3:53 // A3:62 // 
   C4:65 // A4:74 // C5:77 // A6:86 // C6:89 // A7:98 // C7:101         */
var key = 62;
var waveform = 'triangle';
var scale = 'minor';
var osc_num = 15;
var tempo = 120;
var tempo_ms = (500/(tempo/60));
build_oscillators(osc_num,waveform,scale);
setFilter(0.3);

function setFilter(percent) {
  filterNode.frequency.value = percent * max_filter_freq
}


function noteOn(noteNumber, osc_num) {   
	var freq = freqFromNoteNumber(noteNumber);
  eval("osc"+(osc_num)+".frequency.setValueAtTime(freq, ac.currentTime);")
    
  gainNode.gain.value = 0.2;
	gainNode.gain.setTargetAtTime(0, ac.currentTime, 0.5); // The last number here is the decay time/value
};


function freqFromNoteNumber( note ) { 
  return 261.63 * Math.pow(2, (note - 69) / 12); 
}; // Assigning a key to Middle C (C4)


function noteOff(num) { eval("osc"+(num)+".frequency.setValueAtTime(0, ac.currentTime);") };


// Step sequencer stuff
var running = false;
var freqArray = [0.6, 0.1];
$('.square').click(function(){ $(this).toggleClass('on'); });
//$('.square').hover(function(){ $(this).toggleClass('test'); });

function sequencer() { // for the full column sequencer
    var i = 0;
    var step = 0;
    running = true;
    
    interval = setInterval(function() {
        if(i === 16){i = 0;}
        $('.square').removeClass('border active');
        $('.square.column-'+(i+1)).addClass('border');
        
        for(var x = 0; x < 15; x++){
            if($('.square.row-'+(x+1)+'.column-'+(i+1)).hasClass('on')){
                
                $('.square.row-'+(x+1)+'.column-'+(i+1)).addClass('active')
                noteOn(key,(16 - (x+1)))
              
            } else {
                noteOff(16 - (x+1));
            }
        }
        i++     
    }, tempo_ms);
    
    interval2 = setInterval(function() {
        if(step === freqArray.length){step = 0}
        setFilter(freqArray[step])
        step++
    }, (tempo_ms / 8));
    
};

function stop_sequencer() {
    $('.square').removeClass('border active');
    if(running === true){
        clearInterval(interval);
        clearInterval(interval2);
    }
};

function change_key(new_key) {
    key = new_key;
    stop_sequencer();
    sequencer();
}
function change_tempo(new_tempo) {
    tempo = new_tempo;
    tempo_ms = (500/(tempo/60));
    stop_sequencer();
    sequencer();
}
$('#set_tempo').keypress(function(event){
    if(event.keyCode === 13) {
        change_tempo($(this).val());
        $(this).val('');
    }
})
$('#set_key').keypress(function(event){
    if(event.keyCode === 13) {
        change_key($(this).val());
        $(this).val('');
    }
})