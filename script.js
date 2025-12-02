document.addEventListener('DOMContentLoaded', (event) => {
    const input = document.querySelector('.current_value');
    const buttons = document.querySelector('.buttons');
    const previousInputValue = document.querySelector('.previous_value')

    let numberOne;
    let numberTwo;
    let operator;

    buttons.addEventListener('click', function (event) {
        let target = event.target;
        let text = target.textContent;

        if (text === `.` || (text >= `0` && text <= `9`)) {

            if (input.value === 'Error') {
                input.value = '0';
                previousInputValue.textContent = '';
                numberOne = undefined;
                numberTwo = undefined;
                operator = undefined;
            }

            if (input.value.length >= 10) {
                return;
            }

            else if (input.value === `0` && text !== `.`) {
                input.value = text;
            }

            else if (input.value === `0` && text === `.`) {
                input.value = `0.`;
            }

            else if (text === `.` && input.value.includes(`.`)) {
                return;
            }

            else {
                input.value = input.value + text;
            }
        }

        if (text === 'BackSpace') {

            if (input.value === 'not divisible by zero') {
                input.value = '0';
                previousInputValue.textContent = '';
                numberOne = undefined;
                numberTwo = undefined;
                operator = undefined;
                return;
            }
            if (input.value.includes(`...`)) {
                input.value = input.value.slice(0, -3)
            }

            else {
                input.value = input.value.slice(0, -1) || `0`;
            }
        }

        if (text === 'Clear') {
            input.value = `0`;
            previousInputValue.textContent = '';
            numberOne = undefined;
            numberTwo = undefined;
            operator = undefined;
            return;
        }

        if (text === `+` || text === `-` || text === `*` || text === `/`) {

            if (input.value === `Error`) {
                return;
            }

            if (operator && numberOne !== undefined) {
                numberTwo = parseFloat(input.value);

                let result = operate(numberOne, operator, numberTwo)

                if (result === 'Error') {
                    input.value = result;
                    previousInputValue.textContent = '';
                    numberOne = undefined;
                    numberTwo = undefined;
                    operator = undefined;
                    return;
                }

                numberOne = result;
                input.value = result;
            }

            else {
                numberOne = parseFloat(input.value);
            }

            numberTwo = undefined;
            operator = text;
            previousInputValue.textContent = numberOne + ` ` + operator;
            input.value = `0`;

        }

        if (text === `=`) {

            if (input.value === 'Error') {
                return;
            }

            if (numberOne !== undefined && operator) {
                numberTwo = parseFloat(input.value);

                let result = operate(numberOne, operator, numberTwo);

                if (result === 'Error') {
                    input.value = result;
                    previousInputValue.textContent = numberOne + ` ` + operator + ` ` + numberTwo;
                    return;
                }

                let resultStr = String(result);

                if (resultStr.length > 15) {
                    resultStr = resultStr.slice(0, 15) + `...`;
                }

                input.value = resultStr;

                previousInputValue.textContent = numberOne + ` ` + operator + ` ` + numberTwo + ` =`;

                numberOne = result;
                operator = undefined;
                numberTwo = undefined;
            }
        }
    })

    function errorCheck() {
        input.value = `0`;
        previousInputValue.textContent = '';
        numberOne = undefined;
        numberTwo = undefined;
        operator = undefined;
        return;
    }

    function add(a, b) {
        return a + b;
    }

    function subtract(a, b) {
        return a - b;
    }

    function multiply(a, b) {
        return a * b;
    }

    function divide(a, b) {
        if (b === 0) {
            return 'Error';
        }
        return a / b;
    }

    function operate(a, operator, b) {
        if (a === 'Error') {
            return a;
        }

        let res;

        switch (operator) {
            case `+`:
                res = add(a, b);
                break;
            case `-`:
                res = subtract(a, b);
                break;
            case `*`:
                res = multiply(a, b);
                break;
            case `/`:
                res = divide(a, b);
                break;
            default:
                return `Error`;
        }

        return res;
    }
});