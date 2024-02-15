const resultBtn = document.getElementById("result");
let calculatorOn = false;
let decimalAdded = false;
let currentResult = "";
let keySequence = "";

function appendNumber(num) {
  if (!calculatorOn) return;
  currentResult += num;
  keySequence += num;
  updateDisplay(currentResult);

  if (keySequence === "1111") {
    playAppleLogoAnimation();
  }
}

function appendOperator(operator) {
  if (!calculatorOn || currentResult === "") return;
  currentResult = currentResult.replace(/[+\-*/]$/, "");
  currentResult += operator;
  decimalAdded = false;
  updateDisplay(currentResult);
}

function appendDecimal() {
  if (!calculatorOn || decimalAdded) return;
  currentResult += ".";
  decimalAdded = true;
  updateDisplay(currentResult);
}

function clearInput() {
  if (!calculatorOn) return;
  currentResult = "";
  decimalAdded = false;
  updateDisplay(currentResult);
}

function backspace() {
  if (!calculatorOn || currentResult === "") return;
  if (
    String(currentResult) === "Infinity" ||
    currentResult === "-Infinity" ||
    currentResult === "Error" ||
    currentResult === "NaN"
  ) {
    clearInput();
    return;
  }
  currentResult = currentResult.slice(0, -1);
  if (currentResult[currentResult.length - 1] === ".") {
    decimalAdded = false;
  }
  updateDisplay(currentResult);
}

function toggleCalculator() {
  calculatorOn = !calculatorOn;
  const acButton = document.querySelector(".ac");
  if (calculatorOn) {
    acButton.textContent = "ON";
    acButton.style.backgroundColor = "green";
  } else {
    acButton.textContent = "OFF";
    acButton.style.backgroundColor = "red";
  }
  resultBtn.value = "";
  clearInput();
}

function updateDisplay(value) {
  resultBtn.value = value;
}

function calculate() {
  if (!calculatorOn || currentResult === "") return;
  try {
    currentResult = evaluateExpression(currentResult);
    updateDisplay(currentResult);
  } catch (error) {
    currentResult = "Error";
    updateDisplay(currentResult);
  }
}

function evaluateExpression(expression) {
  const tokens = expression.match(/\d+(\.\d+)?|[\+\-\*\/]/g);

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i] === "*" || tokens[i] === "/") {
      const operator = tokens[i];
      const leftOperand = parseFloat(tokens[i - 1]);
      const rightOperand = parseFloat(tokens[i + 1]);
      let result;
      if (operator === "*") {
        result = leftOperand * rightOperand;
      } else {
        if (rightOperand === 0) {
          console.log("Division by zero");
        }
        result = leftOperand / rightOperand;
      }
      tokens.splice(i - 1, 3, result);
      i--;
    }
  }

  let result = parseFloat(tokens[0]);
  for (let i = 1; i < tokens.length; i += 2) {
    const operator = tokens[i];
    const operand = parseFloat(tokens[i + 1]);
    if (operator === "+") {
      result += operand;
    } else {
      result -= operand;
    }
  }

  return result;
}

function playAppleLogoAnimation() {
  const appleLogo = document.createElement("img");
  appleLogo.src = "animation.gif";
  appleLogo.style.position = "absolute";
  appleLogo.style.top = "50%";
  appleLogo.style.left = "50%";
  appleLogo.style.transform = "translate(-50%, -50%)";
  appleLogo.style.width = "50%";
  appleLogo.style.zIndex = "9999";
  const calculator = document.querySelector(".calculator");
  calculator.appendChild(appleLogo);
  setTimeout(() => {
    appleLogo.remove();
  }, 5000);
}

document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (key >= "0" && key <= "9") {
    appendNumber(key);
  } else if (key === "+" || key === "-" || key === "*" || key === "/") {
    appendOperator(key);
  } else if (key === "Enter") {
    calculate();
  }
});
