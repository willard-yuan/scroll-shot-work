---
title: "Cách Chụp Ảnh Màn Hình Dài (Cuộn) Trên Mac Năm 2026: Hướng Dẫn Đầy Đủ"
description: "macOS không có tính năng chụp ảnh màn hình cuộn tích hợp. Hướng dẫn 2026 này giải thích lý do, so sánh GoFullPage, Shottr, CleanShot X, Xnapper, screensnap và ScrollShot, đồng thời hướng dẫn cách chụp bất kỳ cửa sổ nào miễn phí với ScrollShot cho Mac."
date: "2026-08-05"
category: "Hướng dẫn"
author: "Đội ngũ ScrollShot"
tags: ["ảnh màn hình dài trên Mac", "ảnh chụp màn hình cuộn Mac", "chụp màn hình cuộn Mac", "ScrollShot cho Mac", "công cụ chụp màn hình macOS", "scroll and stitch"]
readingTime: "10 phút đọc"
cover: "/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp"
coverAlt: "Một ảnh chụp màn hình thông thường một màn hình của Mac bên cạnh ảnh chụp cuộn ScrollShot 765 × 4091 px của cùng nội dung"
translationKey: "how-to-take-long-scrolling-screenshot-on-mac-2026"
faq:
  - question: "Tôi có thể chụp ảnh màn hình cuộn bằng ứng dụng Ảnh chụp màn hình tích hợp của Mac không?"
    answer: "Không. Cmd + Shift + 4 và ứng dụng Ảnh chụp màn hình chỉ bắt được màn hình hiển thị. Bạn cần tính năng trình duyệt, xuất PDF hoặc ứng dụng bên thứ ba như ScrollShot, Shottr hay CleanShot X."
  - question: "Cách nhanh và miễn phí nhất để chụp ảnh màn hình dài trên Mac là gì?"
    answer: "Chỉ cho trang web: GoFullPage (dưới 30 giây). Cho mọi thứ ngoài trình duyệt — Slack, PDF, ứng dụng — cả ScrollShot cho Mac lẫn Shottr đều hoạt động và miễn phí."
  - question: "Có công cụ chụp màn hình cuộn miễn phí nào vừa dịch vừa che giấu dữ liệu không?"
    answer: "Có — ScrollShot cho Mac. Nó miễn phí và kết hợp một cách độc nhất việc chụp cuộn với OCR, dịch hơn 30 ngôn ngữ, hơn 19 công cụ chú thích và tự động che giấu thông tin cá nhân/khuôn mặt trong một ứng dụng."
  - question: "Ảnh màn hình cuộn có hoạt động với PDF và tài liệu không?"
    answer: "Có, nếu bạn dùng ứng dụng chụp cuộn gốc (ScrollShot, Shottr, CleanShot X) trên PDF mở trong Xem trước hoặc trình đọc. Tính năng 'Lưu thành PDF' tích hợp cho ra tài liệu, không phải ảnh."
  - question: "Tại sao ảnh màn hình cuộn của tôi bị trùng tiêu đề?"
    answer: "Trang có phần tử cố định — bong bóng chat, thanh điều hướng hay biểu ngữ cookie — đứng yên khi nội dung cuộn. Hãy đóng hoặc ẩn nó trước khi chụp."
  - question: "Tôi nên lưu ảnh màn hình cuộn ở định dạng nào?"
    answer: "PNG cho chất lượng và trong suốt; JPG nếu kích thước tệp quan trọng và bạn không cần trong suốt; PDF chỉ khi cần văn bản có thể tìm kiếm."
---

# Cách Chụp Ảnh Màn Hình Dài (Cuộn) Trên Mac Năm 2026: Hướng Dẫn Đầy Đủ

Để tôi giúp bạn tiết kiệm 20 phút mà lần đầu tôi đã lãng phí cho việc này.

Tôi có một chuỗi tin nhắn Slack dài 4.000 pixel cần gửi cho một lập trình viên. Tôi nhấn `Cmd + Shift + 4`, kéo một khung và... nhận được đúng một màn hình. Phần còn lại của cuộc hội thoại nằm bên dưới, và macOS vui vẻ bỏ qua nó. **Không có cách gốc nào để chụp ảnh màn hình cuộn trên Mac** — không trong `Cmd + Shift + 4`, không trong ứng dụng Ảnh chụp màn hình, không trong Xem trước. Nếu bạn đến đây hy vọng có một phím tắt ẩn của Apple, tôi nói thẳng: nó không tồn tại. Windows có trong Công cụ Cắt. iPhone có. Android có. macOS, tính đến 2026, vẫn chưa tích hợp sẵn.

Tin tốt: hoàn toàn có thể giải quyết, và bạn có nhiều lựa chọn hơn hầu hết các blog "danh sách 8 công cụ hàng đầu" thừa nhận. Hướng dẫn này đi sâu hơn bề mặt. Tôi sẽ giải thích *tại sao* Mac không làm được việc này một cách gốc, chuyện gì thực sự xảy ra khi một ứng dụng "cuộn và ghép", và công cụ nào phù hợp với việc nào — bao gồm công cụ tôi dùng hàng ngày, **[ScrollShot cho Mac](/vi/blog/vi-sao-chon-scrollshot-anh-chup-man-hinh-dai-ios/)** (miễn phí, và là lựa chọn duy nhất làm trọn vẹn mọi việc trong một ứng dụng).

![Trước và Sau: một ảnh chụp màn hình thông thường một màn hình của Mac bên cạnh ảnh chụp cuộn ScrollShot 765 × 4091 px của cùng nội dung](/how-to-take-long-scrolling-screenshot-on-mac-2026/hero-long-screenshot-mac-before-after.webp)

*Ảnh chụp thông thường chỉ bắt được khung nhìn hiển thị. ScrollShot bắt trọn vùng cuộn 765 × 4091 px trong một ảnh — sau đó cho phép chú thích, OCR, dịch và che giấu dữ liệu mà không rời ứng dụng.*

---

## Tại sao macOS không thể chụp ảnh màn hình cuộn một cách gốc

Không phải vì Apple lười — đó là cách màn hình hoạt động.

Khi bạn nhấn `Cmd + Shift + 4`, macOS bắt *bộ đệm khung*: một ảnh tức thời từng pixel của những gì đang hiển thị trên màn hình lúc đó. Một cửa sổ cuộn (Slack, trang web, PDF) chỉ dựng phần hiển thị. Nội dung ngoài màn hình không "ở đó" để bắt — nó được vẽ theo yêu cầu khi bạn cuộn. Không có "bộ đệm cuộn" như terminal. Vì vậy công cụ chụp có hai lựa chọn:

1. **Yêu cầu ứng dụng cung cấp toàn bộ nội dung** (chỉ hiệu quả nếu ứng dụng hé lộ nó — trình duyệt thì có, hầu hết ứng dụng thì không).
2. **Cuộn một chút, chụp một chút, lặp lại, rồi ghép các mảnh** thành một ảnh cao.

Mọi công cụ "ảnh màn hình cuộn" trên Mac đều thực hiện lựa chọn #2 bên dưới (hoặc #1 chỉ cho trang web). Sự khác biệt này quan trọng, vì nó giải thích tại sao một số công cụ chỉ chạy trên Chrome và một số chạy *mọi nơi*.

![Khung nhìn hiển thị so với nội dung cuộn đầy đủ — macOS chỉ bắt những gì trên màn hình, không phải phần bên dưới](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-viewport-vs-full.webp)

---

## Ba nhóm giải pháp

Trước khi đưa đề xuất, hãy biết các nhóm. Chúng không thể thay thế cho nhau.

| Nhóm | Cách hoạt động | Tốt nhất cho | Không làm được |
| --- | --- | --- | --- |
| **Chỉ trình duyệt** (GoFullPage, tính năng tích hợp Firefox, DevTools, Safari Web Inspector) | Yêu cầu trang cung cấp DOM/nội dung đầy đủ | Trang web *mở trong trình duyệt đó* | Slack, PDF trong Xem trước, cửa sổ ứng dụng, bảng Figma |
| **Ứng dụng chụp cuộn gốc** (Shottr, CleanShot X, Xnapper, **ScrollShot**, screensnap*) | Cuộn + ghép màn hình thật | *Bất kỳ* vùng cuộn nào, kể cả ứng dụng ngoài trình duyệt | — (chỉ giới hạn bởi chất lượng ứng dụng) |
| **Xuất PDF** (`Cmd + P` → Lưu thành PDF) | Dựng bố cục thành tài liệu | Lưu trữ có thể tìm kiếm, in ấn | Không phải ảnh; không dán nội tuyến |

\* *screensnap (ScreenSnap Pro) là một ngoại lệ đáng chú ý — xem ghi chú bên dưới. Nó là công cụ chú thích, không phải công cụ chụp cuộn.*

---

## Đề xuất nhanh (đọc nếu bạn đang vội)

- **Bạn chỉ chụp ảnh trang web** → tiện ích mở rộng trình duyệt như GoFullPage là đủ và miễn phí.
- **Bạn cần bắt Slack, PDF, cửa sổ ứng dụng hoặc tài liệu** → bạn cần một ứng dụng gốc.
- **Bạn muốn một công cụ miễn phí vừa bắt *và* cho phép OCR, dịch, chú thích, làm mờ thông tin nhạy cảm, thậm chí quay video — không phải trả tiền hay đăng ký** → **ScrollShot cho Mac**. Nó là lựa chọn duy nhất trong hướng dẫn này thực hiện toàn bộ quy trình một cách gốc và miễn phí.

![So sánh ba công cụ: GoFullPage (chỉ web), CleanShot X ($29/năm) và ScrollShot (miễn phí, tất cả-trong-một)](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-3up-comparison-cards.webp)

---

## So sánh đầy đủ (Shottr, CleanShot X, Xnapper, screensnap, ScrollShot)

Tôi đã thử các đối thủ phổ biến trên macOS 15/26. Đây là cách chúng thực sự hoạt động, không phải cách tiếp thị mô tả. Để dễ đọc, tôi chia làm hai bảng tập trung — những gì mỗi công cụ có thể **bắt** và những gì có thể làm với **kết quả**.

### Bắt và phạm vi

| Công cụ | Giá | Chụp cuộn | Ngoài trình duyệt? |
| --- | --- | --- | --- |
| **ScrollShot cho Mac** | **Miễn phí** | ✅ Tự động ghép qua Apple Vision | ✅ Bất kỳ vùng cuộn nào |
| **Shottr** | Miễn phí ($12 một lần để bỏ lời nhắc) | ✅ Cuộn thủ công + ghép | ✅ |
| **CleanShot X** | $29/năm (hoặc $59 một lần) | ✅ Tự động hoặc thủ công | ✅ |
| **Xnapper** | $24 một lần | ✅ | ✅ |
| **screensnap (ScreenSnap Pro)** | $39 một lần | ❌ **Không chụp cuộn** | ❌ |
| **GoFullPage** | Miễn phí (gói trả phí) | ✅ (chỉ trình duyệt) | ❌ Chỉ web |

### Chỉnh sửa sau khi chụp

| Công cụ | Chú thích | OCR + Dịch | Quay/chỉnh video | Tự động che giấu dữ liệu |
| --- | --- | --- | --- | --- |
| **ScrollShot cho Mac** | ✅ 19+ công cụ | ✅ 30+ ngôn ngữ | ✅ MP4/GIF + cắt | ✅ Email, điện thoại, khóa API, khuôn mặt |
| **Shottr** | ✅ Cơ bản | ⚠️ Chỉ OCR, không dịch | ❌ | ❌ |
| **CleanShot X** | ✅ Mạnh | ❌ | ✅ (riêng) | ⚠️ Chỉ làm mờ thủ công |
| **Xnapper** | ✅ + làm đẹp | ❌ | ❌ | ⚠️ Tự động làm mờ riêng tư |
| **screensnap (ScreenSnap Pro)** | ✅ 15 công cụ + nền | ❌ | ✅ GIF | ⚠️ Làm mờ thủ công |
| **GoFullPage** | ⚠️ Cắt cơ bản | ❌ | ❌ | ❌ |

**Sự thật về screensnap.** Chính blog của screensnap ("8 Phương Pháp Xếp Hạng Theo Tốc Độ") là một danh sách xếp hạng thực sự hữu ích — nhưng hãy chú ý nó đề xuất gì cho việc bắt thực sự: GoFullPage và Shottr. ScreenSnap Pro bản thân nó *không thể chụp ảnh màn hình cuộn*. Nó được xây dựng cho bước *tiếp theo* (làm đẹp + chú thích + chia sẻ một ảnh bạn đã chụp ở nơi khác). Vì vậy, nếu vấn đề của bạn là "tôi cần ảnh dài trước tiên", screensnap không phải giải pháp bắt; nó là hậu-khi-chụp. Ngược lại, ScrollShot làm cả việc bắt *và* bước chú thích/làm mờ/chia sẻ trong cùng một ứng dụng miễn phí.

---

## "Cuộn và ghép" thực sự hoạt động thế nào (và tại sao nó hỏng)

Khi ScrollShot (hay Shottr, hay CleanShot) chụp một ảnh dài, quy trình cuộn và ghép là:

1. Bắt vùng hiển thị.
2. Mô phỏng cuộn (hoặc chờ bạn cuộn).
3. Bắt vùng tiếp theo.
4. **Khớp các pixel chồng lấp** giữa hai khung để tìm đường nối.
5. Ghép lại và lặp lại cho đến khi bạn dừng.

Bước khớp là nơi các công cụ sống hoặc chết trong mọi quy trình cuộn-và-ghép. [Công cụ ghép](/vi/blog/ios-stitching-engine-v2/) của ScrollShot dùng khung Vision của Apple để khớp khung hình, và đó là lý do nó xử lý tốc độ cuộn thay đổi và dịch chuyển bố cục nhỏ tốt hơn các cách tiếp cận sai khác pixel ngây thơ. Ba thứ vẫn phá hỏng mọi bộ ghép:

- **Tiêu đề/chân trang cố định** không di chuyển khi nội dung cuộn → thanh trùng lặp. (Hãy đóng tiện ích chat và biểu ngữ cookie trước.)
- **Nội dung tải theo yêu cầu** chỉ xuất hiện sau khi bạn cuộn → khoảng trống. (Cuộn một lượt, rồi bắt từ đầu.)
- **Giả định chiều rộng cố định** → nếu bạn đổi kích thước cửa sổ, chiều rộng đầu ra thay đổi. Hãy quyết định chiều rộng trước khi chụp.

![Cách cuộn và ghép hoạt động: công cụ khớp dải chồng lấp để tìm nơi khung 2 gắn vào khung 1](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-stitch-overlap.webp)

---

## Từng bước: chụp ảnh màn hình dài với ScrollShot cho Mac

Đây là quy trình tôi hiện dùng cho mọi thứ.

**1. Cài đặt (30 giây).**  
Tải từ [`mac.scrollshot.work/ScrollShot.dmg`](https://mac.scrollshot.work/ScrollShot.dmg), mở DMG, kéo vào Ứng dụng. Không cần tài khoản, không cần khóa bản quyền.

![Cài đặt ScrollShot: mở DMG và kéo ứng dụng vào Ứng dụng](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-dmg-install.webp)

**2. Kích hoạt chụp cuộn.**  
Nhấn phím tắt chụp cuộn (hoặc chọn từ thanh menu). Kéo một khung quanh vùng cuộn — một trang web, một khung Slack, một cột PDF, bất cứ gì.

**3. Cuộn.**  
Cuộn bằng trackpad hoặc bánh xe chuột. ScrollShot tự động ghép theo thời gian thực; bạn xem ảnh cao lớn dần trong bản xem trước. Dừng khi đã bắt đủ mọi thứ.

![Bản xem trước trực tiếp: ScrollShot tự động ghép khi bạn cuộn và bạn xem ảnh cao lớn dần](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-live-preview.webp)

**4. Một ảnh, đã sẵn sàng chỉnh sửa.**  
Khi xong, bạn không bị đẩy vào trình chỉnh sửa riêng. Cùng cửa sổ cho phép bạn: thêm mũi tên/số, **OCR văn bản và dịch sang hơn 30 ngôn ngữ ngay trong ảnh**, làm mờ hoặc tự động che giấu email/điện thoại/khóa API/khuôn mặt, rồi xuất thành PNG hoặc lưu vào nền gradient được làm đẹp.

![Chú thích ảnh dài đã hoàn thành: mũi tên, số, làm mờ và dịch — không rời ứng dụng](/how-to-take-long-scrolling-screenshot-on-mac-2026/img-annotation-toolbar.webp)

**5. Chia sẻ.**  
Sao chép vào clipboard, tải lên S3/Cloud của bạn hoặc xuất. Xong — không rời ứng dụng.

Điểm cuối này là lý do thực sự tôi chuyển sang. Với Shottr, tôi bắt xong rồi mở ứng dụng khác để chú thích. Với CleanShot X, tôi trả $29/năm cho đặc quyền đó. Sau khi chụp cuộn-và-ghép, ScrollShot thực hiện bắt → chỉnh → dịch → che giấu → xuất trong một lượt, miễn phí.

---

## Khi nào bạn *không* nên dùng ứng dụng chụp cuộn

Hãy trung thực về công việc:

- **Bạn cần văn bản có thể tìm kiếm và sao chép** (lưu trữ pháp lý, PDF nghiên cứu) → `Cmd + P` → Lưu thành PDF. Một PNG 12.000 pixel không thể tìm kiếm.
- **Bạn chỉ chụp một trình duyệt** và không bao giờ rời nó → GoFullPage hoặc "Chụp ảnh màn hình → Lưu toàn trang" tích hợp của Firefox nhẹ hơn.
- **Bạn cần bố cục in ấn chính xác từng pixel** → lại là PDF.

Cho mọi thứ khác — chuỗi chat, tài liệu, ngăn cài đặt, trang web dài bạn sẽ chú thích — một ứng dụng cuộn gốc thắng thế.

---

## Các lỗi thường gặp (và cách fix)

- **Tiêu đề trùng lặp trong kết quả** → phần tử cố định. Hãy bỏ nó hoặc dùng công cụ xử lý tốt phần cố định trước khi chụp.
- **Thiếu đoạn giữa** → cuộn vô hạn / tải theo yêu cầu. Hãy cuộn xuống đáy một lần, rồi bắt từ đầu.
- **Văn bản mờ** → bắt ở DPI thấp. Hãy phóng to cửa sổ (hoặc zoom) trước khi chụp.
- **Tệp quá lớn** → một PNG cao 10.000px có thể vài MB. Hãy nén trước khi chia sẻ, hoặc chia thành các phần để dễ đọc.

---

## FAQ

**Tôi có thể chụp ảnh màn hình cuộn bằng ứng dụng Ảnh chụp màn hình tích hợp của Mac không?**  
Không. `Cmd + Shift + 4` và ứng dụng Ảnh chụp màn hình chỉ bắt màn hình hiển thị. Bạn cần tính năng trình duyệt, xuất PDF hoặc ứng dụng bên thứ ba như ScrollShot, Shottr hay CleanShot X.

**Cách nhanh và miễn phí nhất để chụp ảnh màn hình dài trên Mac là gì?**  
Chỉ cho trang web: GoFullPage (dưới 30 giây). Cho mọi thứ ngoài trình duyệt (Slack, PDF, ứng dụng): ScrollShot cho Mac hoặc Shottr — cả hai đều miễn phí, cả hai đều hoạt động trên mọi vùng cuộn.

**Có công cụ chụp màn hình cuộn miễn phí nào vừa dịch vừa che giấu dữ liệu không?**  
Có — [ScrollShot cho Mac](/vi/blog/vi-sao-chon-scrollshot-anh-chup-man-hinh-dai-ios/). Nó miễn phí và kết hợp một cách độc nhất việc chụp cuộn với OCR, dịch hơn 30 ngôn ngữ, hơn 19 công cụ chú thích và tự động che giấu thông tin cá nhân/khuôn mặt trong một ứng dụng.

**Ảnh màn hình cuộn có hoạt động với PDF và tài liệu không?**  
Có, nếu bạn dùng ứng dụng chụp cuộn gốc (ScrollShot, Shottr, CleanShot X) trên PDF mở trong Xem trước hoặc trình đọc. Tính năng "Lưu thành PDF" tích hợp cho ra tài liệu, không phải ảnh.

**Tại sao ảnh màn hình cuộn của tôi bị trùng tiêu đề?**  
Trang có phần tử cố định (bong bóng chat, thanh điều hướng, biểu ngữ cookie) đứng yên khi nội dung cuộn. Hãy đóng hoặc ẩn nó trước khi chụp.

**Tôi nên lưu ảnh màn hình cuộn ở định dạng nào?**  
PNG cho chất lượng và trong suốt; JPG nếu kích thước tệp quan trọng và bạn không cần trong suốt; PDF chỉ khi cần văn bản có thể tìm kiếm.
