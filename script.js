document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('.current_value');
    const buttons = document.querySelector('.buttons');
    const previousInputValue = document.querySelector('.previous_value');

    const ERROR_MESSAGE = 'Error';
    const MAX_INPUT_LENGTH = 10;
    const MAX_OUTPUT_LENGTH = 15;

    let numberOne;
    let numberTwo;
    let operator;

    // очистка калькулятора
    function resetCalculator() {
        input.value = '0';
        previousInputValue.textContent = '';
        numberOne = undefined;
        numberTwo = undefined;
        operator = undefined;
    };

    // проверяет, находится ли калькулятор в состоянии ошибки
    function isErrorState() {
        return input.value === ERROR_MESSAGE;
    };

    // обновление переменных (numberOne или numberTwo) на основе ввода
    function updateCurrentNumber() {
        const value = parseFloat(input.value);

        // если оператор и первая переменная имеют значение, то обновляем второе число
        if (operator && numberOne !== undefined) {
            numberTwo = isNaN(value) ? undefined : value;
        }
        // обновляем первую переменную
        else {
            numberOne = isNaN(value) ? undefined : value;
        }
    };

    // обработка ввода цифр и точки
    function handleDigitInput(digit) {
        // сли калькулятор в состоянии ошибки - сбрасываем перед вводом
        if (isErrorState()) {
            resetCalculator();
        }

        // ограничение длины ввода
        if (input.value.length >= MAX_INPUT_LENGTH) {
            return;
        }

        //  если в инпуте 0 и вводится цифра
        if (input.value === '0' && digit !== '.') {
            input.value = digit; // 0 на цифру
        }
        // если в инпуте 0 и вводится точка
        else if (input.value === '0' && digit === '.') {
            input.value = '0.'; // 0 перед точкой
        }
        // если точка уже есть в инпуте и вводится еще одна
        else if (digit === '.' && input.value.includes('.')) {
            return;
        }
        // добавляем символ к текущему значению
        else {
            input.value += digit;
        }

        // обновляем число в памяти
        updateCurrentNumber();
    };

    // обработка удаления символов
    function handleBackspace() {
        // если ошибка - сбрасываем калькулятор
        if (isErrorState()) {
            resetCalculator();
            return;
        }

        // если число заканчивается на "..."
        if (input.value.endsWith('...')) {
            input.value = input.value.slice(0, -3); // Удаляем троеточие
        }
        // удаление одного символа
        else {
            input.value = input.value.slice(0, -1) || '0'; // Удаляем символ, если пусто - "0"
        }

        // обновляем число в памяти
        updateCurrentNumber();
    };

    // обработка математических операторов (+, -, *, /)
    function handleOperator(op) {
        // если калькулятор в состоянии ошибки
        if (isErrorState()) return;

        // если есть оператор И первое число - вычисляем предыдущую операцию
        if (operator && numberOne !== undefined) {
            numberTwo = parseFloat(input.value);
            let result = operate(numberOne, operator, numberTwo);

            // если результат - ошибка (деление на ноль)
            if (result === ERROR_MESSAGE) {
                input.value = ERROR_MESSAGE;
                resetCalculator();
                return;
            }

            numberOne = result;
            input.value = result;
        }

        // если это первый оператор в цепочке
        else {
            numberOne = parseFloat(input.value);
        }

        // устанавливаем новый оператор и обновляем интерфейс
        operator = op;
        previousInputValue.textContent = `${numberOne} ${operator}`;
        input.value = '0';
        numberTwo = undefined;
    };

    // обработка кнопки `=`
    function handleEquals() {
        // нет ошибки, есть первое число и оператор
        if (isErrorState() || numberOne === undefined || !operator) return;

        numberTwo = parseFloat(input.value);
        let result = operate(numberOne, operator, numberTwo);

        // обработка ошибки деления на ноль
        if (result === ERROR_MESSAGE) {
            input.value = ERROR_MESSAGE;
            previousInputValue.textContent = `${numberOne} ${operator} ${numberTwo}`;
            return;
        }

        let resultStr = String(result); // Конвертируем в строку

        // если результат слишком длинный - обрезаем и добавляем "..."
        if (resultStr.length > MAX_OUTPUT_LENGTH) {
            resultStr = resultStr.slice(0, MAX_OUTPUT_LENGTH) + '...';
        }

        input.value = resultStr;
        previousInputValue.textContent = `${numberOne} ${operator} ${numberTwo} =`;

        numberOne = result;
        operator = undefined;
        numberTwo = undefined;
    };

    // делегирование кликов по кнопкам
    buttons.addEventListener('click', function (event) {
        let target = event.target;
        let text = target.textContent;

        // цифры и точка
        if (text === '.' || (text >= '0' && text <= '9')) {
            handleDigitInput(text);
        }
        // удаление символа
        else if (text === 'BackSpace') {
            handleBackspace();
        }
        // сброс
        else if (text === 'Clear') {
            resetCalculator();
        }
        // операторы
        else if (text === '+' || text === '-' || text === '*' || text === '/') {
            handleOperator(text);
        }
        // результат
        else if (text === '=') {
            handleEquals();
        }
    });

    // ввод с клавиатуры
    document.addEventListener('keydown', function (event) {
        const key = event.key;

        switch (key) {
            case `0`:
            case `1`:
            case `2`:
            case `3`:
            case `4`:
            case `5`:
            case `6`:
            case `7`:
            case `8`:
            case `9`:
                handleDigitInput(key);
                break;

            case `Numpad0`:
            case `Numpad1`:
            case `Numpad2`:
            case `Numpad3`:
            case `Numpad4`:
            case `Numpad5`:
            case `Numpad6`:
            case `Numpad7`:
            case `Numpad8`:
            case `Numpad9`:
                handleDigitInput(key.replace('Numpad', ''));
                break;

            case ',':
            case '.':
            case 'NumpadDecimal':
                handleDigitInput('.');
                break;

            case '+':
            case 'NumpadAdd':
                handleOperator('+');
                break;

            case '-':
            case 'NumpadSubtract':
                handleOperator('-');
                break;

            case '*':
            case 'NumpadMultiply':
                handleOperator('*');
                break;

            case '/':
            case 'NumpadDivide':
                handleOperator('/');
                break;

            case 'Enter':
            case 'NumpadEnter':
            case '=':
                handleEquals();
                break;

            case 'Escape':
            case 'Delete':
                resetCalculator();
                break;

            case 'Backspace':
                handleBackspace();
                break;

            default:
                return;
        }

        event.preventDefault();
    });

    function add(a, b) { return a + b; };

    function subtract(a, b) { return a - b; };

    function multiply(a, b) { return a * b; };

    function divide(a, b) {
        return b === 0 ? ERROR_MESSAGE : a / b;
    };

    function operate(a, operator, b) {
        if (a === ERROR_MESSAGE || b === ERROR_MESSAGE) {
            return ERROR_MESSAGE;
        }

        switch (operator) {
            case '+': return add(a, b);
            case '-': return subtract(a, b);
            case '*': return multiply(a, b);
            case '/': return divide(a, b);
            default: return ERROR_MESSAGE;
        }
    };
});