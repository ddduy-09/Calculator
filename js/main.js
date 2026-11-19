import { Calculator } from "./calculator.js";
import { CalculatorController } from "./controller.js";

// Khởi tạo bộ xử lý tính toán
const calculator = new Calculator();

// Khởi tạo bộ điều khiển
const controller = new CalculatorController(calculator);
