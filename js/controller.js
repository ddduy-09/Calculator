import { Calculator } from "./calculator.js";

export class CalculatorController {
  constructor(calculator) {
    // Nhận đối tượng Calculator
    this.calculator = calculator;

    // Lấy màn hình hiển thị từ HTML
    this.currentOperandElement = document.querySelector("#current-operand");
    this.previousOperandElement = document.querySelector("#previous-operand");

    // Lấy toàn bộ các nút trên máy tính
    this.buttons = document.querySelectorAll(".buttons button");

    // Khởi tạo sự kiện cho các nút
    this.initialize();

    // Hiển thị trạng thái ban đầu
    this.updateDisplay();
  }

  // 1. Khởi tạo sự kiện
  initialize() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleButtonClick(button);
      });
    });
  }

  // 2. Xử lý thao tác khi nhấn nút
  handleButtonClick(button) {
    const number = button.dataset.number;
    const operator = button.dataset.operator;
    const action = button.dataset.action;

    // Xử lý nhập số
    if (number !== undefined) {
      this.calculator.appendNumber(number);
    }

    // Xử lý phép toán
    else if (operator !== undefined) {
      this.calculator.chooseOperation(operator);
    }

    // Xử lý các nút chức năng
    else if (action !== undefined) {
      switch (action) {
        case "clear":
          this.calculator.clear();
          break;

        case "delete":
          this.calculator.deleteNumber();
          break;

        case "decimal":
          this.calculator.appendDecimal();
          break;

        case "sign":
          this.calculator.toggleSign();
          break;

        case "percent":
          this.calculator.calculatePercent();
          break;

        case "open-parenthesis":
          this.calculator.openParenthesis();
          break;

        case "close-parenthesis":
          this.calculator.closeParenthesis();
          break;

        case "calculate":
          this.calculator.compute();
          break;
      }
    }

    // Cập nhật màn hình sau mỗi thao tác
    this.updateDisplay();
  }

  // 3. Cập nhật màn hình hiển thị
  updateDisplay() {
    // Vừa nhấn "=" hoặc bị lỗi: biểu thức ở trên, kết quả ở dưới
    if (this.calculator.isFinished || this.calculator.hasError) {
      this.previousOperandElement.textContent = this.calculator.lastExpression;
      this.currentOperandElement.textContent = this.calculator.result;
      return;
    }

    // Đang nhập: hiển thị biểu thức ở trên, chưa có kết quả
    const expression = this.calculator.getExpressionText();

    if (expression === "") {
      this.previousOperandElement.textContent = "0";
    } else {
      this.previousOperandElement.textContent = expression;
    }

    this.currentOperandElement.textContent = "";
  }
}
