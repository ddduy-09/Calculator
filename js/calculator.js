export class Calculator {
  constructor() {
    // Số đang được nhập
    this.currentOperand = "0";

    // Số được nhập trước đó
    this.previousOperand = "";

    // Phép toán đang được lựa chọn
    this.operation = null;

    // Kiểm tra có cần bắt đầu nhập số mới không
    this.shouldResetScreen = false;

    this.lastExpression = "";
  }

  // 1. Nhập số
  appendNumber(number) {
    if (this.currentOperand === "Error") {
      this.currentOperand = "0";
    }

    if (this.shouldResetScreen) {
      // Nếu không còn phép toán đang chờ thì bắt đầu phép tính mới
      if (this.operation === null) {
        this.lastExpression = "";
      }
      this.currentOperand = number;
      this.shouldResetScreen = false;
      return;
    }

    if (this.shouldResetScreen) {
      this.currentOperand = number;
      this.shouldResetScreen = false;
      return;
    }

    if (number === "0" && this.currentOperand === "0") {
      return;
    }

    if (this.currentOperand === "0") {
      this.currentOperand = number;
      return;
    }

    if (this.currentOperand.length >= 15) {
      return;
    }

    this.currentOperand += number;
  }

  // 2. Nhập số thập phân
  appendDecimal() {
    if (this.currentOperand === "Error") {
      this.currentOperand = "0";
    }

    if (this.shouldResetScreen) {
      // Nếu không còn phép toán đang chờ thì bắt đầu phép tính mới
      if (this.operation === null) {
        this.lastExpression = "";
      }
      this.currentOperand = "0";
      this.shouldResetScreen = false;
    }

    if (this.shouldResetScreen) {
      this.currentOperand = "0";
      this.shouldResetScreen = false;
    }

    if (this.currentOperand.includes(".")) {
      return;
    }

    if (this.currentOperand.length >= 15) {
      return;
    }

    this.currentOperand += ".";
  }

  // 3. Đổi dấu âm/dương
  toggleSign() {
    if (this.currentOperand === "Error" || this.currentOperand === "0") {
      return;
    }

    if (this.shouldResetScreen) {
      this.shouldResetScreen = false;
    }

    if (this.currentOperand.startsWith("-")) {
      this.currentOperand = this.currentOperand.slice(1);
    } else {
      this.currentOperand = "-" + this.currentOperand;
    }
  }

  // 4. Xóa ký tự cuối cùng
  deleteNumber() {
    // Trường hợp lỗi: đặt lại toàn bộ
    if (this.currentOperand === "Error") {
      this.clear();
      return;
    }

    // Trường hợp đang hiện kết quả của phép tính: xóa tất cả
    if (this.operation === null && this.lastExpression !== "") {
      this.clear();
      return;
    }

    // Trường hợp vừa chọn phép toán (ví dụ "5 +"): xóa phép toán,
    // quay lại trạng thái đang nhập số thứ nhất
    if (this.operation !== null && this.shouldResetScreen) {
      this.currentOperand = this.previousOperand;
      this.previousOperand = "";
      this.operation = null;
      this.shouldResetScreen = false;
      return;
    }

    // Trường hợp còn lại: xóa ký tự cuối của số đang nhập
    this.shouldResetScreen = false;
    this.currentOperand = this.currentOperand.slice(0, -1);

    // Số đang nhập đã bị xóa hết
    if (this.currentOperand === "" || this.currentOperand === "-") {
      if (this.operation !== null) {
        // Quay về trạng thái "5 +" (đã có phép toán, chưa có số thứ hai)
        this.currentOperand = this.previousOperand;
        this.shouldResetScreen = true;
      } else {
        this.currentOperand = "0";
      }
    }
  }

  // 5. Xóa toàn bộ phép tính
  clear() {
    this.currentOperand = "0";
    this.previousOperand = "";
    this.operation = null;
    this.shouldResetScreen = false;
    this.lastExpression = "";
  }

  // 6. Chọn phép toán
  chooseOperation(operation) {
    if (this.currentOperand === "Error") {
      return;
    }

    // Nếu đã có phép toán trước đó thì tính trước
    if (this.operation !== null && !this.shouldResetScreen) {
      this.compute();
    }
    this.lastExpression = "";
    this.previousOperand = this.currentOperand;
    this.operation = operation;
    this.shouldResetScreen = true;
  }

  // 7. Thực hiện phép tính
  compute() {
    if (
      this.operation === null ||
      this.previousOperand === "" ||
      this.currentOperand === "Error"
    ) {
      return;
    }

    const previous = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    // Lưu lại toàn bộ biểu thức trước khi tính
    const operationSymbols = {
      "+": "+",
      "-": "−",
      "*": "×",
      "/": "÷",
    };

    this.lastExpression = `${this.previousOperand} ${
      operationSymbols[this.operation]
    } ${this.currentOperand}`;

    let result;

    switch (this.operation) {
      case "+":
        result = previous + current;
        break;

      case "-":
        result = previous - current;
        break;

      case "*":
        result = previous * current;
        break;

      case "/":
        if (current === 0) {
          this.currentOperand = "Error";
          this.previousOperand = "";
          this.operation = null;
          this.shouldResetScreen = true;
          return;
        }

        result = previous / current;
        break;

      default:
        return;
    }

    // Kiểm tra kết quả hợp lệ
    if (!Number.isFinite(result)) {
      this.currentOperand = "Error";
    } else {
      // Giảm sai số tính toán số thập phân
      result = parseFloat(result.toPrecision(12));
      this.currentOperand = result.toString();
    }

    // Xóa trạng thái phép tính cũ
    this.previousOperand = "";
    this.operation = null;
    this.shouldResetScreen = true;
  }

  // 8. Tính phần trăm
  calculatePercent() {
    if (this.currentOperand === "Error") {
      return;
    }

    const number = parseFloat(this.currentOperand);

    this.currentOperand = (number / 100).toString();
    this.shouldResetScreen = true;
  }
}
