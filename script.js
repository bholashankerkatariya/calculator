// access DOM elements of the calculator
const inputBox = document.getElementById('input');
const expressionDiv = document.getElementById('expression');
const resultDiv = document.getElementById('result');


//define the expression and resolve the variable
let expression = '';
let result = '';

//define event handler for button clicks
function buttonClick(event) {
    //get the value of the button
    const target = event.target;
    const action = target.dataset.action;
    const value = target.dataset.value;

    //switch case to control the calculator
    switch (action) {
        case 'number':
            addValue(value);
            break;
        case 'clear':
            clear();
            break;
        case 'backspace':
            backspace();
            break;
        // add the result to expression as a starting point 
        //if expression is empty
        case 'addition':
        case 'subtraction':
        case 'multiplication':
        case 'division':
            if (expression === '' && result !== '') {
                startFromResult(value);
            } else if (expression !== '' && !isLastCharOperator
                ()) {
                addValue(value);
            }
            break;
        case 'submit':
            Submit();
            break;

        case 'negate':
            negate();
            break;

        case 'mod':
            percentage();
            break;

        case 'decimal':
            decimal(value);
            break;
    }

    // update display
    updateDisplay(expression, result);
}

inputBox.addEventListener('click', buttonClick);

function addValue(value) {
    if(value === '.') {
        // find the last index of the operator in the expression
        const isLastOperatorIndex = expression.search(/[+\-*/]/);
        // if the last index is not -1, then check if the last char is a number
        const lastDecimalIndex = expression.lastIndexOf('.');
        // if the last char is a number, then don't add the decimal
        const lastNumberIndex = Math.max(
        expression.lastIndexOf('-'), 
        expression.lastIndexOf('+'), 
        expression.lastIndexOf('x'), 
        expression.lastIndexOf('/'));
        //check if this isthe first dcimal in the current number or if the expression is empty
        if(
            (lastDecimalIndex < isLastOperatorIndex || 
            lastDecimalIndex < lastNumberIndex || 
            lastDecimalIndex  === -1) && 
            (expression === '' || expression.slice
            (lastNumberIndex + 1).indexOf('-') === -1))
            {
                expression += value;
            }          
        } else {
            expression += value;
        }
    }

function updateDisplay(expression, result) {
    expressionDiv.textContent = expression;
    resultDiv.textContent = result;
}

function clear() {
    expression = '';
    result = '';
}

function backspace() {
    expression = expression.slice(0, -1);
}

function isLastCharOperator() {
    return isNaN(parseInt(expression.slice(-1)));
}

function startFromResult(value) {
    expression += result + value;
}

function Submit() {
    //evaluate the expression
    result = evaluateExpression();
    //clear the expression
    expression = '';
}

function evaluateExpression() {
    //convert the expression to a number
    const evalResult = eval(expression);
    //evaluate the expression
    return isNaN(evalResult) || !isFinite(evalResult)? ''
    :evalResult <1 
    ? parseFloat(evalResult.toFixed(10)) :
    parseFloat(evalResult.toFixed(2));
}

function negate() {
    //negate the result if the expression is empty and result is present
    if (expression === '' && result!== '') {
        result = -result;
        // toggle the sign of the expression if its not already negative and its not empty
    } else if (!expression.startsWith('-') && expression !== '') {
            expression = '-' + expression;
            // remove the negative sign from the expressin if its already negative.
        } else if (expression.startsWith('-')) {
            expression = expression.slice(1);
        }
}

function percentage() {
    // Evaluate the expression , else it will take percentage of only the first number
    if(expression !== '') {
        result = evaluateExpression();
        expression = '';
        if(!isNaN(result) && isFinite(result)) {
            result /= 100;
        } else {
            result = '';
        } 
    
    } else if (result !== '') {
       // if expression is empty but the result exists, divide by 100
       result = parseFloat(result) / 100;
    }
}

function decimal(value){
    if(!expression.endsWith('-') && !isNaN(expression.slice(-1))) {
        addValue(value);
    }
}