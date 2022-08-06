class CalculatorController{

    constructor(){

        // Elements
        this._displayCalcElement = document.querySelector("#display");
        this._historyCalcElement = document.querySelector("#history");


        // Var
        this._operation = [];
        this._lastNumber = '';

        this.initialize();
        this.initButtonsEvents();
    }

    initialize(){
        this.setLastNumberToDisplay();
    }

    // Buttons Events

    initButtonsEvents(){
        let buttons = document.querySelectorAll(".btn");
    
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
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

            case '+': 
                this.addOperation('+');
                break;
            case '-': 
                this.addOperation('-');
                break;
            case '÷': 
                this.addOperation('/');
                break;
            case 'X': 
                this.addOperation('*');
                break;
            case '%': 
                this.addOperation('%');
                break;

            case '=': 
                this.calculate();
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

            }else if(isNaN(value)){

                // Outra coisa

            }else{
                this.pushOperation(value);

                this.setLastNumberToDisplay();
            }
            
        }else{

            if(this.isOperator(value)){

                this.pushOperation(value);

            }else {
                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(parseInt(newValue));

                this.setLastNumberToDisplay();
            }

        }

        // Update history.
        let operationNow = this._operation.toString();
        this.historyCalcElement = operationNow.replaceAll(",", ' ');

    }

    calculate(){
        
        // last = última operação digitada. 
        let last = '';

        if(this._operation.length > 3){
            last = this._operation.pop();
        }
        
        // calculate '%' 
        if(last == '%'){

            result /= 100;
            this._operation = [result];

        }else{

            let result = eval(this._operation.join(""));
            this._operation = [result];

            if(last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }

    setLastNumberToDisplay(){
        let lastNumber; 

        for(let i = this._operation.length - 1; i >= 0; i--){
            if(!this.isOperator(this._operation[i])){
                lastNumber = this._operation[i];
                break;
            }
        }

        if(!lastNumber) lastNumber = 0;

        this.displayCalcElement = lastNumber;
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

    clearAll(){
        this._operation = [];
        this.setLastNumberToDisplay();
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    // Error 

    setError(){
        this.displayCalcElement = "Entrada inválida";
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