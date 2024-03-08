document.addEventListener("DOMContentLoaded", function() {
    const display = document.querySelector(".display");
    const buttons = document.querySelectorAll(".btn");
    let errorOccurred = false;
    let prevNumber = "";

    window.addEventListener("keydown", function(event) {
        const key = event.key;

        switch(key) {
            case "0": case "1": case "2": case "3": case "4": 
            case "5": case "6": case "7": case "8": case "9":
                appendToDisplay(key);
                break;
            case "+": case "-": case "*": case "/":
                handleOperator(key);
                break;
            case "Enter":
                event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
                evaluateExpression();
                break;
            case "Backspace":
                deleteLastCharacter();
                break;
            case "c":
                resetDisplay();
                break;
            case "l":
                computeLog();
                break;
        }
    });

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const buttonClick = button.textContent;

            if (errorOccurred) {
                resetDisplay();
            }

            if (buttonClick === "C") {
                resetDisplay();
            } else if (buttonClick === "DEL") {
                deleteLastCharacter();
            } else if (buttonClick === "=") {
                evaluateExpression();
            } else if (buttonClick === "log") {
                computeLog();
            } else {
                appendToDisplay(buttonClick);
            }
        });
    });

    function resetDisplay() {
        display.value = "0";
        prevNumber = "";
        errorOccurred = false;
    }

    function deleteLastCharacter() {
        display.value = display.value.slice(0, -1) || "0";
    }

    function evaluateExpression() {
        try {
            const result = calculate(display.value);
            display.value = result;
        } catch (error) {
            console.error("Error al calcular:", error);
            display.value = "ERROR!";
            errorOccurred = true;
        }
    }

    function computeLog() {
        const number = parseFloat(display.value);
        if (number > 0) {
            const result = Math.log10(number);
            display.value = result.toString();
        } else {
            display.value = "ERROR!";
            errorOccurred = true;
        }
    }

    function appendToDisplay(value) {
        if (display.value === "0" || display.value === "ERROR!") {
            display.value = value;
        } else {
            display.value += value;
        }
    }

    function handleOperator(operator) {
        if (!errorOccurred) {
            prevNumber = display.value;
            display.value += operator;
        }
    }

    function calculate(expression) {
        const sanitizedExpression = expression.replace(/[^\d.+*/()-]/g, '');
        return customFunction(sanitizedExpression);
    }

    function customFunction(expression) {
        return Function('"use strict";return (' + expression + ')')();
    }
});
