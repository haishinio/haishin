// TODO:
Current issue is to stop the rtmp-publish from closing the stream, which then unpublishes the stream and stops new data going to it.
If we can fix that I believe the video player should handle getting updates and the stream should display and keep getting updates.

OR

Need to fix it where it is not not stopping the stream but is only loading the first X seconds over and over again. At least the video player works (need to handle when leaving the page to stop the MediaErrors)