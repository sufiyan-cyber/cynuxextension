// This script runs on the web pages you visit.
// Its job is to find all the links on the page and send them
// to the background script for analysis.

// Use a Set to automatically handle duplicate links.
const linkSet = new Set();
const anchors = document.querySelectorAll('a');

for (const anchor of anchors) {
  // Ensure the href exists and is a web link (http or https).
  if (anchor.href && anchor.href.startsWith('http')) {
    linkSet.add(anchor.href);
  }
}

const uniqueLinks = Array.from(linkSet);

// Only send a message if links were found.
if (uniqueLinks.length > 0) {
  try {
    chrome.runtime.sendMessage({ type: "SCAN_LINKS", links: uniqueLinks });
  } catch (error) {
    // This can happen if the extension popup is not open or the background script is inactive.
    // It can be ignored during initial development.
    console.log("Could not send message to background script:", error.message);
  }
}
