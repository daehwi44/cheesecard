window.onload = function () {

  let cv = document.getElementById("cv");

  //canvasに対応しているかの判定（IE対応していない場合あり）
  if (cv && cv.getContext) {
    let ctx = cv.getContext("2d");

    /*:::::::::::::::
    Square Object作成！
    :::::::::::::::*/

    let Square = function () {
      return this.set();
    }

    Square.prototype.set = function () {
      let radian = Math.random() * (Math.PI * 360);
      this.x = cv.width * Math.random();
      this.y = cv.height * Math.random();
      this.to_x = Math.cos(radian);
      this.to_y = Math.sin(radian);
      this.speed = Math.random() * 10 + 2;
      this.size = Math.random() * 1000 + 100;
    }


    Square.prototype.move = function () {
      this.x += this.to_x * this.speed;
      this.y += this.to_y * this.speed;
      this.out_square_in();
    }

    Square.prototype.out_square_in = function () {
      if (this.x + this.size < 0) this.x = cv.width;
      if (cv.width < this.x) this.x = 0 - this.size;
      if (this.y + this.size < 0) this.y = cv.height;
      if (cv.height < this.y) this.y = 0 - this.size;
    }


    /*:::::::::::::::
    Main部分
    :::::::::::::::*/

    let instances = [];

    for (let i = 1; i <= 100; i++) {
      instances.push(new Square());
    }

    function draw() {

      let p;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cv.width, cv.height);

      for (let i = 0; i < instances.length; i++) {
        p = instances[i];
        ctx.fillStyle = "green";
        ctx.fillText("Cheese Academy", p.x, p.y, p.size, p.size);
        p.move();
      }

      for (let i = 0; i < instances.length; i++) {
        p = instances[i];
        ctx.fillStyle = "green";
        ctx.fillText("Cheese Academy", p.y, p.x, p.size, p.size);
        p.move();
      }


    }

    setInterval(draw, 30);

  }
}

/*********************
 ここからカードめくり
**********************/

let pairs = 3;
let cards = [];

// カードのめくりカウント用
let flipCount = 0;
let firstCard = null;
let secondCard = null;

// 開始時刻保持
// let startTime;
// タイマーが動いているかどうかの保持
// let isRunning = false;
let correctCount = 0;
// let timeoutId;

function init() {
  let i;
  let card;
  for (i = 1; i <= pairs; i++) {
    cards.push(createCard(i));
    cards.push(createCard(i));
    // document.getElementById('stage').appendChild(createCard(i));
    // document.getElementById('stage').appendChild(createCard(i));
  }
  while (cards.length) {
    card = cards.splice(Math.floor(Math.random() * cards.length), 1)[0];
    document.getElementById('stage').appendChild(card);
  }
}

function createCard(num) {
  let container;
  let card;
  let inner;
  inner = '<div class="card-front">' + num + '</div><div class="card-back">cheese</div>';

  card = document.createElement('div');
  card.innerHTML = inner;
  card.className = 'card';

  // カードクリックしたらめくる
  card.addEventListener('click', function () {
    flipCard(this);
    // タイマー動いていたらreturnで返してこれ以降を実行させない
    // if (isRunning === true) {
    //   return;
    // }
    // // カードめくったらタイマー動いているかをtrue
    // isRunnning = true;
    // // 最初にカードをめくった時の時刻を設定
    // startTime = Date.now();
    // runTimer();
  });

  container = document.createElement('div');
  container.className = 'card-container';
  container.appendChild(card);
  return container;
}

function flipCard(card) {
  // first,secondともにnullじゃない場合はreturn（２枚以上めくれないようにする）
  if (firstCard !== null && secondCard !== null) {
    return;
  }
  // cardをクリックしたときにcard openにする
  card.className = 'card open'
  //カウント
  flipCount++;
  // もしカウントが2の倍数でなければfirst、そうでなければsecond
  if (flipCount % 2 === 1) {
    firstCard = card;
  } else {
    secondCard = card;
    // カードが完全にめくれてから実行
    secondCard.addEventListener('transitionend', check);
  }
}

// 正誤判定
function check() {
  if (
    firstCard.children[0].textContent !==
    secondCard.children[0].textContent
  ) {
    //違っている場合は.openを外すことでカードを閉じる状態にする
    firstCard.className = 'card';
    secondCard.className = 'card';
  } else {
    correctCount++;
    //もしpairsと一緒になったらリダイレクト
    if (correctCount === pairs) {
      window.location.href = '../hp/index.html';
    }
  }
  // 重複してsecondCardにイベントが設定されないようにする
  secondCard.removeEventListener('transitionend', check);
  // 正誤判定が終わったら再度フリップがきくようにnullに戻しておく
  firstCard = null;
  secondCard = null;



}


// function runTimer() {
//   document.getElementById('score').textContent = ((Date.now() - startTime) / 1000).toFixed(2);
//   setTimeout(function () {
//     runTimer();
//   }, 10);
// }



init();
