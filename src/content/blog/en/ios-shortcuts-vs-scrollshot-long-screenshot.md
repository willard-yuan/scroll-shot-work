---
title: "WhatsApp Long Screenshots on iPhone: Shortcuts vs. ScrollShot"
seoTitle: "iPhone Scrolling Screenshots: Shortcuts vs. ScrollShot"
description: "Save a WhatsApp chat as one long screenshot on iPhone. Learn the free Apple Shortcuts method and when ScrollShot's screen-recording workflow makes more sense."
date: "2026-11-28"
updated: "2026-11-28"
category: "Comparisons"
author: "ScrollShot Team"
tags: ["iPhone scrolling screenshot", "WhatsApp long screenshot", "Apple Shortcuts", "combine screenshots", "ScrollShot"]
readingTime: "9 min read"
cover: "/ScrollShot-Long-ScreenShot-WhatsApp-demo-en.webp"
coverAlt: "Illustration of a WhatsApp conversation on an iPhone beside a single long screenshot of the chat"
translationKey: "shortcuts-vs-scrollshot"
faq:
  - question: "Can I combine screenshots on iPhone for free?"
    answer: "Yes. Create an Apple Shortcuts workflow with Select Photos, Combine Images set to Vertically, and Save to Photo Album. Capture and crop your screenshots first, then run the shortcut to combine them."
  - question: "Does Apple Shortcuts automatically remove overlapping messages?"
    answer: "The Combine Images action does not. It stacks the selected images without identifying duplicate chat bubbles. Crop overlapping areas before combining them, or use a screenshot stitching tool with overlap detection."
  - question: "Can ScrollShot turn a screen recording into a long screenshot?"
    answer: "Yes. ScrollShot Pro can select and align frames from a scrolling screen recording. You scroll through the content yourself, then import the recording and review the stitched image before saving."
  - question: "Is ScrollShot free to use?"
    answer: "Manual stitching, previewing, and saving are free. Automatic stitching from screen recordings requires Pro; check the App Store for current purchase options."
  - question: "Does ScrollShot upload my screenshots?"
    answer: "Stitching runs on your iPhone, without uploading your screenshots to a server for processing. Photo access is used to read your selected images or recordings and save the result."
---

You want to send a friend the weekend plans from a WhatsApp group chat. The meeting time is in one screenshot, the address is in the next, and the photo of the entrance is two screens farther down. Now you're sending a stack of images and hoping they get read in order.

Apple's Shortcuts app can combine those screenshots into one tall image for free. ScrollShot Pro can build a long screenshot from a screen recording instead: you scroll through the conversation, then let the app line up the captured content. Both can get you to a single image, but they leave you with different amounts of cleanup.

We're the developers of ScrollShot. For two or three screenshots, though, we'd start with Shortcuts if you already have it set up. Here's how that works, and where a dedicated stitching app starts to save you some effort.

## Combine WhatsApp screenshots with Apple Shortcuts

Shortcuts is a good fit for images that are already complete, such as event flyers or recipe cards. Put one below the other and you're done. Chat screenshots usually need a little cropping first because consecutive captures tend to include some of the same messages.

### Capture the messages you want to save

Open WhatsApp and find the first message you need. On an iPhone with Face ID, press and quickly release the side button and volume-up button together to take a screenshot. Apple lists the button combinations for other models in its [iPhone screenshot guide](https://support.apple.com/en-us/102616).

Scroll down partway and take the next screenshot. Keep a few messages visible in both captures so you can check that nothing was skipped. Continue until you've captured the section you need.

Before combining the images, crop out the repeated messages in Photos. Keep each message once, in full. You may also want to remove the repeated chat header and message field from the middle screenshots.

For example, suppose “See you at 10” appears at the bottom of the first screenshot and near the top of the second. Keep the complete bubble in the first image, then crop the second to begin with the next message. Cutting in the gap between bubbles is easier than trying to line up two halves of a sentence.

Keep the originals until you've checked the finished image. If you trim away a line by mistake, you'll want to go back to the source screenshot rather than hunt through the conversation again.

### Build the three-action shortcut

Open **Shortcuts**, tap **+**, and name your shortcut something recognizable, such as “Combine Screenshots.” Add these actions in order:

1. **Select Photos:** Turn on **Select Multiple** so you can choose more than one screenshot.
2. **Combine Images:** Choose **Vertically** and set the spacing to **0** if you want the images to touch.
3. **Save to Photo Album:** Choose the album where you'd like the finished image saved.

![Illustrated Apple Shortcuts workflow: Select Photos with Select Multiple enabled, Combine Images vertically with zero spacing, then Save to Photo Album](/create-a-scrolling-screenshot-via-shortcuts-en.webp)

*Select the screenshots, stack them vertically, and save the result. This illustration shows the basic setup; the controls may look slightly different on your version of iOS.*

Run the shortcut and select your cropped screenshots from the beginning of the conversation to the end. Check the saved image before sending it. If the conversation starts in the middle, check the selection order and any sorting actions in your shortcut, then run it again. Apple's [custom shortcut guide](https://support.apple.com/guide/shortcuts/create-a-custom-shortcut-apd84c576f8c/ios) covers adding actions and testing the setup.

It's worth adding **Quick Look** just before **Save to Photo Album** so you can inspect the image before saving. Try the shortcut with two screenshots first. You'll spot a horizontal layout or an unwanted gap immediately, without working through a whole conversation. Once it looks right, reuse the shortcut whenever you need it.

## Where the free shortcut gets tedious

The catch is that **Combine Images** doesn't know what a chat message is. It places one image below another, even when the last three messages in the first image also appear at the top of the second.

For two or three captures, trimming those duplicates is manageable. For twenty, you're checking every boundary: did you keep the whole reply, cut off its timestamp, or accidentally include the same photo twice?

Cropping at a fixed height only gets you so far. One screenshot may end halfway through a short reply; another may end halfway through a photo. The right place to cut changes as you move through the conversation.

You can add cropping and other steps to Shortcuts, especially if you always capture the same kind of page. The three-action shortcut above, however, won't find overlaps for you. With a long chat, most of the work happens before you tap Run.

There are also times when a straight stack is exactly what you want. Separate receipts or screenshots from different apps don't need to look like one continuous page. A little spacing can even help distinguish them. Use zero spacing for the chat example, but don't feel obliged to make every collection of screenshots seamless.

## Turn a scrolling screen recording into a long screenshot

With ScrollShot, you record yourself scrolling through the conversation. The app picks frames from that video, finds the content they have in common, and joins them at those points. **This screen-recording feature requires ScrollShot Pro.**

The matching step is what makes this different from stacking images. A message visible in two neighboring frames gives the app a reference for lining them up. The overlap helps it figure out where the conversation continues, so that section can appear once in the finished image. Our [stitching engine article](/blog/ios-stitching-engine-v2/) goes into the implementation if you're curious.

![Illustration showing a WhatsApp chat on an iPhone and the conversation arranged as one long image](/ScrollShot-Long-ScreenShot-WhatsApp-demo-en.webp)

*Illustration of a WhatsApp chat saved as one long image, with messages and shared photos in reading order.*

Here's the workflow using an ordinary iPhone screen recording:

1. **Get the conversation ready.** Find the first message you want to include and close the keyboard so it doesn't cover the chat.
2. **Start a screen recording.** Open Control Center, tap the screen recording control, and wait for the countdown before returning to the conversation. If you need to add the control, follow [Apple's screen recording instructions](https://support.apple.com/en-la/102653).
3. **Scroll steadily through the messages.** Keep moving in one direction, allowing photos and other content to load before continuing.
4. **Stop after the last message you need.** Open ScrollShot, choose **Select Video to Stitch** in Auto Stitch, and import the recording. Trim it to the relevant section before starting the stitch.
5. **Review and save.** Zoom in around the joins, adjust any boundaries that need attention, and save the image. You can also share the result as a PDF.

You still control where the capture starts and ends. ScrollShot doesn't scroll WhatsApp for you or retrieve messages you haven't shown on screen. You save time by capturing the whole section in one pass, without taking and cropping each screenshot separately.

If you've already taken the screenshots, there's no need to record the chat again. ScrollShot's [manual stitching, preview, and save features](/blog/why-choose-scrollshot-ios-seamless-long-screenshots/#manual-stitch-free-controlled-and-useful-for-existing-screenshots) are free. Select your existing captures in reading order and check the joins before saving.

For screenshots of the app's recording, import, and editing controls, see the [ScrollShot walkthrough in our iPhone Duo guide](/blog/how-to-take-a-long-screenshot-on-iphone-duo/#method-2-create-a-long-screenshot-with-scrollshot).

## If the stitched image looks wrong

Start by checking the recording. Slow down enough for the text to stay readable, and avoid flinging the chat several screens ahead at once. If a photo hasn't loaded yet, pause before moving past it. Stitching can't recover a message or picture that never appeared clearly in the video.

Keep the phone in the same orientation throughout. Rotating it changes the layout and can make text wrap differently, leaving neighboring frames harder to match.

If you're starting at the newest message and scrolling toward older ones, the frame order needs different handling. Our [reverse-scroll stitching article](/blog/ios-stitching-engine-reverse-scroll/) explains how ScrollShot detects that direction and puts the frames back in reading order.

Large blank areas, nearly identical messages, and moving images can also confuse the matching. A stretch of repeated “OK” replies offers fewer useful clues than a distinctive paragraph or photo. Auto stitching can get a join wrong, which is why the preview and manual adjustments matter.

If a message appears twice, zoom in on that join and adjust the boundary. If a message is missing, check whether it's present in the recording. When it was never captured clearly, record that section again; moving the seam won't bring it back. Check the first and last messages, too, since it's easy to stop recording a little early.

## Check the image before you send it

A very tall image can look fine as a thumbnail while hiding a bad join. Zoom in far enough to read the text, especially around addresses, times, or anything the recipient needs to act on. For a sprawling conversation, consider splitting it at a topic change. Two readable sections may be more useful than one enormous image.

When the result matters, open the copy you've shared and check that the small text is still readable. ScrollShot also offers PDF sharing, so you can use that if a document is easier for the recipient to keep or forward.

The stitching itself runs on your iPhone. ScrollShot doesn't upload your screenshots to a server to combine them; photo access lets it read your chosen images or recordings and save the result.

## When we'd use each method

| What you need | A good place to start |
| --- | --- |
| Join a few complete images with no overlapping content | Apple Shortcuts |
| Save a short chat and don't mind cropping screenshots | Apple Shortcuts |
| Combine screenshots you already have and adjust the joins | ScrollShot's free manual stitching |
| Regularly capture long conversations, articles, or AI chats | ScrollShot Pro's recording-based stitching |

If you're saving a short exchange once a month, a few minutes of cropping probably won't bother you. Keep using the shortcut if it's doing the job.

For longer chats you save regularly, the recording approach is worth a look. You'll still spend time scrolling and checking the result, but you can skip much of the individual screenshot cleanup. The [free and Pro feature comparison](/#pricing) lists what's included; check the App Store for current purchase options.

If the conversation or document is already open on your computer, our [Mac scrolling screenshot guide](/blog/how-to-take-long-scrolling-screenshot-on-mac/) covers browser capture and desktop app workflows.

## Frequently asked questions

### Can I combine screenshots on iPhone for free?

Yes. Create an Apple Shortcuts workflow with Select Photos, Combine Images set to Vertically, and Save to Photo Album. Capture and crop your screenshots first, then run the shortcut to combine them.

### Does Apple Shortcuts automatically remove overlapping messages?

The Combine Images action does not. It stacks the selected images without identifying duplicate chat bubbles. Crop overlapping areas before combining them, or use a screenshot stitching tool with overlap detection.

### Can ScrollShot turn a screen recording into a long screenshot?

Yes. ScrollShot Pro can select and align frames from a scrolling screen recording. You scroll through the content yourself, then import the recording and review the stitched image before saving.

### Is ScrollShot free to use?

Manual stitching, previewing, and saving are free. Automatic stitching from screen recordings requires Pro; check the App Store for current purchase options.

### Does ScrollShot upload my screenshots?

Stitching runs on your iPhone, without uploading your screenshots to a server for processing. Photo access is used to read your selected images or recordings and save the result.

You can [download ScrollShot for iPhone](https://apps.apple.com/app/id6760192003) and try the free manual tools with screenshots already in your library. That gives you a chance to check the preview and editing controls before deciding whether you also want the Pro recording feature.
