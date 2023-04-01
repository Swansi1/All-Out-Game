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
    constructor(difficulty=1){
        this._difficulty = difficulty;
        this._GameSize = [5,5]; // 5x5 pálya
        // 2d array amiben tároljuk a pálya nagyságát és az értékeket
        this._GameTable = this._initGameTable();
        
        this._currentTable = 1;
    }

    // megváltoztatja a pályát az aktuális kijelöltre
    changeGameTable(tableId){
        this._currentTable =  palyak[tableId];
        this._initGameTable();
    }

    // vissza adja a pályák számát
    get getMaxTableNumber(){
        return palyak.length;
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
        let scoreboard = JSON.parse(window.localStorage.getItem('scoreboard'));
        if(scoreboard == null){
            let newScore = [];  
            this.scoreboard = newScore;
            window.localStorage.setItem("scoreboard",JSON.stringify(newScore));
        }else{
            this.scoreboard = scoreboard; // array [["nev", lepes, timestamp]];
        }
    }

    set setScore(score){ // score: array["név", lepesek, timestamp]
        this.scoreboard.push(score);
        window.localStorage.setItem("scoreboard", JSON.stringify(this.scoreboard));
    }

    get getScoreboard(){
        return this.scoreboard;
    }

    clearScoreboard(){
        this.scoreboard = [];
        window.localStorage.setItem("scoreboard", JSON.stringify(this.scoreboard));
    }
}