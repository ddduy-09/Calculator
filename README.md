# Calculator

Máy tính bỏ túi chạy trên trình duyệt, viết bằng HTML, CSS và JavaScript thuần (ES Modules), không dùng thư viện ngoài.

## Tính năng

- Phép toán: cộng (`+`), trừ (`−`), nhân (`×`), chia (`÷`) với thứ tự ưu tiên đúng: ngoặc, nhân/chia, cộng/trừ
- Dấu ngoặc `(` và `)`, lồng nhau được
- Số thập phân (`.`), đổi dấu (`±`), phần trăm (`%`)
- `AC`: xóa toàn bộ
- `⌫`: xóa lần lượt từng thành phần của biểu thức
- Nhấn `=` tự đóng các dấu `(` còn thiếu: `(5 + 3` → `(5 + 3)` = `8`
- Báo `Error` khi chia cho 0 hoặc kết quả không hợp lệ
- Giới hạn 15 ký tự mỗi số
- Giảm sai số số thực bằng `toPrecision(12)` (ví dụ `0.1 + 0.2 = 0.3`)

## Cách hiển thị

| Vùng | Phần tử | Nội dung |
|---|---|---|
| Trên | `#previous-operand` | Biểu thức đang nhập, ví dụ `(5 + 3) × 2` |
| Dưới | `#current-operand` | Kết quả sau khi nhấn `=` |

Sau khi nhấn `=`, vùng trên giữ lại biểu thức vừa tính, vùng dưới hiện kết quả.

## Cấu trúc thư mục

```
calculator/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── calculator.js
    └── controller.js
```

| File | Vai trò |
|---|---|
| `index.html` | Giao diện: màn hình và bàn phím, mỗi nút gắn `data-number`, `data-operator` hoặc `data-action` |
| `css/style.css` | Bố cục (Flexbox, CSS Grid) và màu sắc |
| `js/calculator.js` | Lớp `Calculator`: lưu biểu thức, tính toán, không thao tác DOM |
| `js/controller.js` | Lớp `CalculatorController`: nhận sự kiện nhấn nút, gọi `Calculator`, cập nhật màn hình |
| `js/main.js` | Điểm khởi chạy: tạo `Calculator` và `CalculatorController` |

## Luồng hoạt động

```
Nhấn nút → CalculatorController.handleButtonClick()
         → Calculator xử lý và cập nhật trạng thái
         → CalculatorController.updateDisplay()
```

## Trạng thái của `Calculator`

| Thuộc tính | Ý nghĩa |
|---|---|
| `tokens` | Các thành phần đã chốt của biểu thức, ví dụ `["(", "5", "+", "3", ")"]` |
| `currentOperand` | Số đang nhập (chuỗi), rỗng nếu chưa nhập |
| `lastExpression` | Biểu thức vừa tính xong |
| `result` | Kết quả vừa tính |
| `isFinished` | `true` khi vừa nhấn `=` |
| `hasError` | `true` khi phép tính lỗi |

## Quy tắc dấu ngoặc

| Thao tác | Điều kiện được nhập |
|---|---|
| `(` | Ở đầu biểu thức, sau phép toán hoặc sau `(` |
| `)` | Có `(` đang chờ đóng, và đứng sau một số hoặc sau `)` |
| Số, `.` | Không nhập được ngay sau `)` |
| Phép toán | Không nhập được ngay sau `(` |

## Bảng xử lý nút xóa `⌫`

| Trạng thái | Khi nhấn `⌫` |
|---|---|
| Đang hiện kết quả hoặc `Error` | Xóa tất cả về `0` |
| Đang nhập số (`5 + 3`) | Xóa ký tự cuối của số |
| Số đã bị xóa hết (`5 +`) | Xóa phép toán |
| Cuối biểu thức là `(` hoặc `)` | Xóa dấu ngoặc đó |

Ví dụ `(5 + 3)`: `(5 + 3)` → `(5 + 3` → `(5 +` → `(5` → `(` → `0`.

## Chạy dự án

Dự án dùng `type="module"`, trình duyệt chặn module khi mở file trực tiếp (`file://`). Cần chạy qua một máy chủ cục bộ.

**Cách 1: VS Code**

1. Cài extension **Live Server**
2. Chuột phải `index.html` → **Open with Live Server**

**Cách 2: Node.js**

```bash
npx serve .
```

Sau đó mở địa chỉ hiển thị trong terminal (thường là `http://localhost:3000`).
