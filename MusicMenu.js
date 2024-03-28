
const player = document.querySelector('.player');  
const play = document.querySelector('.play');  
const audio = document.querySelector('.audio');  
const Imgsrc = document.querySelector('.img_src');  

const songs = [
  'audio/svidanie-ya-i-tvoj-kot-mp3.mp3',
  'audio/Свидание - Детективы.mp3',
  'audio/Форум - Белая ночь (Phonk Edition).mp3',
  'audio/Svidanie_-_Sluchajjnaya_lyubov_(musmore.com).mp3'
];

let currentLevel = 1;
let currentSongIndex = 0;
let isMusicPlaying = false; //переменная для хранения состояния музыки

audio.src = songs[currentSongIndex];
audio.autoplay = true;

function AudioPlay() {
  player.classList.add('playing');
  Imgsrc.src = 'Music.png';

  audio.play();
  isMusicPlaying = true; // устанавливаем флаг в true при воспроизведении музыки
}

function AudioPause() {
  player.classList.remove('playing');
  Imgsrc.src = 'NotMusic.png';
  audio.src = songs[currentSongIndex];
  audio.pause();
  isMusicPlaying = false; // устанавливаем флаг в false при паузе музыки
}

play.addEventListener('click', () => {
    const isPlaying = player.classList.contains('playing');
    if (isPlaying) {
      AudioPause();
    } else {
      currentSongIndex = (currentSongIndex + 1) % songs.length;
      AudioPlay();
    }
});

audio.addEventListener('ended', () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  audio.src = songs[currentSongIndex];
  AudioPlay();
});

// Добавляем обработчик события, чтобы при переходе в меню музыка сохранилась
window.addEventListener('beforeunload', () => {
  localStorage.setItem('isMusicPlaying', isMusicPlaying);
});
// Проверяем, была ли музыка воспроизведена при последнем посещении страницы
const savedMusicState = localStorage.getItem('isMusicPlaying');
if (savedMusicState === 'true') {
  AudioPlay();
} else {
  AudioPause();
}
