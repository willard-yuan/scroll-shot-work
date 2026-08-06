---
title: "Người dùng cứ khăng khăng lật ngược cuộn để chụp — và tôi đã né được việc viết lại toàn bộ engine chỉ với một dòng"
description: "Khi người dùng muốn chụp một ảnh màn hình dài iPhone bằng cách cuộn ngược lên, bản năng đầu tiên của tôi là xây một « engine đi lên » riêng. Cuối cùng, chỉ một dòng code là đủ. Bài viết này bóc tách thiết kế ghép ảnh cuộn ngược của ScrollShot, kỹ thuật đằng sau một ảnh chụp màn hình cuộn mượt mà trong các app như Messages và WhatsApp, và chỉ ra cách chúng tôi phát hiện hướng cuộn, đảo ngược thứ tự frame và tái sử dụng pipeline đi xuống hiện có. Bạn sẽ thấy tại sao phát hiện hướng cuộn gần như miễn phí, tại sao chúng tôi đảo ngược thứ tự frame thay vì thêm cờ isReversed, và cách trả quyết định lại cho người dùng khi độ tự tin thấp, để chụp mà engine không đoán sai."
date: "2026-07-12"
category: "Kỹ thuật chuyên sâu"
author: "Đội ngũ ScrollShot"
tags: ["Ảnh chụp màn hình dài iPhone", "Ảnh chụp màn hình cuộn iPhone", "Ảnh chụp màn hình dài iOS", "Thuật toán ghép ảnh chụp", "Cuộn ngược", "Phát hiện hướng cuộn", "Engine ScrollShot", "Ghép bản ghi màn hình"]
readingTime: "6 phút đọc"
cover: "/ios_stitching_engine_reverse_scroll_framework_en.webp"
coverAlt: "Sơ đồ khớp template ngược của ScrollShot cho ảnh chụp màn hình cuộn iPhone: lấy template từ đỉnh frame mới, tìm offset ở đáy frame cũ"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# Người dùng cứ khăng khăng lật ngược cuộn để chụp — và tôi đã né được việc viết lại toàn bộ engine chỉ với một dòng

Hầu hết những ai muốn một ảnh chụp màn hình dài iPhone — hay bất kỳ ảnh chụp màn hình cuộn iPhone nào trong một app — đều mặc định người dùng cuộn từ trên xuống. Engine ghép ảnh của ScrollShot ban đầu cũng được thiết kế như vậy — tôi đã viết toàn bộ câu chuyện trong <a href="/vi/blog/ios-stitching-engine-v2/">« Ghép hai ảnh chụp màn hình khó đến mức nào? Một engine stitching iOS khiến tôi phải làm lại từ đầu — hết lần này đến lần khác »</a>: ghi hình → lấy mẫu frame cách đều → khớp template từng frame để tính offset → tìm đường may tốt nhất → cắt và ghép. Pipeline này đã vững cho trường hợp trên xuống.

Nhưng thế giới thực thích phản bác. Người dùng muốn chụp một ảnh chụp màn hình cuộn iPhone của một cuộc trò chuyện — Messages, WhatsApp hay WeChat — hoặc lưu phần trang web họ cuộn ngược lên để xem, đúng trường hợp « ảnh chụp toàn trang trong app iPhone » mà mọi người cứ hỏi — và khi ghi hình, ngón tay họ trượt lên. Nội dung chảy ngược trong bản ghi: bắt đầu ở đáy trang và 「kết thúc」 thực ra là nội dung cũ hơn. Đưa thẳng vào engine trên xuống sẽ cho ra một ảnh bị lộn ngược: đỉnh ảnh là nội dung cũ ở cuối bản ghi, và đáy là đầu.

Bài viết này nói về cách ScrollShot hỗ trợ ghép từ dưới lên. Điểm không phải ở thuật toán sâu — mà là một sự đánh đổi thiết kế cực độ về lượng code ít tới mức nào.

Đầu tiên, một demo ghép cuộn chuẩn trên xuống — ghép ngược mà chúng ta sẽ bàn được xây thẳng trên nó:

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>Demo ghép cuộn trên xuống: ghi một lần, cuộn một lần, và ScrollShot tự động lấy mẫu frame, khớp phần chồng, ghép thành một ảnh chụp màn hình dài iPhone hoàn chỉnh.</p>
</div>

---

## Bản năng đầu tiên: xây một 「engine đi lên」 riêng?

Lần đầu tôi gặp yêu cầu này, bản năng của tôi là: đã có engine ghép đi xuống, sao không viết thêm một cái đi lên?

Tôi nhanh chóng tự thuyết phục mình từ bỏ. Cốt lõi của engine đi xuống là khớp template ngược: lấy template từ đỉnh frame mới (img2) và tìm ở đáy frame cũ (img1) để tính offset. Chuyển sang đi lên thì gần như mọi tọa độ đều phải đảo — template lấy từ đâu, tìm kiếm quét về hướng nào, offset dương/âm định nghĩa ra sao, vùng đường may chồng tính thế nào… Một engine 3.000 dòng nghĩa là nuôi thêm một bản song song, mỗi cái có bug riêng và bảo trì riêng. Tệ hơn, mọi sửa đổi cho engine đi xuống đều phải nhân đôi sang engine đi lên, nếu không hai bên sẽ âm thầm phân kỳ.

## Bước ngoặt: đảo ngược, rồi tái sử dụng

Điều thực sự khiến tôi dừng lại là một quan sát giản đơn: engine ghép ảnh chẳng quan tâm nội dung 「chảy」 thế nào — nó chỉ quan tâm giữa hai frame kề nhau, cái nào ở trên, cái nào ở dưới. Miễn là dãy frame được xếp theo đúng trục thời gian thực của nội dung, cùng thuật toán sẽ chạy mượt mà. Ảnh từ dưới lên chỉ là 「sai thứ tự」.

Vậy cách làm của ScrollShot là: phát hiện hướng cuộn trước; nếu là đi lên, đảo ngược toàn bộ dãy frame, rồi đưa vào pipeline đi xuống hiện có.

```
Lấy mẫu frame (cuộn đi lên, nội dung chảy ngược):
  [F1 đáy trang] → [F2] → [F3] → … → [Fn đỉnh trang]
                             │
             ScrollDirectionDetector quyết định: đi lên
                             │
              reversedForStitching() đảo ngược thứ tự frame
                             ▼
  [Fn đỉnh trang] → … → [F3] → [F2] → [F1 đáy trang]
                             │
              vào cùng engine ghép đi xuống (không đổi dòng nào)
                             ▼
                   ảnh dài đúng (đỉnh → đáy)
```

Sơ đồ dưới vẽ toàn bộ chuỗi 「đảo ngược + tái sử dụng」 — lấy mẫu frame, phát hiện hướng, đảo thứ tự frame, tái dụng engine đi xuống, đến tận ảnh dài đúng:

![Sơ đồ thuật toán ghép cuộn từ dưới lên](/ios_stitching_engine_reverse_scroll_framework_en.webp)

Code cốt lõi chỉ một dòng:

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()` đảo ngược các tham chiếu frame đã trích và đánh số lại; mọi thứ khác giữ nguyên. Sau khi đảo, nội dung 「chảy ngược」 trở lại 「chảy xuôi」, và khớp template, NCC, logic đường may phía sau không cần sửa dòng nào. Zero code ghép mới.

> ⚠️ Bẫy: tại sao là 「đảo ngược thứ tự frame」 chứ không phải 「thêm cờ `isReversed` trong engine」? Vì cách sau biến mỗi hệ tọa độ thành hai bản logic — 「xuôi / ngược」 — gấp đôi diện tích bug. Đẩy phép biến đổi lên trước khi nạp dữ liệu, engine luôn chỉ đối mặt một thế giới duy nhất.

## Phát hiện hướng: mã mới duy nhất — và gần như miễn phí

Vì ta đảo ngược, điều kiện tiên quyết là nhận ra người dùng đã cuộn lên. Nếu bước này nặng, mọi tiết kiệm bên trên đều phí. Cách của ScrollShot rất nhẹ, và đủ khéo để gần như 「miễn phí」 — tái dùng engine khớp template hiện có, chỉ đổi tham số và chạy hai lần.

`ScrollDirectionDetector` lấy mẫu đều đặn khoảng 7 cặp frame kề từ giữa bản ghi (tránh đếm ngược lúc bắt đầu và nút dừng ở cuối), và với mỗi cặp, chạy cùng matcher hai lần:

```swift
let down = directionalScore(previous: prev, current: cur)  // prev→cur có nghĩa là 「cuộn xuống」?
let up   = directionalScore(previous: cur, current: prev)  // cur→prev có nghĩa là 「cuộn xuống」?
```

Mấu chốt là dòng `guard outcome.offset > 0` bên trong `directionalScore`. Phép khớp ngược của engine này chỉ trả về offset dương khi 「template từ đỉnh frame mới rơi thấp hơn trong frame cũ」. Vậy nên:

- Nếu cuộn thực sự đi xuống, lời gọi thuận `down` trúng (offset > 0, hợp lệ), còn lời gọi ngược `up` không tìm được nội dung cũ thấp hơn ở đỉnh frame mới, nên offset ≤ 0, bị đánh dấu không hợp lệ, điểm 0;
- Nếu cuộn thực sự đi lên, tình huống ngược lại: `down` không hợp lệ, `up` hợp lệ.

Tiêu chí hướng thực ra là 「**lời gọi nào hợp lệ**」, chứ không phải hai điểm đối xứng. Ở bản nháp đầu tiên tôi đã viết bừa 「hoàn toàn đối xứng」, cho đến khi một đồng nghiệp chỉ tay hỏi 「hợp lệ và không hợp lệ sao mà đối xứng được」 — đó là hiểu lầm tôi muốn sửa nhất trong bài này.

Sau khi có điểm `down` / `up` của mỗi cặp, cách tính điểm từng cặp như sau:

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // vùng chồng càng mờ, điểm càng bị trừ
điểm hợp lệ phải ≥ 0.26
```

Rồi bỏ phiếu: trong một cặp, nếu `up ≥ down × 1.25` (hoặc hơn 0,08 tuyệt đối), bỏ một phiếu đi lên; ngược lại bỏ phiếu đi xuống. Quyết định cuối:

- `upwardVotes ≥ downwardVotes + 2`, và
- `upwardScore ≥ downwardScore × 1.25`

chỉ khi đó mới được coi là cuộn đi lên. Toàn bộ chạy trên ảnh thu nhỏ giới hạn 320 px trong luồng nền, hầu như không ảnh hưởng đến tổng thời gian.

## Khi nghi ngờ, trả lại cho người dùng

Phát hiện không 100 % tin cậy. Một bản ghi gần như tĩnh chỉ lệch hai ba pixel có tín hiệu hướng rất yếu; đảo ngược bừa còn tệ hơn không đảo. Nên có một rào: `shouldAskForReverseConfirmation` chỉ kích hoạt khi độ tự tin ≥ 0,72 và mẫu hợp lệ ≥ 3 cặp, hiện một xác nhận nhẹ: 「Chúng tôi phát hiện bạn ghi hình cuộn lên — có đảo ngược ghép không?」 Nếu người dùng bấm đảo ngược thì `reverseFrames: true`; nếu không chắc thì ghép theo thứ tự gốc. Engine không bao giờ âm thầm ra ảnh sai vì đoán sai hướng.

## Hai chế độ đặt cạnh nhau

| | Trên xuống | Dưới lên |
|---|---|---|
| Cử chỉ ghi hình | ngón tay trượt xuống | ngón tay trượt lên |
| Thứ tự lấy mẫu frame | trục thời gian tự nhiên | trục thời gian tự nhiên (nội dung chảy ngược) |
| Phát hiện hướng | không cần | lấy mẫu 7 cặp giữa, matcher chạy hai lần |
| Engine ghép | nguyên bản | nguyên bản (tái dùng sau khi đảo thứ tự frame) |
| Code mới | — | chỉ phát hiện hướng + đảo một dòng |
| Dự phòng | — | hỏi xác nhận khi độ tự tin thấp |

## Kết lại

Nhìn lại, ghép từ dưới lên hầu như không có 「code riêng」 trong ScrollShot — nó hoàn toàn ký sinh trên engine đi xuống. Ý tưởng 「chuẩn hóa thứ tự trước, rồi tái dùng cùng một engine」 sau này trở thành khuôn mẫu khởi đầu mặc định khi thêm chế độ ghép mới: lần tới làm ghép ngang hay zíc-zắc, rất có thể ta vẫn sẽ tìm cách vặn vấn đề về lại 「một chiều đi xuống」 thay vì bắt đầu lại từ đầu.

---

## Câu hỏi thường gặp: chụp ảnh cuộn trong app iPhone

**ScrollShot có thể chụp ảnh cuộn trong các app iPhone như Messages và WhatsApp không?**
Có. Dù bạn muốn ảnh chụp màn hình dài iPhone của một trang web hay ảnh chụp màn hình cuộn iPhone của luồng Messages và WhatsApp, ScrollShot ghi lại màn hình và tự động ghép các frame. Vì nó chụp bằng cách ghi màn hình thay vì dựa vào nút 「trang đầy đủ」 của hệ thống, nó hoạt động trong mọi app — chính trường hợp ảnh chụp toàn trang trong app iPhone mà mọi người cứ hỏi.

**Nếu tôi cuộn ngược lên khi đang ghi hình một cuộc trò chuyện thì sao?**
Đó chính là trọng tâm bài viết này. Ảnh chụp màn hình cuộn iPhone Messages mà người dùng yêu thích, hay ảnh chụp iPhone WhatsApp mà fan chụp bằng cách cuộn ngược, đều có nghĩa nội dung chảy ngược. ScrollShot phát hiện hướng cuộn đi lên, đảo ngược thứ tự frame và tái dùng cùng engine ghép đi xuống — nên bạn vẫn có một ảnh chụp màn hình cuộn iPhone đúng, mà chúng tôi không phải viết lại gì cả.

**Nó khác gì với ảnh chụp màn hình tích hợp của iOS?**
Ảnh chụp tích hợp không phải lúc nào cũng chụp được toàn trang trong app. ScrollShot được làm cho trường hợp ảnh chụp màn hình dài và cuộn iPhone: ghi một lần, cuộn lên hay xuống tùy thích, và có một ảnh dài liền mạch.

---

## Đọc thêm

- <a href="/vi/blog/ios-stitching-engine-v2/">Ghép hai ảnh chụp màn hình khó đến mức nào? Một engine stitching iOS khiến tôi phải làm lại từ đầu — hết lần này đến lần khác</a> — chọn 30 keyframe từ 1.800 frame, khớp template ngược, tìm kiếm NCC kim tự tháp đến chiến lược dự phòng ba tầng — bóc tách toàn bộ engine ghép của ScrollShot.
- <a href="/vi/blog/vi-sao-chon-scrollshot-anh-chup-man-hinh-dai-ios/">Vì sao nên chọn ScrollShot? Giải pháp tối ưu cho ảnh chụp màn hình dài liền mạch trên iOS</a> — góc nhìn sản phẩm về cách ScrollShot giải quyết điểm đau của ảnh chụp màn hình dài iOS, gồm ghép tự động bằng ghi màn hình, ghép thủ công, bảo vệ quyền riêng tư và xuất HD.
