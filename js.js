const audio = document.querySelector('audio'),
songLength = document.getElementById('SongLength'),
currentTime = document.getElementById('CurrentSongTime');
const reproducir = document.querySelectorAll('.reproducir-cancion');
const songTitle = document.querySelector('.song-title');
let songAuthor = document.querySelector('.song-author');
const cancion = document.getElementById('cancion');
const filasCanciones = document.querySelectorAll('.reproducir-cancion');
let botonreproducir = document.getElementById("botonreproducir");


// Modo oscuro
const modoActual = localStorage.getItem('modooscuro');
let modooscuro = document.getElementById("modooscuro");
let logo = document.getElementById("logo");

if (modoActual === 'activo') {
    document.documentElement.classList.add('modooscuro');
    modooscuro.classList.add('modooscuroicon');
    logo.classList.add('modooscuroicon');
}

modooscuro.addEventListener('click', () => {
    document.documentElement.classList.toggle('modooscuro');

    if (modooscuro.classList.contains('modooscuroicon')) {
        modooscuro.classList.remove('modooscuroicon');
        logo.classList.remove('modooscuroicon');
        localStorage.setItem('modooscuro', 'inactivo');
    } else {
        modooscuro.classList.add('modooscuroicon');
        logo.classList.add('modooscuroicon');
        localStorage.setItem('modooscuro', 'activo');
    }
});

//

const calculateTime = (secs) => {
    const minutes = Math.floor(secs/60),
seconds = Math.floor(secs % 60),
returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () =>{
    songLength.innerHTML = calculateTime(audio.duration);
}

if(audio.readyState>0) {
    displayDuration();
    currentTime.innerHTML = calculateTime(audio.currentTime);
} else {
    audio.addEventListener('loadedmetadata', () =>{
        displayDuration();
    }) 
}

audio.ontimeupdate = function() {
    currentTime.innerHTML = calculateTime(audio.currentTime);
    setProgress();
}

function setProgress() {
    let percentage = (audio.currentTime / audio.duration) * 100;
    document.querySelector('.progress').style.width = percentage + '%';
}

//Audio controls
const playPause = document.getElementById('PlayPause'),
plus10 = document.getElementById('Plus10'),
back10 = document.getElementById('Back10');
backSong = document.getElementById('BackSong');
forwardsong = document.getElementById('ForwardSong');
let shuffle = document.getElementById('Shuffle');
let loop = document.getElementById('Loop');
let random = false;
let enloop = false;


shuffle.addEventListener('click', ()=>{

    if(!random) {
    shuffle.classList.add("activado");
    random=true;
} else {
    shuffle.classList.remove("activado");
    random=false;
}
});

loop.addEventListener('click', ()=>{

    if(!enloop) {
    loop.classList.add("activado");
    enloop = true;
} else {
    loop.classList.remove("activado");
    enloop = false;
}
});


backSong.addEventListener('click', ()=>{
    currentSong = parseInt(currentSong) - 1;
    reproducirSiguienteCancion(currentSong);
})

forwardsong.addEventListener('click', ()=>{
    const filasdeCanciones = document.querySelectorAll('.reproducir-cancion');
    const totaldeCanciones = filasdeCanciones.length;

    if(!enloop) {

    if(!random) {
    currentSong = parseInt(currentSong) + 1;
} else {
    currentSong = Math.floor(Math.random() * totaldeCanciones);
}
} else {
    currentSong = parseInt(currentSong);
}
    reproducirSiguienteCancion(currentSong);
})

playPause.addEventListener('click', ()=>{
    if(audio.paused) {
        playPause.src = 'musica/pause.svg';
        audio.play();
    } else {
        playPause.src = 'musica/play.svg';
        audio.pause();
    }
})

plus10.addEventListener('click', ()=>{
    audio.currentTime +=10;
})

back10.addEventListener('click', ()=>{
    audio.currentTime -=10;
})

let currentSong = 0;
reproducir.forEach((icono) => {
    icono.addEventListener('click', (event) => {
        const fila = event.target.closest('tr');
      
            const nuevaCancion = fila.dataset.cancion; 
            console.log('Nueva canción:', nuevaCancion);
            
                songTitle.innerHTML = nuevaCancion; 
            
           reproducirCancion(nuevaCancion);
           currentSong = fila.dataset.value;
           console.log(currentSong);
        
    });
});

botonreproducir.addEventListener('click', () => {
        reproducirSiguienteCancion(1);

});

function reproducirCancion(nuevaCancion) {
    const cancion = nuevaCancion;
    songTitle.innerHTML = cancion;
    audio.src = `musica/${cancion}.mp3`;
    audio.load();
    audio.play();
}

audio.addEventListener('ended', function(event) {
    console.log('Canción terminada. Reproduciendo siguiente...');
    const filasdeCanciones = document.querySelectorAll('.reproducir-cancion');
    const totaldeCanciones = filasdeCanciones.length;


    let nextSongNumber;
    if(currentSong) {

        if(!enloop) {
            if(!random) {
                nextSongNumber = parseInt(currentSong) + 1;
            } else {
                nextSongNumber = Math.floor(Math.random() * totaldeCanciones);
            }
        } else {
           nextSongNumber = parseInt(currentSong);
        }
  
        if(nextSongNumber!==undefined) {
        reproducirSiguienteCancion(nextSongNumber);
    }
    } else {
        console.error('No se pudo encontrar la fila de la canción actual');
    }

});

function reproducirSiguienteCancion(nextSongNumber) {
    const nextRow = document.querySelector(`[data-value="${nextSongNumber}"]`);

    if (nextRow) {
        const nuevaCancion = nextRow.dataset.cancion;

 
        if (songTitle) {
            songTitle.innerHTML = nuevaCancion;
        } 

        reproducirCancion(nuevaCancion);
        currentSong = nextRow.dataset.value;
        console.log(currentSong);
    } 
}



