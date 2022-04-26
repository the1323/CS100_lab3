const tweetContainer = document.getElementById("tweet-container");
const serverurl = "http://ec2-18-209-247-77.compute-1.amazonaws.com:3000";
const url = serverurl + "/feed/random?q=weather";

var tweetList = [];
var pauseToggle = false;

/**
 * main main function, fetch tweets from server.
 */
function getTweets() {
  if (pauseToggle) return;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      /*for (let i =0; Object.keys(data.statuses).length; i++) {
            console.log(data.statuses[i].text, data.statuses[i].id, data.statuses[i].created_at);
        }*/
      //console.log(data);
      //console.log(data.statuses[0]);
      saveTweets(data);
      renderAll();
    })
    .catch(function (err) {
      console.warn("Something when wrong!!!", err);
    });
}
/**
 * Returns boolean value, check if tweet is duplicated
 * @param {number} tweetId
 * @returns {bool} bool
 */
function isDuplicate(tweetId) {
  for (let i = 0; i < tweetList.length; i++) {
    if (tweetList[i].id == tweetId) return true;
  }
  return false;
}

/**
 * parse raw tweet data from JSON, and save to array of objects.
 * @param {JSON} data
 * @returns {arr} tweetList
 */

function saveTweets(data) {
  for (let i = 0; i < Object.keys(data.statuses).length; i++) {
    if (isDuplicate(data.statuses[i].id)) continue;
    var tweet = {
      id: data.statuses[i].id,
      date: data.statuses[i].created_at,
      userName: data.statuses[i].user.screen_name,
      text: data.statuses[i].text,
      profileImgURL: data.statuses[i].user.profile_image_url,
    };
    tweetList.push(tweet);
  }
  //console.log(tweetList.length);
}

/**
 * Clear page and rerender all tweets to HTML
 */

function renderAll() {
  while (tweetContainer.firstChild) {
    tweetContainer.removeChild(tweetContainer.firstChild);
  }
  for (let i = 0; i < tweetList.length; i++) {
    for (let j = 0; j < tweetList.length - i - 1; j++) {
      if (tweetList[i].date > tweetList[j].date) {
        [tweetList[j], tweetList[i]] = [tweetList[i], tweetList[j]];
      }
    }
  }
  for (let i = 0; i < tweetList.length; i++) {
    renderHTML(tweetList[i]);
  }
}

/**
 * render single tweet to bootstrap card
 * @param {obj} tweet
 * @returns {HTML}HTML
 */

function renderHTML(tweet) {
  let text = document.createTextNode(tweet.text);

  let textNode = document.createElement("p");
  textNode.className = "card-text";
  textNode.appendChild(text);
  time = tweet.date.slice(11, 19);
  dateT = tweet.date.slice(0, 10);
let title = document.createTextNode(
    tweet.userName + " \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + dateT + "  " + time
  );

  let titleNode = document.createElement("h6");
  titleNode.className = "card-title";
  titleNode.appendChild(title);
  titleNode.style = "font-weight: bold";
  let card = document.createElement("div");
  card.className = "card";
  card.style = "max-width: 610px";
  let body = document.createElement("div");
  body.className = "card-body";
  body.appendChild(titleNode);
  body.appendChild(textNode);
  let bodyNode = document.createElement("div");
  bodyNode.className = "col-md";
  bodyNode.appendChild(body);
  bodyNode.style = "padding-left: 15px";

  let img = document.createElement("img");
  img.src = tweet.profileImgURL;
  img.className = "card-img";
  img.setAttribute("id", "message-img");
  let imgNode = document.createElement("div");
  imgNode.className = "col-md-2";
  imgNode.style = "padding-top: 15px";
  let rootNode = document.createElement("div");
  rootNode.className = "row no-gutters";
  imgNode.appendChild(img);
  rootNode.appendChild(imgNode);
  rootNode.appendChild(bodyNode);

  card.appendChild(rootNode);

  tweetContainer.appendChild(card);
}

/**
 * pause state, and change pause button text
 * @returns {HTML}HTML
 */

function pauseHandler() {
  pauseToggle = !pauseToggle;
  if (pauseToggle)
    document.getElementById("pause-button").innerHTML = "continue";
  else document.getElementById("pause-button").innerHTML = "pause";
}
/**
 * pause get query from HTML input, rerender filtered tweets.
 * @param {event} event
 * @returns {HTML}HTML
 */
const handleSearch = (event) => {
  searchString = event.target.value.trim().toLowerCase();
  console.log(searchString);
  while (tweetContainer.firstChild) {
    tweetContainer.removeChild(tweetContainer.firstChild);
  }
  for (let i = 0; i < tweetList.length; i++) {
    if (tweetList[i].text.includes(searchString)) {
      renderHTML(tweetList[i]);
    }
  }
};

getTweets();

window.onload = function () {
  setInterval(getTweets, 5000);
  document
    .getElementById("pause-button")
    .addEventListener("click", () => pauseHandler());

  document.getElementById("searchBar").addEventListener("input", handleSearch);
};
