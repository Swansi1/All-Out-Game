let palyak = [
    [ // 1. nehézség
        [1, 1, 0, 1, 1],
        [1, 0, 1, 0, 1],
        [0, 1, 1, 1, 0],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 1, 1]
    ],
    [ // 12.
        [0, 0, 1, 1, 1],
        [0, 0, 0, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 0, 0, 0],
        [1, 1, 1, 0, 0]
    ],
    [ // 10.
        [1, 1, 1, 1, 1],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1]
    ],
    [ // 8? 
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 1],
        [1, 1, 1, 0, 0],
        [1, 0, 1, 1, 1],
        [1, 1, 1, 1, 0],
        [1, 0, 0, 1, 0]
    ],
    [
        [0, 1, 1, 0, 0],
        [0, 1, 1, 0, 1],
        [0, 1, 0, 0, 1],
        [1, 1, 0, 0, 0],
        [1, 1, 1, 1, 0]
    ]
];


class Game{
    constructor(){
        this._GameSize = [5,5]; // 5x5 pálya
        // 2d array amiben tároljuk a pálya nagyságát és az értékeket
        // this._GameTable = this._initGameTable();
        
        this._currentTable = 1;
        this.changeGameTable(this._currentTable);
    }

    // megváltoztatja a pályát az aktuális kijelöltre
    changeGameTable(tableId=-1){
        if(tableId == -1){
            tableId = this._currentTable;
        }
        this._GameTable =  palyak[tableId];
        this._initGameTable();
    }

    // vissza adja a pályák számát
    get getMaxTableNumber(){
        return palyak.length;
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
        console.log(szomszedok);
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
        return this._GameTable; // vissza küldi az egész gametable-t bár elég lenne csak a változás, de biztos ami bizotos
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
        if(newY > 0){ // lent
           szomszedok.lent = [x, newY, this._GameTable[newY][x]];
        }

        let newX = x - 1;
        if(newX > 0){// balra
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
        let newTable = palyak[this._currentTable];
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
            this._scoreboardAll = newScore;
            window.localStorage.setItem("scoreboard",JSON.stringify(newScore));
        }else{
            this._scoreboardAll = scores; // array [["nev", lepes, timestamp]];
        }
    }

    set setName(name){
        // játékos nevének beállítása
        this._currentName = name;

        let sorted = []; // 
        for (let i = 0; i < this._scoreboardAll.length; i++) {
            const element = this._scoreboardAll[i];
            if(element[0] === name){
                sorted.push(element);
            }
        }
        this.scoreboard = sorted;
    }

    set setScore(score){ // score: array["név", lepesek, timestamp]
        this.scoreboard.push(score);
        window.localStorage.setItem("scoreboard", JSON.stringify(this.scoreboard));
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
    e.preventDefault();
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

$(".col-md").hover(function () {
    $(this).toggleClass("bg-primary");
 });


// Controller
let gui = {};
gui.scoreboard = new Scoreboard();
gui.game = new Game();

gui.scoreboard.getTimeFromTimestamp = function(timestamp){
    // Az aktuális idő lekérése
    const currentDate = new Date();
        
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
        const score = currentScore[i];
        const [hours, minutes, seconds] = gui.scoreboard.getTimeFromTimestamp(score[2]);
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
            let col = $(`<div id="col${i}${x}" data-x="${x}" data-y="${i}" class="col-md border ${selected} rounded m-2"></div>`);
            // onclick
            $(col).click(function (){
                console.log(this);
            });

            $(col).hover(function(){
                $(this).toggleClass("bg-primary");
            });
            $(row).append(col);
        }
        $("#gameTable").append(row);
    }
}