class Game{
    constructor(difficulty=1){
        this._difficulty = difficulty;
        this._GameSize = this._initGameSize();
        // 2d array amiben tároljuk a pálya nagyságát és az értékeket
        this._GameTable = this._initGameTable();
        this._moveCount = 0;
        this._startTime = Date.now();
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

    get difficulty(){
        return this._difficulty;
    }

    // difficulty paraméter nehézségi szintet fejezi ki 1-3-ig; default: 1 ~ Könnyű
    set difficulty(difficulty=1){
        if(typeof difficulty === "number" && difficulty > 0 && difficulty <= 3){
            this._difficulty = difficulty;
        }
    }


    // játék tábla generálása véletlen pontokkal
    _initGameTable(){
        let newTable = [];
        console.log(this._GameSize)
        for (let y = 0; y < this._GameSize[0]; y++) {
            newTable.push([]);
            for (let x = 0; x < this._GameSize[1]; x++) {
                // Todo rnd genetáror a 0,1-esre
                // TOdo 1-es amit el kell tüntetni, tehát ha csak 0 akkor win!
                newTable[y][x] = 0;
            }
        }
        return newTable;
    }

    // páyla méter inicializálása a nehézség függvényében, vissza adja a pálya méretét [y,x]
    _initGameSize(){
        let size = [0,0];
        switch (this._difficulty) {
            case 1: // Könnyű (default)
                size = [10,10];
                break;
            case 2: // közepes
                size = [15,15];
                break;
            case 3: // Nehéz
                size = [20,20];
                break;
            default:
                break;
        }
        return size;
    }
}