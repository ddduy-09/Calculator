# Calculator

Máy tính bỏ túi chạy trên trình duyệt, viết bằng HTML, CSS và JavaScript thuần (ES Modules), không dùng thư viện ngoài.

## Tính năng

- Phép toán: cộng (`+`), trừ (`−`), nhân (`×`), chia (`÷`)
- Số thập phân (`.`), đổi dấu (`±`), phần trăm (`%`)
- `AC`: xóa toàn bộ
- `⌫`: xóa lần lượt từng thành phần của biểu thức (số thứ hai → phép toán → số thứ nhất)
- Tính liên tiếp: `5 + 3 + 2` tự tính `5 + 3` khi chọn phép toán tiếp theo
- Báo `Error` khi chia cho 0 hoặc kết quả không hợp lệ
- Giới hạn 15 ký tự mỗi số
- Giảm sai số số thực bằng `toPrecision(12)` (ví dụ `0.1 + 0.2 = 0.3`)

## Cách hiển thị

| Vùng | Phần tử | Nội dung |
|---|---|---|
| Trên | `#previous-operand` | Biểu thức đang nhập, ví dụ `5 + 3` |
| Dưới | `#current-operand` | Kết quả sau khi nhấn `=` |

Sau khi nhấn `=`, vùng trên giữ lại biểu thức vừa tính (`5 + 3`), vùng dưới hiện kết quả (`8`).

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
| `js/calculator.js` | Lớp `Calculator`: toàn bộ logic tính toán, không thao tác DOM |
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
| `currentOperand` | Số đang nhập (chuỗi) |
| `previousOperand` | Số nhập trước đó |
| `operation` | Phép toán đang chọn, `null` nếu chưa có |
| `shouldResetScreen` | `true` khi lần nhập số kế tiếp phải bắt đầu số mới |
| `lastExpression` | Biểu thức vừa tính xong, hiển thị sau khi nhấn `=` |

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

## Bảng xử lý nút xóa `⌫`

| Trạng thái | Khi nhấn `⌫` |
|---|---|
| Đang hiện kết quả (`5 + 3` / `8`) | Xóa tất cả về `0` |
| Vừa chọn phép toán (`5 +`) | Xóa phép toán, quay về `5` |
| Đang nhập số thứ hai (`5 + 3`) | Xóa ký tự cuối; hết số thì về `5 +` |
| Đang nhập số thứ nhất (`53`) | Xóa ký tự cuối; hết số thì về `0` |
| `Error` | Đặt lại toàn bộ |
