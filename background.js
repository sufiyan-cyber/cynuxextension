// In background.js

// 1. Import all three utils
importScripts('./utils/shodan.js', './utils/netcraft.js', './utils/virustotal.js');

// Listener to receive links from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCAN_LINKS") {
    // Call your analyzeLinks function when a message is received
    analyzeLinks(message.links);
    sendResponse({}); // Send an empty response
  }
  return true; // Keep message channel open for async operations
});


// Your analyzeLinks function
async function analyzeLinks(links) {
  const analysisPromises = links.map(async (link) => {
    try {
      const domain = new URL(link).hostname;

      // 2. Call all three APIs in parallel
      const [netcraftResult, shodanResult, virusTotalResult] = await Promise.all([
        checkNetcraft(domain),
        checkShodan(domain),
        checkVirusTotal(domain)
      ]);

      // 3. Combine all results
      return {
        link,
        domain,
        netcraft: netcraftResult,
        shodan: shodanResult,
        virustotal: virusTotalResult,
        isDangerous: netcraftResult.isDangerous || shodanResult.isDangerous || virusTotalResult.isMalicious
      };
    } catch (err) {
      return { link, error: "Invalid URL format." };
    }
  });

  const results = await Promise.all(analysisPromises);
  
  // Store the final combined results for the popup to use
  chrome.storage.local.set({ scanResults: results });
}