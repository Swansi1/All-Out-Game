const palyak = [
    [ // 1. nehézség
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1]
    ],
    [
        [0, 1, 0, 1, 0],
        [1, 1, 0, 1, 1],
        [0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1]
    ],
    [
        [1, 0, 0, 0, 1],
        [1, 1, 0, 1, 1],
        [0, 0, 1, 0, 0],
        [1, 0, 1, 0, 0],
        [1, 0, 1, 1, 0]
    ],
    [
        [1, 1, 0, 1, 1],
        [0, 0, 0, 0, 0],
        [1, 1, 0, 1, 1],
        [0, 0, 0, 0, 1],
        [1, 1, 0, 0, 0]
    ],
    [
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 1, 1],
        [0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0]
    ]
];

const palyaSolv =  [
    [ // x,y lépések, hogy hova 
        [0,0], [4,0], [2,2], [0,4], [4,4]
    ],
    [
        [1,1], [3,1], [0,4], [2,4], [4,4]
    ],
    [
        [0,4], [2,4], [0,0], [4,0], [2,0], [2,1]
    ],
    [
        [0,0], [4,0], [4,2], [0,2], [0,4]
    ],
    [
        [0,1], [0,2], [0,4],[1,1],[1,2],[1,3],[2,2],[2,3],[2,4],[3,0],[3,1],[3,3],[3,4],[4,0],[4,1]
    ],
    [
        [0,3], [0,4],[1,2],[1,3],[1,4],[2,1],[2,3],[3,0],[3,1],[3,2],[4,0],[4,1]
    ]
];


class Game{
    constructor(){
        this._GameSize = [5,5]; // 5x5 pálya
        // 2d array amiben tároljuk a pálya nagyságát és az értékeket
        // this._GameTable = this._initGameTable();
        
        this._currentTable = 0;
        this.autoSolve = false;
        this.changeGameTable();
    }

    // megváltoztatja a pályát az aktuális kijelöltre
    changeGameTable(tableId=-1){
        this.autoSolve = false;
        if(tableId == -1){
            tableId = this._currentTable;
        }
        if(tableId >= palyak.length){
            tableId = 1;
        }
        $("#gameId").html(tableId);
        this._currentTable = tableId;
        this._GameTable = JSON.parse(JSON.stringify(palyak[tableId]));
        this._initGameTable();
    }

    solve(){
        this.autoSolve = true;
        $("#solveMousePointer").show();
        palyaSolv[this._currentTable].forEach(steps => {
            let pos = $(`#col${steps[0]}${steps[1]}`).offset(); // top, left
            $("#solveMousePointer").animate({
                left: pos.left,
                top: pos.top
              }, 2000, function(){
                // completed
                this.autoSolve = false; // nincs jobb ötletem..
                $(`#col${steps[0]}${steps[1]}`).mouseenter();
                cellClickFunction($(`#col${steps[0]}${steps[1]}`),true);
                setTimeout(() => {
                    $(`#col${steps[0]}${steps[1]}`).mouseleave();  
                }, 500);
              });
        });
        
    }

    // vissza adja a pályák számát
    get getMaxTableNumber(){
        return palyak.length;
    }

    get currentTable(){
        return this._currentTable;
    }

    get startTime(){
        return this._startTime;
    }

    getCurrentCell(x,y){
        return this._GameTable[y][x];
    }

    // ez fogja léptetni a következőre 
    move(x,y){
        if (x < 0 && x > this._GameSize[1]) {
            return "rossz X érték";
        }
        if (y < 0 && y > this._GameSize[0]) {
            return "rossz Y érték";
        }

        // lépés, körülötte lévőket az ellenkező "színre állítja" és saját magát
        let szomszedok = this._getNeighbours(x,y);
        // console.log(szomszedok);
        // beállítja az ellenkező színre a pályát 
        // ha nem null 
        if(szomszedok.balra.length !== 0){
            this._GameTable[szomszedok.balra[1] ][szomszedok.balra[0] ] = szomszedok.balra[2] ? 0 : 1;
        }
        if(szomszedok.jobbra.length !== 0){
            this._GameTable[szomszedok.jobbra[1]][szomszedok.jobbra[0]] = szomszedok.jobbra[2] ? 0 : 1;
        }
        if(szomszedok.fent.length !== 0){
            this._GameTable[szomszedok.fent[1]  ][szomszedok.fent[0]  ] = szomszedok.fent[2] ? 0 : 1;
        }
        if(szomszedok.lent.length !== 0){
            this._GameTable[szomszedok.lent[1]  ][szomszedok.lent[0]  ] = szomszedok.lent[2] ? 0 : 1;
        }
        this._GameTable[y][x] = this._GameTable[y][x] ? 0 : 1; // ez meg nem lehet null ha normálisan használják

        this._moveCount++; // +1 lépés

        // mivel nem nagyon a pályák ezért küldi vissza az egész pályát
        if(gui.game.isGameFinished()){
            // ha vége a gaménak akkor
            return "finished";

        }
        return this._GameTable; // vissza küldi az egész gametable-t bár elég lenne csak a változás, de biztos ami bizotos
    }

    get moveCount(){
        return this._moveCount;
    }

    // Leelenőrzi, hogy a játék befejeződött-e, Igaz ha vége
    isGameFinished(){
        let finished = true; // igazából nem is kéne ez a váltózó, ha talál 0 return false végén return true
        for (let y = 0; y < this._GameSize[0]; y++) {
            for (let x = 0; x < this._GameSize[1]; x++) {
                //  1-es amit el kell tüntetni, tehát ha csak 0 akkor win!
                if(this._GameTable[y][x] == 1) {
                    finished = false;
                    return finished;
                }
            }
        }
        return finished;
    }

    // szomszédok lekérése, ha null nincs szomszéd
    _getNeighbours(x,y){
        // [x,y,érték]
        let szomszedok = {"fent": [], "lent": [], "balra": [], "jobbra": []}; // üres array ha nincs szomszéd(pályán kívül kerül)

        let newY = y + 1
        if(newY < this._GameSize[0]){ // fent
            szomszedok.fent = [x, newY, this._GameTable[newY][x]]; 
        }

        newY = y - 1;
        if(newY >= 0){ // lent
           szomszedok.lent = [x, newY, this._GameTable[newY][x]];
        }

        let newX = x - 1;
        if(newX >= 0){// balra
            szomszedok.balra = [newX,y,this._GameTable[y][newX]];
        }
        newX = x + 1;
        if(newX < this._GameSize[1]){// jobbra
            szomszedok.jobbra = [newX,y,this._GameTable[y][newX]];
        }


        return szomszedok;
    }

    get moveCount(){
        return this._moveCount;
    }


    // játék tábla beállítása a mostanira
    _initGameTable(){
        this._moveCount = 0; // ide átkerültek mert ha pályát vált amúgy is nullázni kell!
        this._startTime = Date.now();
        let newTable = JSON.parse(JSON.stringify(palyak[this._currentTable]));
        console.log(this._GameSize)
        return newTable;
    }
}


class Scoreboard{
    constructor() {
        this._currentName = name; 
        this.scoreboard = [];
        let scores = JSON.parse(window.localStorage.getItem('scoreboard'));
        if(scores == null){
            let newScore = [];  
            this.scoreboardAll = newScore;
            window.localStorage.setItem("scoreboard",JSON.stringify(newScore));
        }else{
            this.scoreboardAll = scores; // array [["nev", lepes, timestamp]];
        }
    }

    set setName(name){
        // játékos nevének beállítása
        this._currentName = name;

        let sorted = []; // 
        for (let i = 0; i < this.scoreboardAll.length; i++) {
            const element = this.scoreboardAll[i];
            if(element[0] === name){
                sorted.push(element);
            }
        }
        this.scoreboard = sorted;
    }

    set setScore(score){ // score: array["name", lepesek,palyaID, startTimestamp, endTimestamp]
        score.unshift(this._currentName);
        console.log(score);
        this.scoreboard.push(score);
        this.scoreboardAll.push(score);
        window.localStorage.setItem("scoreboard", JSON.stringify(this.scoreboardAll));
    }

    get getName(){
        return this.name;
    }

    get getScoreboard(){
        return this.scoreboard;
    }

    clearScoreboard(){
        this.scoreboard = [];
        window.localStorage.setItem("scoreboard", JSON.stringify(this.scoreboard));
    }
} 




// GUI onclick methods

$("#gameStartBtn").click(function (e) { 
    $(this).prop('disabled',true);
    e.preventDefault();

    var audio = $("#backgroundAudio")[0];
    audio.play();
    
    let nev = $("#nevFormInput").val();
    console.log(nev);
    gui.scoreboard.setName = nev; // játékos név beállítsáa
    $("#usernameWelcome").html(nev); // név beállítása
    gui.game.changeGameTable() // azért kell hogy nulláza a timert

    // rejtsük el a login felületet majd jelenjen meg a játéktér
   $("#loginDiv").fadeOut(2000, function(){
       $(this).addClass("d-none"); // bootstrap miatt
       $("#gameDiv").removeClass("d-none");
       $("#gameDiv").fadeIn(2000);
       gui.createTable();
       gui.setScoreboard();
   });
});

let cellHoverFunc = function () {
    $(this).toggleClass("bg-warning");
 };


// Controller
let gui = {};
gui.scoreboard = new Scoreboard();
gui.game = new Game();

gui.scoreboard.getTimeFromTimestamp = function(timestamp,startTimestamp=0){
    // Az aktuális idő lekérése
    let currentDate = new Date();
    if(startTimestamp != 0){
        currentDate = new Date(startTimestamp);
    }
        
    // Az eltelt idő kiszámítása milliszekundumban
    const elapsedTime = currentDate.getTime() - new Date(timestamp).getTime();
    
    // Az eltelt idő átalakítása  óra, perc, másodperc formátumra
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((elapsedTime / 1000) % 60);

    return [hours,minutes,seconds];
}

gui.setScoreboard = function (){
    // jelenlegi scoreok:

    // Frissíti az időt az aktuális időre minden másodpercben
    setInterval(function() {
    
        //TODO nem lesz jó mert nem kell kivonni a dátumból csak  az idők kellenek a timestampból
        // TODO vagy úgy mented el, hogy start és stop timestamp
    const [hours, minutes, seconds] = gui.scoreboard.getTimeFromTimestamp(gui.game._startTime);
    
    // Az eredmény frissítése a HTML-ben
    if(minutes == 0){
        $("#idoScore").html( seconds + " másodperc");
    }else{
        if(hours != 0){
            $("#idoScore").html(hours + " óra, " + minutes + " perc, " + seconds + " másodperc");
        }else{
            $("#idoScore").html( minutes + " perc, " + seconds + " másodperc");
        }
    }
    }, 1000);

    // $("#idoScore").html(gui.game.moveCount);
    $("#moveScore").html(gui.game.moveCount);
    

    let currentScore = gui.scoreboard.getScoreboard;
    for (let i = 0; i < currentScore.length; i++) {
        const score = currentScore[i]; // array["name", lepesek,palyaID, startTimestamp, endTimestamp]
        const [hours, minutes, seconds] = gui.scoreboard.getTimeFromTimestamp(score[3],score[4]);
        let stringTime = "";
        if(minutes == 0){
            stringTime = seconds + " másodperc";
        }else{
            if(hours != 0){
                stringTime = hours + " óra, " + minutes + " perc, " + seconds + " másodperc";
            }else{
                stringTime = minutes + " perc, " + seconds + " másodperc";
            }
        }
        $("#scoreAppend").append(`<div class="row"><div class="col">${score[1]}</div><div class="col">${stringTime}</div></div>`);
    }
    if(currentScore.length === 0){
        // ha nincs score akkor írjuk ki, hogy nincs még végzett játék
        $("#scoreAppend").html(`<div class="col">Nincsen még elmentett játék :(</div>`);
    }
    // $("#scoreAppend")
}

gui.createTable = function () {
    for (let i = 0; i < 5; i++) {
        let row = $(`<div class="row"></div>`);
        for (let x = 0; x < 5; x++) {
            let selected = gui.game.getCurrentCell(x,i) == 1 ? 'bg-primary' : '';
            let col = $(`<div id="col${x}${i}" data-x="${x}" data-y="${i}" data-selected="${gui.game.getCurrentCell(x,i)}" class="col-sm border ${selected} rounded m-2"></div>`);
            // onclick
            $(col).click(cellClickFunction);

            $(col).hover(cellHoverFunc);
            $(row).append(col);
        }
        $("#gameTable").append(row);
    }
}

gui.reDrawTable = function(){
    for (let y = 0; y < gui.game._GameSize[1]; y++) {
        for (let x = 0; x < gui.game._GameSize[0]; x++) {
            let selected = gui.game.getCurrentCell(x,y);
            let currentColor = $(`#col${x}${y}`).hasClass('bg-primary');
            if(currentColor == true){
                // tehát ki van jelölve szóval ha a selected == 1 nem kell semmit csinálni
                if(selected != 1){
                    $(`#col${x}${y}`).removeClass('bg-primary');
                }
            }else{
                if(selected == 1){
                    $(`#col${x}${y}`).addClass('bg-primary');
                }
            }
        }
    }
}

gui.drawScoreTableAll = function () {
    gui.scoreboard.scoreboardAll.forEach(score => {
        let times = gui.scoreboard.getTimeFromTimestamp(score[3],score[4]);
        let kiiras = "";
        if(times[0] > 0){
            kiiras += times[0] + " Óra ";
        }
        if(times[1] > 0){
            kiiras += times[1] + " Perc ";
        }
        if(times[2] > 0){
            kiiras += times[2] + " Másodperc";
        }
        let newScore = `
            <tr>
                <td>${score[0]}</td>
                <td>${score[1]}</td>
                <td>${score[2]}</td>
                <td>${kiiras}</td>
            </tr>`;

            $("#score_table").append(newScore);
    });
}

gui.clickSound = function(){
    new Audio("audio/click.mp3").play();
};


var targetsss;
let cellClickFunction = function(context,bot=false){
    targetsss = context;
    if(context.type === "click"){
        context = context.delegateTarget;
    }
    if(bot == false){
        if (gui.game.autoSolve){
            return; // ha solve be van kapcsolva akkor ne lehessen csinálni semmit
        }
    }
    gui.clickSound();
    let x = $(context).data("x");
    let y = $(context).data("y");
    console.log(x,y);
    let moves = gui.game.move(x,y);
    $("#moveScore").html(gui.game.moveCount);
    if(moves === "finished"){
        gui.game.autoSolve = true; // ne kattingasson össze vissza
        $("#game_hint").html("Gratulálok kijátszottad a pályát! Hamarosan továbblépsz a következő szintre!");
        $("#game_hint").animate({
            color: 'red'
        },1000);
        $("#solveMousePointer").hide();
        if(!gui.game.autoSolve){
            // ha nem volt az autosolve bekapcsolva csak akkor savelje a score-t
            let finishedTime = new Date();
            gui.scoreboard.setScore = [gui.game.moveCount, gui.game.currentTable, gui.game.startTime, finishedTime];
        }

        // NEXT PALYA
        setTimeout(() => {
            gui.game.changeGameTable(gui.game.currentTable += 1);
            $("#resetBtn").click(); // just reset
            $("#game_hint").stop().animate({"color":'white'},1000);
            $("#game_hint").html("");

            $("#solveBtn").prop('disabled',false);
            $("#resetBtn").prop('disabled',false);
            $("#rndTable").prop('disabled',false);
            $("#helpBtn").prop('disabled',false);
        }, 5*1000); // 5sec
    }
    gui.reDrawTable();
    // $(`#col${x}${y}`).addClass('bg-primary');
}



//Btn click methods

$("#resetBtn").click(function () { 
    gui.game.changeGameTable(); // reseteli a pályát
    $("#moveScore").html(gui.game.moveCount);
    gui.reDrawTable();
});

$("#rndTable").click(function () { 
    let rndNumber = getRandomInt(gui.game.getMaxTableNumber);
    gui.game.changeGameTable(rndNumber);
    gui.reDrawTable();
});

$("#solveBtn").click(function () {
    $(this).prop('disabled',true);
    $("#resetBtn").prop('disabled',true);
    $("#rndTable").prop('disabled',true);
    $("#helpBtn").prop('disabled',true);

    $("#resetBtn").click();
    gui.game.solve();
});


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }
  
  $(document).ready(function(){
    $("#solveMousePointer").hide();

    gui.drawScoreTableAll()

    $(".btn").click(function(e) {
        gui.clickSound();
      });

  });


// // background music start when page loaded
// google policy 
//! Uncaught (in promise) DOMException: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD
// $(document).ready(function(){
//     var audio = $("#backgroundAudio")[0];
//     audio.play();
// });

