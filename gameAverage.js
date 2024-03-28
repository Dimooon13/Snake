let scoreBlock;
let score = 0;

const config = {
	step: 0,
	maxStep: 7,
	sizeCell: 16,
	sizeBerry: 16 / 4
}

const walls = [
    { x: 240, y: 432 },
	{ x: 240, y: 448 },
	{ x: 240, y: 464 },
	{ x: 96, y: 432 },
	{ x: 96, y: 448 },
	{ x: 96, y: 464 },
	{ x: 384, y: 432 },
	{ x: 384, y: 448 },
	{ x: 384, y: 464 },
	{ x: 384, y: 288 },
	{ x: 384, y: 272 },
	{ x: 384, y: 256 },
	{ x: 96, y: 288 },
	{ x: 96, y: 272 },
	{ x: 96, y: 256 },
	{ x: 240, y: 288 },
	{ x: 240, y: 272 },
	{ x: 240, y: 256 },
	{ x: 384, y: 112 },
	{ x: 384, y: 128 },
	{ x: 384, y: 96 },
	{ x: 96, y: 112 },
	{ x: 96, y: 128 },
	{ x: 96, y: 96 },
	{ x: 240, y: 112 },
	{ x: 240, y: 128 },
	{ x: 240, y: 96 },



];

const snake = {
	x: 160,
	y: 160,
	dx: config.sizeCell,
	dy: 0,
	tails: [],
	maxTails: 3
}

let berry = {
	x: 0,
	y: 0
} 


let canvas = document.querySelector("#game-canvas");
let context = canvas.getContext("2d");
scoreBlock = document.querySelector(".game-score .score-count");
drawScore();

let hasAskedForName = false; // Флаг для отслеживания, было ли уже задано имя

function gameLoop() {

	requestAnimationFrame( gameLoop );
	if ( ++config.step < config.maxStep) {
		return;
	}
	config.step = 0;

	context.clearRect(0, 0, canvas.width, canvas.height);

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBerry();
    drawWalls(); // добавляем отрисовку стенок
    drawSnake();
    checkCollisionWithWalls(); // проверяем столкновение со стенками
  
}
requestAnimationFrame( gameLoop );

function drawSnake() {
	snake.x += snake.dx;
	snake.y += snake.dy;

	collisionBorder();

	// todo бордер
	snake.tails.unshift( { x: snake.x, y: snake.y } );

	if ( snake.tails.length > snake.maxTails ) {
		snake.tails.pop();
	}

	snake.tails.forEach( function(el, index){
		if (index == 0) {
			context.fillStyle = "#18d234";
		} else {
			context.fillStyle = "#068e1a";
		}
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

		if ( el.x === berry.x && el.y === berry.y ) {
			snake.maxTails++;
			incScore();
			randomPositionBerry();
		}

		for( let i = index + 1; i < snake.tails.length; i++ ) {

			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y ) {
				refreshGame();
			}

		}

	} );
}

function collisionBorder() {
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell;
	} else if ( snake.x >= canvas.width ) {
		snake.x = 0;
	}

	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	} else if ( snake.y >= canvas.height ) {
		snake.y = 0;
	}
}
function refreshGame() {
    const records = JSON.parse(localStorage.getItem("easyRecords")) || [];

    // Проверяем, входит ли текущий счет в десятку лучших результатов
    if (isInTopTen(score, records)) {
        // Если да, то сохраняем новый рекорд
        saveRecord();
    }

    score = 0;
    drawScore();

    snake.x = 160;
    snake.y = 160;
    snake.tails = [];
    snake.maxTails = 3;
    snake.dx = config.sizeCell;
    snake.dy = 0;

    randomPositionBerry();
    hasAskedForName = false; // Сбрасываем флаг после обновления игры
}

function isInTopTen(currentScore, records) {
    if (records.length < 50) {
        // Если меньше 10 рекордов, то текущий счет всегда входит в топ-10
        return true;
    }

    // Сортируем рекорды по убыванию
    records.sort((a, b) => b.score - a.score);

    // Сравниваем текущий счет с пятедесятым лучшим результатом
    return currentScore > records[49].score;
}

function drawBerry() {
	const img = new Image();
	img.src = "Apple.png";
	context.drawImage(img, berry.x, berry.y, config.sizeCell, config.sizeCell);
  }

function randomPositionBerry() {
	let isOverlap = true; // переменная для проверки перекрытия точки со стенкой
	while (isOverlap) {
	  berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
	  berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
  
	  // Проверяем, перекрывается ли точка со стенкой
	  isOverlap = walls.some((wall) => {
		return berry.x === wall.x && berry.y === wall.y;
	  });
	}
  }

function incScore() {
	score++;
	drawScore();
}

function drawScore() {
	scoreBlock.innerHTML = score;
}

function getRandomInt(min, max) {
	return Math.floor( Math.random() * (max - min) + min );
}

function drawWalls() {
    context.fillStyle = "#333";
    walls.forEach((wall) => {
      context.fillRect(wall.x, wall.y, config.sizeCell, config.sizeCell);
    });
  }
  
  function checkCollisionWithWalls() {
    walls.forEach((wall) => {
      if (snake.x === wall.x && snake.y === wall.y) {
        refreshGame();
      }
    });
  }

document.addEventListener("keydown", function (e) {
	if ( e.code == "KeyW" ) {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyA" ) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	} else if ( e.code == "KeyS" ) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyD" ) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	} else if (e.code == "Escape") {
		location.href = "index.html";
	  }
});

// Добавленная функция для обновления таблицы рекордов
function updateLeaderboard() {
    const easyRecordsList = document.getElementById("easyRecords");
    easyRecordsList.innerHTML = "";

    const records = JSON.parse(localStorage.getItem("easyRecords")) || [];

    records.forEach((record) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${record.name}: ${record.score}`;
        easyRecordsList.appendChild(listItem);
    });
}

// Добавленная функция для сохранения рекорда
function saveRecord() {
    if (!hasAskedForName) {
        // Если имя еще не было задано, то задаем и устанавливаем флаг
        hasAskedForName = true;
        const difficultyLevel = "средний"; // Уровень сложности (в данном случае средний)
        const playerName = prompt(`Поздравляем! Вы установили новый рекорд (${difficultyLevel} уровень сложности)! Введите ваше имя:`);

        if (playerName) {
            const record = {
                name: `${playerName} (${difficultyLevel})`, // Добавляем уровень сложности к имени
                score: score
            };
            const records = JSON.parse(localStorage.getItem("easyRecords")) || [];

            records.push(record);

            records.sort((a, b) => b.score - a.score);

            const limitedRecords = records.slice(0, 50);

            localStorage.setItem("easyRecords", JSON.stringify(limitedRecords));

            updateLeaderboard();
        }
    }
}