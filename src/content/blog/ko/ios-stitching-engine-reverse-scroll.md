---
title: "사용자가 굳이 역방향으로 스크롤하며 캡처하려 해서 — 나는 한 줄로 엔진 전체 재작성을 피했다"
description: "사용자가 iPhone에서 위로 스크롤하며 긴 스크린샷을 찍고 싶어 할 때, 나의 첫 본능은 별도의 '위로 향하는 엔진'을 만드는 것이었다. 결국 코드 한 줄이면 충분했다. 이 글은 ScrollShot의 역방향 스크롤 스티칭 설계를 분해하고, Messages·WhatsApp 같은 앱에서 매끄러운 iPhone scrolling screenshot을 만드는 기술을 보여준다. 스크롤 방향을 감지하고 프레임 순서를 뒤집어 기존 아래로 향하는 파이프라인을 재사용하는 방법, 방향 감지가 거의 공짜인 이유, 프레임 순서를 뒤집는 이유(isReversed 플래그 대신), 그리고 신뢰도가 낮을 때 결정을 사용자에게 넘기는 방식을 다룬다."
date: "2026-07-12"
category: "기술 심층 분석"
author: "ScrollShot 팀"
tags: ["iPhone 긴 스크린샷", "iPhone 스크롤 스크린샷", "iOS 긴 스크린샷", "스크린샷 합성 알고리즘", "역방향 스크롤", "스크롤 방향 감지", "ScrollShot 엔진", "화면 녹화 합성"]
readingTime: "6분 읽기"
cover: "/ios_stitching_engine_reverse_scroll_framework_ko.webp"
coverAlt: "ScrollShot 역방향 템플릿 매칭 다이어그램: 새로운 프레임 상단에서 템플릿을 가져와 이전 프레임 하단에서 offset을 검색하는 iPhone scrolling screenshot용"
translationKey: "ios-stitching-engine-reverse-scroll"
---

# 사용자가 굳이 역방향으로 스크롤하며 캡처하려 해서 — 나는 한 줄로 엔진 전체 재작성을 피했다

iPhone 긴 스크린샷, 또는 앱 안에서 찍는 iPhone 스크롤 스크린샷을 원하는 대부분의 사람은 사용자가 위에서 아래로 스크롤한다고 가정한다. ScrollShot의 스티칭 엔진도 원래는 그 방식으로 설계됐다 — 전체 이야기는 <a href="/ko/blog/ios-stitching-engine-v2/">"스크린샷 두 장을 잇는 게 얼마나 어렵나? 몇 번이고 뒤집어 다시 만든 iOS 긴 스크린샷 합성 엔진"</a>에 정리해 뒀다. 녹화 → 등간격 프레임 샘플링 → 프레임별 템플릿 매칭으로 offset 계산 → 최적 솔기선 탐색 → 자르고 이어붙이기. 이 파이프라인은 위→아래 경우에 이미 충분히 견고하다.

하지만 현실은 늘 반론을 던진다. 사용자는 채팅 — Messages, WhatsApp, 아니면 WeChat — 의 iPhone 스크롤 스크린샷을 찍고 싶어 하거나, 위로 스크롤해서 본 웹페이지 부분을 저장하고 싶어 한다. 바로 사람들이 계속 묻는 iphone screenshot full page in app 시나리오다. 그리고 녹화할 때 손가락은 위로 쓸린다. 내용은 녹화 내내 거꾸로 흐른다. 페이지 맨 아래에서 시작해 '끝'은 사실 더 앞의 내용이다. 이걸 그대로 위→아래 엔진에 넣으면 이미지는 거꾸로 나온다. 시각적 맨 위가 녹화 끝부분의 옛 내용이고, 맨 아래가 시작 부분이다.

이 글은 ScrollShot이 아래→위 스티칭을 어떻게 지원하는지에 관한 것이다. 요점은 깊은 알고리즘이 아니라, 코드를 얼마나 적게 쓰느냐 하는 극단적인 설계 트레이드오프다.

먼저 표준 위→아래 스티칭 데모를 보자. 우리가 다룰 역방향 스티칭은 이 위에 그대로 얹어진다:

<div class="blog-demo">
	<video src="/ScrollShot_Preview_En_0509.mp4" poster="/ScrollShot_Preview_En_0509_cover.jpg" controls playsinline preload="metadata"></video>
	<p>위→아래 스크롤 스티칭 데모: 한 번 녹화하고 한 번 스크롤하면, ScrollShot이 자동으로 프레임을 샘플링하고 겹침을 매칭해 완성된 iPhone 긴 스크린샷을 이어붙인다.</p>
</div>

---

## 첫 본능: 별도의 "위로 향하는 엔진"을 만들까?

이 요구사항을 처음 마주했을 때, 내 본능은 이랬다. 어차피 아래로 향하는 스티칭 엔진이 이미 있는데, 위로 향하는 것도 하나 더 쓰면 되지 않을까?

나는 재빨리 그 생각을 거뒀다. 아래로 향하는 엔진의 핵심은 역방향 템플릿 매칭이다. 새로운 프레임(img2)의 상단에서 템플릿을 가져와 이전 프레임(img1)의 하단을 검색해 offset을 구한다. 이걸 위로 향하게 뒤집으면 좌표계 거의 전부를 반전시켜야 한다 — 템플릿이 어디서 오는지, 검색이 어느 방향으로 가는지, offset의 양수/음수가 무엇을 뜻하는지, 겹치는 솔기 영역을 어떻게 구하는지까지. 3,000줄짜리 엔진이라면 평행한 쌍둥이를 하나 더 키우는 셈이고, 각자 버그와 유지보수를 갖게 된다. 더 나쁜 건, 아래 엔진에 수정을 하면 위 엔진에도 똑같이 반영해야 한다는 점이다. 그렇지 않으면 둘이 소리 없이 갈라진다.

## 돌파구: 뒤집고 나서 재사용하라

내가 멈춰 세운 건 평범한 관찰이었다. 스티칭 엔진은 내용이 어떻게 "흐르는지"는 신경 쓰지 않는다. 인접한 두 프레임 중 어느 게 위고 어느 게 아래인지만 따진다. 프레임 순서가 내용의 진짜 타임라인을 따르기만 하면, 같은 알고리즘이 매끄럽게 동작한다. 아래→위 영상은 그저 "순서가 뒤섞인" 것뿐이다.

그래서 ScrollShot의 방식은 이렇다. 먼저 스크롤 방향을 감지한다. 위로 향하면 프레임 전체 순서를 뒤집고, 기존 아래로 향하는 파이프라인에 넣는다.

```
Recording frame sampling (upward scroll, content flows backward):
  [F1 page bottom] → [F2] → [F3] → … → [Fn page top]
                                 │
             ScrollDirectionDetector decides: upward
                                 │
              reversedForStitching() reverses frame order
                                 ▼
  [Fn page top] → … → [F3] → [F2] → [F1 page bottom]
                                 │
              into the same downward stitching engine (zero changes)
                                 ▼
                   correct long image (top → bottom)
```

아래 다이어그램은 "뒤집기 + 재사용" 전체 흐름을 그린다. 프레임 샘플링, 방향 감지, 프레임 순서 뒤집기, 아래로 향하는 엔진 재사용, 그리고 올바른 긴 이미지까지.

![아래→위 스크롤 스티칭 알고리즘 다이어그램](/ios_stitching_engine_reverse_scroll_framework_ko.webp)

핵심 코드는 딱 한 줄이다:

```swift
let normalizedBatch = reverseFrames ? batch.reversedForStitching() : batch
```

`reversedForStitching()`는 추출한 프레임 참조를 뒤집고 번호를 다시 매긴다. 나머지는 그대로다. 뒤집고 나면 "거꾸로 흐르던" 내용이 다시 "앞으로 흐르는" 내용이 되고, 하류의 템플릿 매칭·NCC·솔기 로직은 한 줄도 바꿀 필요가 없다. 새로 추가된 스티칭 코드는 0줄.

> ⚠️ 함정: 왜 "프레임 순서를 뒤집는" 것이지, "엔진 안에 `isReversed` 플래그를 추가하는" 것이 아닐까? 후자는 모든 좌표계를 "순방향 / 역방향" 두 벌의 로직으로 만들어 버려 버그 표면적을 두 배로 키우기 때문이다. 변환을 데이터가 들어가기 전에 옮겨둠으로써, 엔진은 언제나 단 하나의 세계만 마주한다.

## 방향 감지: 유일하게 새로 생긴 코드 — 그리고 거의 공짜다

뒤집기를 하므로, 전제 조건은 사용자가 위로 스크롤했음을 알아채는 것이다. 이 단계가 무겁다면 위에서 절약한 게 다 사라진다. ScrollShot의 방식은 가볍고, 거의 "공짜"라 불릴 만큼 영리하다. 기존 템플릿 매칭 엔진을 재사용하되, 매개변수만 바꿔 두 번 돌린다.

`ScrollDirectionDetector`는 녹화 중간에서 인접 프레임 약 7쌍을 균일하게 샘플링한다(시작의 녹화 카운트다운과 끝의 정지 버튼은 피한다). 그리고 각 쌍마다 같은 매처를 두 번 돌린다.

```swift
let down = directionalScore(previous: prev, current: cur)  // does prev→cur mean "scroll down"?
let up   = directionalScore(previous: cur, current: prev)  // does cur→prev mean "scroll down"?
```

핵심은 `directionalScore` 안의 `guard outcome.offset > 0` 줄이다. 이 엔진의 역방향 매칭은 "새 프레임 상단의 템플릿이 이전 프레임의 더 아래에 닿을 때"만 양수 offset을 돌려준다. 따라서:

- 실제 스크롤이 아래로 향하면, 순방향 호출 `down`이 적중(offset > 0, 유효)한다. 반면 역방향 호출 `up`은 새 프레임 상단의 더 아래에서 옛 내용을 찾지 못해 offset ≤ 0, 무효 처리, 점수 0.
- 실제 스크롤이 위로 향하면 그 반대다. `down`은 무효, `up`은 유효.

방향의 판별 기준은 사실 "두 점수가 대칭인가"가 아니라 "**어느 호출이 유효한가**"다. 초안에는 덜컥 "완벽하게 대칭"이라고 썼다가, 동료가 가리키며 "유효와 무효가 어떻게 대칭이야?"라고 물었다. 이 글에서 가장 바로잡고 싶은 오해가 바로 그거다.

각 쌍의 `down` / `up` 점수를 구한 뒤, 쌍 내부의 채점 자체는 이렇게 돌아간다:

```
score = probability×0.55 + nccBoost×0.20 + overlapRatio×0.15 + consensusBoost×0.10
score ×= sadPenalty          // the blurrier the overlap, the more the score is discounted
valid score must be ≥ 0.26
```

그 다음 투표. 한 쌍 안에서 `up ≥ down × 1.25`(또는 절댓값으로 0.08 초과)이면 위로 한 표, 아니면 아래로 한 표. 최종 판단:

- `upwardVotes ≥ downwardVotes + 2` 이고,
- `upwardScore ≥ downwardScore × 1.25`

일 때만 위로 향하는 스크롤로 본다. 이 모든 건 320px로 제한한 저해상도 썸네일 위에서 백그라운드 스레드로 돌아가, 전체 시간에 거의 영향을 주지 않는다.

## 의심스러우면 사용자에게 넘겨라

감지는 100% 신뢰할 수 없다. 2~3픽셀만 움직인 거의 정지 상태의 녹화는 방향 신호가 아주 약하다. 무작정 뒤집는 건 뒤집지 않는 것보다 못하다. 그래서 게이트(gate)가 있다. `shouldAskForReverseConfirmation`은 신뢰도 ≥ 0.72이고 유효 샘플 ≥ 3쌍일 때만 발동해 가벼운 확인을 띄운다. "위로 스크롤하며 녹화한 것을 감지했어요 — 스티칭을 뒤집을까요?" 사용자가 뒤집기를 누르면 `reverseFrames: true`, 확신이 없으면 원래 순서대로 합성한다. 엔진은 방향을 틀리게 추측해 조용히 잘못된 이미지를 내놓는 일이 없다.

## 두 모드 나란히 비교

| | 위→아래 | 아래→위 |
|---|---|---|
| 녹화 제스처 | 손가락을 아래로 쓸림 | 손가락을 위로 쓸림 |
| 프레임 샘플링 순서 | 자연 타임라인 | 자연 타임라인 (내용은 거꾸로 흐름) |
| 방향 감지 | 불필요 | 녹화 중간 7쌍 샘플링, 매처 두 번 실행 |
| 스티칭 엔진 | 기존 | 기존 (프레임 순서 뒤집은 후 재사용) |
| 새로 추가된 코드 | — | 방향 감지 + 한 줄 뒤집기만 |
| 폴백 | — | 신뢰도 낮을 때 확인 요청 |

## 마무리하며

돌이켜 보면, 아래→위 스티칭은 ScrollShot 안에 "자기만의 코드"가 거의 없다. 완전히 아래로 향하는 엔진에 기생한다. "먼저 순서를 정규화한 다음 같은 엔진을 재사용한다"는 아이디어는 이후 새 스티칭 모드를 추가할 때 우리의 기본 출발 패턴이 됐다. 다음에 가로 또는 지그재그 스티칭을 할 때도, 처음부터 다시 짜기보다 문제를 "1차원 아래로 향하기"로 비틀어 돌리는 걸 먼저 찾을 가능성이 크다.

---

## FAQ: iPhone 앱에서 스크롤 스크린샷 찍기

**ScrollShot으로 iPhone 앱(Messages·WhatsApp 등)에서 스크롤 스크린샷을 찍을 수 있나요?**
네. 웹페이지의 iPhone 긴 스크린샷이든 Messages·WhatsApp 대화의 iPhone 스크롤 스크린샷이든, ScrollShot은 화면을 녹화하고 프레임을 자동으로 합성합니다. 시스템 "전체 페이지" 버튼에 의존하지 않고 화면 녹화로 캡처하기 때문에 어떤 앱 안에서도 동작합니다. 사람들이 계속 묻는 바로 그 iphone screenshot full page in app 시나리오죠. 즉, iPhone 앱 안에서 take scrolling screenshot in iPhone 하듯 자연스럽게 긴 이미지를 얻을 수 있습니다.

**녹화 중에 채팅을 위로 스크롤하면 어떻게 되나요?**
그게 바로 이 글의 핵심입니다. 사용자가 좋아하는 iPhone scrolling screenshot Messages 화면이든, 위로 스크롤해 캡처하는 Scrolling screenshot iPhone WhatsApp 화면이든, 둘 다 내용이 거꾸로 흐른다는 뜻입니다. ScrollShot은 위로 향하는 스크롤 방향을 감지하고 프레임 순서를 뒤집은 뒤, 똑같은 아래로 향하는 스티칭 엔진을 재사용합니다. 그래서 우리는 아무것도 다시 짜지 않고도 올바른 iPhone 스크롤 스크린샷을 얻습니다.

**내장 iOS 스크린샷과 무슨 차이인가요?**
내장 스크린샷은 앱 안에서 전체 페이지를 항상 캡처하지는 못합니다. ScrollShot은 iPhone 긴 스크린샷과 스크롤 스크린샷 시나리오를 위해 만들어졌습니다. 한 번 녹화하고 마음대로(위든 아래든) 스크롤하면, 하나의 매끄러운 긴 이미지가 완성됩니다.

---

## 더 읽을거리

- <a href="/ko/blog/ios-stitching-engine-v2/">스크린샷 두 장을 잇는 게 얼마나 어렵나? 몇 번이고 뒤집어 다시 만든 iOS 긴 스크린샷 합성 엔진</a> — 1,800프레임에서 30개 핵심프레임을 뽑아내고, 역방향 템플릿 매칭, 피라미드 NCC 검색, 3단계 폴백 전략까지 — ScrollShot 스티칭 엔진 완전 분해.
- <a href="/ko/blog/wae-scrollshot-ios-gin-screenshot/">왜 ScrollShot인가? iOS 긴 스크린샷을 매끄럽게 저장하는 최고의 솔루션</a> — ScrollShot이 iOS 긴 스크린샷의 불편함을 어떻게 해결하는지 제품 관점에서 소개. 화면 녹화 자동 합성, 수동 이어붙이기, 개인정보 보호, 고화질 내보내기까지.
