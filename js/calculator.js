// Bảng đổi ký hiệu phép toán sang ký hiệu hiển thị
const OPERATION_SYMBOLS = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": "÷",
};

export class Calculator {
  constructor() {
    // Các thành phần đã chốt của biểu thức, ví dụ: ["(", "5", "+", "3", ")", "*"]
    this.tokens = [];

    // Số đang được nhập (chuỗi). Rỗng nghĩa là chưa nhập số nào
    this.currentOperand = "";

    // Biểu thức vừa tính xong, hiển thị phía trên sau khi nhấn "="
    this.lastExpression = "";

    // Kết quả của phép tính vừa thực hiện
    this.result = "";

    // true khi vừa nhấn "=" và đang hiển thị kết quả
    this.isFinished = false;

    // true khi phép tính bị lỗi (ví dụ chia cho 0)
    this.hasError = false;

    // Dùng khi phân tích biểu thức
    this.parseTokens = [];
    this.parsePosition = 0;
  }

  // ===== Hàm hỗ trợ =====

  // Kiểm tra token có phải phép toán không
  isOperator(token) {
    return token === "+" || token === "-" || token === "*" || token === "/";
  }

  // Kiểm tra token có phải số không
  isNumber(token) {
    if (token === undefined) {
      return false;
    }

    return !this.isOperator(token) && token !== "(" && token !== ")";
  }

  // Lấy token cuối cùng đã chốt
  getLastToken() {
    return this.tokens[this.tokens.length - 1];
  }

  // Đếm số dấu "(" chưa được đóng
  countOpenParentheses(items) {
    let count = 0;

    for (let index = 0; index < items.length; index += 1) {
      if (items[index] === "(") {
        count += 1;
      } else if (items[index] === ")") {
        count -= 1;
      }
    }

    return count;
  }

  // Lấy toàn bộ biểu thức: token đã chốt + số đang nhập
  getAllTokens() {
    const items = this.tokens.slice();

    if (this.currentOperand !== "") {
      items.push(this.currentOperand);
    }

    return items;
  }

  // Chuyển danh sách token thành chuỗi hiển thị, ví dụ "(5 + 3) × 2"
  formatTokens(items) {
    let text = "";

    for (let index = 0; index < items.length; index += 1) {
      if (this.isOperator(items[index])) {
        text += " " + OPERATION_SYMBOLS[items[index]] + " ";
      } else {
        text += items[index];
      }
    }

    return text.trim();
  }

  // Biểu thức đang nhập, hiển thị ở previous-operand
  getExpressionText() {
    return this.formatTokens(this.getAllTokens());
  }

  // Nếu vừa có kết quả hoặc lỗi thì bắt đầu biểu thức mới
  prepareNewInput() {
    if (this.hasError || this.isFinished) {
      this.clear();
    }
  }

  // Dùng kết quả vừa tính làm số đầu tiên của biểu thức mới
  startFromResult() {
    this.currentOperand = this.result;
    this.tokens = [];
    this.result = "";
    this.lastExpression = "";
    this.isFinished = false;
  }

  // ===== Chức năng chính =====

  // 1. Nhập số
  appendNumber(number) {
    this.prepareNewInput();

    // Không cho nhập số ngay sau ")" hoặc sau số đã chốt (ví dụ sau "%")
    const lastToken = this.getLastToken();
    if (
      this.currentOperand === "" &&
      (lastToken === ")" || this.isNumber(lastToken))
    ) {
      return;
    }

    if (this.currentOperand === "0") {
      if (number === "0") {
        return;
      }

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
    this.prepareNewInput();

    if (this.currentOperand === "") {
      const lastToken = this.getLastToken();

      if (lastToken === ")" || this.isNumber(lastToken)) {
        return;
      }

      this.currentOperand = "0.";
      return;
    }

    if (this.currentOperand.includes(".")) {
      return;
    }

    if (this.currentOperand.length >= 15) {
      return;
    }

    this.currentOperand += ".";
  }

  // 3. Đổi dấu âm/dương của số đang nhập
  toggleSign() {
    if (this.hasError) {
      return;
    }

    if (this.isFinished) {
      this.startFromResult();
    }

    if (this.currentOperand === "" || this.currentOperand === "0") {
      return;
    }

    if (this.currentOperand.startsWith("-")) {
      this.currentOperand = this.currentOperand.slice(1);
    } else {
      this.currentOperand = "-" + this.currentOperand;
    }
  }

  // 4. Xóa ký tự cuối cùng
  deleteNumber() {
    // Đang hiện lỗi hoặc kết quả: xóa tất cả
    if (this.hasError || this.isFinished) {
      this.clear();
      return;
    }

    // Số đã chốt (ví dụ sau "%") quay lại thành số đang nhập để xóa từng ký tự
    if (this.currentOperand === "" && this.isNumber(this.getLastToken())) {
      this.currentOperand = this.tokens.pop();
    }

    // Đang nhập số: xóa ký tự cuối
    if (this.currentOperand !== "") {
      this.currentOperand = this.currentOperand.slice(0, -1);

      if (this.currentOperand === "-") {
        this.currentOperand = "";
      }

      return;
    }

    // Không có số đang nhập: xóa token cuối ("+", "(", ")", ...)
    if (this.tokens.length > 0) {
      this.tokens.pop();

      // Nếu token phía trước là số thì đưa lại thành số đang nhập để sửa tiếp
      if (this.isNumber(this.getLastToken())) {
        this.currentOperand = this.tokens.pop();
      }
    }
  }

  // 5. Xóa toàn bộ
  clear() {
    this.tokens = [];
    this.currentOperand = "";
    this.lastExpression = "";
    this.result = "";
    this.isFinished = false;
    this.hasError = false;
  }

  // 6. Chọn phép toán
  chooseOperation(operation) {
    if (this.hasError) {
      return;
    }

    // Có kết quả: tiếp tục tính từ kết quả đó
    if (this.isFinished) {
      this.startFromResult();
    }

    // Đang nhập số: chốt số rồi thêm phép toán
    if (this.currentOperand !== "") {
      this.tokens.push(this.currentOperand);
      this.currentOperand = "";
      this.tokens.push(operation);
      return;
    }

    const lastToken = this.getLastToken();

    // Chưa nhập gì: coi như bắt đầu từ số 0
    if (lastToken === undefined) {
      this.tokens.push("0");
      this.tokens.push(operation);
      return;
    }

    // Ngay sau "(" chưa có số nên không thêm phép toán
    if (lastToken === "(") {
      return;
    }

    // Đang có phép toán ở cuối: thay bằng phép toán mới
    if (this.isOperator(lastToken)) {
      this.tokens[this.tokens.length - 1] = operation;
      return;
    }

    // Sau ")" hoặc số đã chốt: thêm phép toán
    this.tokens.push(operation);
  }

  // 7. Mở ngoặc
  openParenthesis() {
    this.prepareNewInput();

    // Không cho mở ngoặc ngay sau một số
    if (this.currentOperand !== "") {
      return;
    }

    const lastToken = this.getLastToken();

    // Chỉ mở ngoặc ở đầu biểu thức, sau phép toán hoặc sau "("
    if (
      lastToken === undefined ||
      this.isOperator(lastToken) ||
      lastToken === "("
    ) {
      this.tokens.push("(");
    }
  }

  // 8. Đóng ngoặc
  closeParenthesis() {
    if (this.hasError || this.isFinished) {
      return;
    }

    // Không có "(" nào đang chờ đóng
    if (this.countOpenParentheses(this.tokens) === 0) {
      return;
    }

    if (this.currentOperand !== "") {
      // Chốt số đang nhập trước khi đóng ngoặc
      this.tokens.push(this.currentOperand);
      this.currentOperand = "";
    } else {
      // Chỉ đóng ngoặc sau một số hoặc sau ")"
      const lastToken = this.getLastToken();

      if (lastToken !== ")" && !this.isNumber(lastToken)) {
        return;
      }
    }

    this.tokens.push(")");
  }

  // 9. Thực hiện phép tính
  compute() {
    if (this.hasError || this.isFinished) {
      return;
    }

    const items = this.getAllTokens();

    // Bỏ phép toán hoặc "(" thừa ở cuối, ví dụ "5 +" thành "5"
    while (items.length > 0) {
      const lastItem = items[items.length - 1];

      if (this.isOperator(lastItem) || lastItem === "(") {
        items.pop();
      } else {
        break;
      }
    }

    // Biểu thức rỗng hoặc chỉ có một số: không cần tính
    if (items.length <= 1) {
      return;
    }

    // Tự động đóng các dấu "(" còn thiếu
    const missingCount = this.countOpenParentheses(items);
    for (let index = 0; index < missingCount; index += 1) {
      items.push(")");
    }

    this.lastExpression = this.formatTokens(items);
    this.tokens = [];
    this.currentOperand = "";
    this.isFinished = true;

    try {
      const value = this.evaluate(items);

      if (!Number.isFinite(value)) {
        throw new Error("Kết quả không hợp lệ");
      }

      // Giảm sai số tính toán số thập phân
      this.result = parseFloat(value.toPrecision(12)).toString();
    } catch (error) {
      this.hasError = true;
      this.result = "Error";
    }
  }

  // 10. Tính phần trăm số đang nhập
  calculatePercent() {
    if (this.hasError) {
      return;
    }

    if (this.isFinished) {
      this.startFromResult();
    }

    if (this.currentOperand === "") {
      return;
    }

    const value = parseFloat(this.currentOperand) / 100;

    // Chốt luôn số vừa tính, người dùng phải chọn phép toán tiếp theo
    this.tokens.push(parseFloat(value.toPrecision(12)).toString());
    this.currentOperand = "";
  }

  // ===== Tính giá trị biểu thức =====
  // Thứ tự ưu tiên: ngoặc, nhân/chia, cộng/trừ.
  // Dùng phương pháp phân tích đệ quy, không dùng eval()

  evaluate(items) {
    this.parseTokens = items;
    this.parsePosition = 0;

    return this.parseExpression();
  }

  // Biểu thức = hạng tử, nối với nhau bằng "+" hoặc "-"
  parseExpression() {
    let value = this.parseTerm();

    while (
      this.parseTokens[this.parsePosition] === "+" ||
      this.parseTokens[this.parsePosition] === "-"
    ) {
      const operator = this.parseTokens[this.parsePosition];
      this.parsePosition += 1;

      const right = this.parseTerm();

      if (operator === "+") {
        value = value + right;
      } else {
        value = value - right;
      }
    }

    return value;
  }

  // Hạng tử = thừa số, nối với nhau bằng "*" hoặc "/"
  parseTerm() {
    let value = this.parseFactor();

    while (
      this.parseTokens[this.parsePosition] === "*" ||
      this.parseTokens[this.parsePosition] === "/"
    ) {
      const operator = this.parseTokens[this.parsePosition];
      this.parsePosition += 1;

      const right = this.parseFactor();

      if (operator === "*") {
        value = value * right;
      } else {
        if (right === 0) {
          throw new Error("Chia cho 0");
        }

        value = value / right;
      }
    }

    return value;
  }

  // Thừa số = một số, hoặc một biểu thức nằm trong ngoặc
  parseFactor() {
    const token = this.parseTokens[this.parsePosition];
    this.parsePosition += 1;

    if (token === "(") {
      const value = this.parseExpression();

      // Bỏ qua dấu ")"
      this.parsePosition += 1;

      return value;
    }

    return parseFloat(token);
  }
}
