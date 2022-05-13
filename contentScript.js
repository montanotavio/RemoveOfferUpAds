function searchAndRemove() {
    let content = document.getElementById('listing-title').parentNode;
    content.querySelectorAll('a').forEach(post => {
        if (post.ariaLabel == "opens in a new window") {
            post.style.display = 'none'
        }
    })
}

function removeNewPosts() {
    // Select the node that will be observed for mutations
    let content = document.getElementById('listing-title').parentNode;
    let listings = content.getElementsByTagName('a')[0].parentNode;
    
    let numMutations = 0;
    // Callback function to execute when mutations are observed
    let callback = function(mutationsList) {
        for(var mutation of mutationsList) {
            if (mutation.type == 'childList') {
                numMutations++;
            }
            // remove new loaded ads (listings load in groups of 50)
            if (!(numMutations%50)) {
                searchAndRemove();
                numMutations = 0;
            }
        }
    };
    
    // Create an observer instance linked to the callback function
    let observer = new MutationObserver(callback);
    
    // Start observing the target node for configured mutations
    observer.observe(listings, { childList: true });
}

function main() {
    searchAndRemove();
    removeNewPosts();
}

window.addEventListener("load",main);

// reload page to restart script
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.text == "reset") {
        console.log('test sent');
        location.reload();
      }
      // avoid message port closed error
      sendResponse();
      return true;
  });
  