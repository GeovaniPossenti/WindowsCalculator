class CalculatorController{

    constructor(){

        // Elements
        this._displayCalcElement = document.querySelector("#display");
        this._historyCalcElement = document.querySelector("#history");

        // Var
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        // Audio
        this._audio = new Audio('lib/sound/click.wav');
        this._audioOnOff = true;

        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize(){
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        let btnToggleAudio = document.querySelector('#btnToggleAudio');
        btnToggleAudio.addEventListener('dblclick', e=>{ 
            this.toggleAudio(); 
        }); 

    }

    //Keyboard
    initKeyboard(){

        document.addEventListener('keyup', e =>{
            this.playAudio();
            let keysAllowed = ['Escape','Backspace','+','-','/','*','%','Enter','=','.',',','1','2','3','4','5','6','7','8','9','c','R','r','q','Q'];

            keysAllowed.forEach( key =>{
                if(key == e.key){
                    this.playAudio();
                }
            });
            
            switch(e.key){
                case 'Escape': 
                    this.clearAll();
                    break;
                case 'Backspace': 
                    this.clearEntry();
                    break;
                case '+': 
                case '-': 
                case '/': 
                case '*': 
                case '%': 
                    this.addOperation(e.key);
                    break;
                case 'Enter': 
                case '=': 
                    this.calculate();
                    break;
                case '.': 
                case ',': 
                    this.addDot();
                    break;
                case 'q':
                case 'Q':
                    this.elevatedSquare();
                    break;
                case 'R':
                case 'r':
                    this.divisionByOne();
                    break;
                case '@':
                    this.sqrt();
                    break;

                case '0':
                case '1':    
                case '2':  
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                
                case 'c': 
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
            }
        });

    }

    // paste/copy from clipboard
    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalcElement = parseFloat(text);

            let lastItem = this.getLastItem(true);
            if(lastItem && this.isOperator(lastItem) == true){
                this._operation[2] = parseInt(text);
            }else{
                this._operation[0] = parseInt(text);
            }
            this.playAudio();
            this.setLastNumberToDisplay();
        });
    }

    copyToClipboard(){
        let input = document.createElement('input');
        input.value = this.displayCalcElement;
        document.body.appendChild(input);
        input.select();
        this.playAudio();
        document.execCommand("Copy");
        input.remove();
    }

    // Audio keyboard
    toggleAudio(){
        this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    // Buttons Events
    initButtonsEvents(){
        let buttons = document.querySelectorAll(".btn");
    
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                this.playAudio();
                this.executionBtn(btn.innerHTML); 
            });
        });
    }

    executionBtn(value){
        switch(value){
            case 'C':
                this.clearAll();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case '←': 
                this.clearEntry();
                break;
            case '±': 
                this.changeSignal();
                break;
            case '+': 
                this.addOperation('+');
                break;
            case '-': 
                this.addOperation('-');
                break;
            case '/': 
                this.addOperation('/');
                break;
            case '*': 
                this.addOperation('*');
                break;
            case '%': 
                this.addOperation('%');
                break;
            case '¹/x':
                this.divisionByOne();
                break;
            case 'x²':
                this.elevatedSquare();
                break;
            case '√':
                this.sqrt();
                break;
            case '=': 
                this.calculate();
                break;
            case ',': 
                this.addDot();
                break;
            case '0':
            case '1':    
            case '2':  
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){
                this.setLastOperation(value);
            }else{
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }
            
        }else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }
        }
        // console.log(this._operation);
        // Update history.
        this.updateHistory();
    }

    calculate(){
        let last = '';
        this._lastOperator = this.getLastItem(true);

        // condition for in case he type = in the first event
        if(this._lastOperator){
            if(this._operation.length < 3 && this._lastOperator){
                let firstItem = this._operation[0];
                this._operation = [firstItem, this._lastOperator, this._lastNumber];
            }
    
            if(this._operation.length > 3){
                last = this._operation.pop();
    
                this._lastNumber = this.getResult();
            }else if(this._operation.length == 3){
                this._lastNumber = this.getLastItem(false);
            }
    
            let result = this.getResult();
    
            // Update history
            this.updateHistory();
    
            // calculate '%' percentage
            if(last == '%'){
                let percentage = this._operation[0] * (this._operation[2] / 100);
                this._operation = [this._operation[0], this._operation[1], percentage];
            }else if(last != '%'){
                this._operation = [result];
                if(last) this._operation.push(last);
            }
            
            this.setLastNumberToDisplay();
        }else{
            this.setError();
        }

        // console.log(this._operation);

    }

    getResult(){
        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
        }
    }

    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false); 

        if(!lastNumber) lastNumber = 0;

        this.displayCalcElement = lastNumber;
    }

    getLastItem(isOperator = true){
        let lastItem; 

        for(let i = this._operation.length - 1; i >= 0; i--){
            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;
            }
        }
        
        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    pushOperation(value){
        this._operation.push(value);

        if(this._operation.length > 3){
            this.calculate();
        }
    }

    isOperator(value){
        return (['+', '-', '*', '%', '/'].indexOf(value) > -1);
    }

    // Buttons specials
    clearAll(){
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.updateHistory();
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.updateHistory();
        this.setLastNumberToDisplay();
    }

    addDot(){
        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if(this.isOperator(lastOperation) || !lastOperation){
            this.pushOperation('0.');   
        }else{
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    divisionByOne(){
        let lastOperation = this.getLastOperation();
        this.setLastOperation(1 / lastOperation);
        this.setLastNumberToDisplay();
    }

    elevatedSquare(){
        let lastOperation = this.getLastOperation();
        this.setLastOperation(Math.pow(lastOperation, 2));
        this.setLastNumberToDisplay();
    }

    sqrt(){
        let lastOperation = this.getLastOperation();
        this.setLastOperation(Math.sqrt(lastOperation));
        this.setLastNumberToDisplay();
    }

    changeSignal(){
        for(let i = this._operation.length - 1; i >= 0; i--){
            if(!this.isOperator(this._operation[i])){
                let number = this._operation[i] / -1;
                this._operation[i] = number.toString();
                break;
            }
        }

        this.setLastNumberToDisplay();
        console.log(this._operation);
    }

    // Update history
    updateHistory(){
        let operationNow = this._operation.toString();
        this.historyCalcElement = operationNow.replaceAll(",", ' ');
    }

    // Error 
    setError(){
        this.displayCalcElement = "Error";
        this.historyCalcElement = " ";
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
    }

    // Tools
    addEventListenerAll(element, events, callback){
        events.split(' ').forEach(event => {
            element.addEventListener(event, callback, false);
        });
    }

    // Getter e Setters

    // Display
    get displayCalcElement(){
        return this._displayCalcElement.innerHTML;
    }

    set displayCalcElement(value){
        if(value.toString().length > 11){
            this.setError();
            return false;
        }
        this._displayCalcElement.innerHTML = value;
    }

    // History
    get historyCalcElement(){
        return this._historyCalcElement.innerHTML;
    }

    set historyCalcElement(value){
        this._historyCalcElement.innerHTML = value;
    }

    // Operation
    getLastOperation(){
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value){
        this._operation[this._operation.length - 1] = value;
    }

    
}