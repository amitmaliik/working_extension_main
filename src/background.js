console.log('Background.js');
chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.warn('request received [method:%s]', request.method);
    sendResponse({ success: true, message: 'Received' });
    return true;
  }
);
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  sendResponse({ success: true, message: 'received' });
});
