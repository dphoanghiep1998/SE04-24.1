# SE04-24.1

Node-module là cần thiết để chạy chương trình, yêu cầu có NodeJs trong máy sẵn.

# Ý tưởng :
  - Xây dựng chatbot platform Facebook Messenger cơ bản, là 1 module nhỏ của hệ thống chatbot ứng cứu thiên tai, lũ lụt, giúp đỡ người 
  dân miền Trung
# Kịch bản tạo dựng của form chatbot: 
Bot : Chào anh/chị . Đây là chatbot ( trả lời tự động) của Trung tâm/ hội / tổ chức X nhằm đáp ứng kịp thời thông tin cứu nạn cứu trợ miền Trung.
Anh chị là ?

User : Người muốn hỗ trợ | Người cần hỗ trợ

Bot : Đối với người cần hỗ trợ, chúng tôi cần anh/chị cung cấp các thông tin cá nhân sau



* Giai đoạn 1: Thu thập thông tin người cần hỗ trợ

Bot: Họ tên đầy đủ?

User : “gõ tên “

Bot : Ngày tháng năm sinh (ví dụ 01-01-1955) 

User : “nhập tuổi”

Bot : Số chứng minh nhân dân/ căn cước công dân 

User : “nhập CMND”

Bot : Nơi ở?

User : “Nhập nơi ở”

Bot: Số đt liên lạc?

User:




*Giai đoạn 2: Thu thập thông tin tình hình hiện tại

Bot: Mức độ khẩn cấp ?

(Bot gợi ý: Rất khẩn cấp | khẩn cấp | tạm thời | ít hơn nữa)

User: lựa chọn

Bot: Vị trí hiện tại của bạn?

User:

Bot : Anh / chị cần hỗ trợ về?

(Bot gợi ý: Nước uống | Lương thực | Nơi ở | Dụng cụ y tế | Tiền mặt)

User: chọn các gợi ý hoặc nhập thêm

Bot: Số lượng lương thực, nước uống, nhu yếu phẩm còn lại còn dùng được trong bao lâu?

User:

Bot: Bạn đang ở cùng bao nhiêu người?

User: “gõ số lượng”

Bot: Có ai bị thương không? Nếu có mô tả tình hình người bị thương?

User: Không | Có

Bot: Ước tính tổng tài sản bị thiệt hại?

User: Answer

Bot: Bạn có muốn gửi thông tin của mình tới tổ chức, cá nhân cụ thể nào không?

User: Không | Có

Bot: Hãy điền thêm thông tin nếu cần

User: nhập thêm thông tin 


Thông tin của anh chị đã được ghi lại, mọi thắc mắc xin liên hệ với chúng tôi, sđt :xxxx, ……

https://www.facebook.com/ChatBot-V%C3%AC-mi%E1%BB%81n-Trung-101198895190244

# Cấu trúc của project:
  - Đây là cấu trúc của 1 project NodeJs bao gồm  :
    + file node_modules : chưa các Node modules
    + file src
      *
    + file package-lock.json
    + file package.json
    + file .env
    + file .env.example
  
