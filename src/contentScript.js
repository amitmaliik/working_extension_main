'use strict';

// const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
// console.log(
//   `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
// );
function getCookie(name) {
  var re = new RegExp(name + '=([^;]+)');
  var value = re.exec(document.cookie);
  return value != null ? unescape(value[1]) : null;
}
let jwt = document.cookie.session;
// console.log(jwt);
// console.log(localStorage);
// console.log(localStorage.getItem('token'));
// console.log(sessionStorage.getItem('token'))
// console.log(document.cookie);
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  (response) => {
    // console.log(response.message);
    console.log(response);
  }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(request);
  if (request.type === 'COUNT') {
    // console.log(`Current count is ${request.payload.count}`);
    console.log(response);
  }

  // Send an empty response
  sendResponse({ status: true, message: 'Current Count' });
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  // sendResponse({});
  return true;
});
