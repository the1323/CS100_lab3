// window.addEventListener("load", (event) => {
//   console.log("load page");

//   document
//     .getElementById("cell1")
//     .addEventListener("click", () => play("cell1"));
// });
const tweetContainer = document.getElementById("tweet-container");
const serverurl = "http://ec2-18-209-247-77.compute-1.amazonaws.com:3000";
const url = serverurl + "/feed/random?q=weather";

var tweetList = [];

function getTweets() {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      /*for (let i =0; Object.keys(data.statuses).length; i++) {
            console.log(data.statuses[i].text, data.statuses[i].id, data.statuses[i].created_at);
        }*/
      //   console.log(data);
      //console.log(data.statuses[0]);
      saveTweets(data);
    })
    .catch(function (err) {
      console.warn("Something when wrong!!!", err);
    });
}
function isDuplicate(tweetId) {
  for (let i = 0; i < tweetList.length; i++) {
    if (tweetList[i].id == tweetId) return true;
  }
  return false;
}
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
  console.log(tweetList.length);
  //   if (tweetList.length == 30) {
  //     for (let i = 0; i < 30; i++) {
  //       console.log(tweetList[i].id);
  //     }
  //   }
}

function renderHTML() {
  let text = document.createTextNode("textssssssssss");

  let textNode = document.createElement("p");
  textNode.className = "card-text";
  textNode.appendChild(text);
  let title = document.createTextNode("name date");
  let titleNode = document.createElement("h6");
  titleNode.className = "card-title";
  titleNode.appendChild(title);
  titleNode.style = "font-weight: bold";
  let card = document.createElement("div");
  card.className = "card";
  let body = document.createElement("div");
  body.className = "card-body";
  body.appendChild(titleNode);
  body.appendChild(textNode);
  let bodyNode = document.createElement("div");
  bodyNode.className = "col-md";
  bodyNode.appendChild(body);
  bodyNode.style = "padding-left: 15px";

  let img = document.createElement("img");
  img.src = "https://picsum.photos/200/300";
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
while (tweetContainer.firstChild) {
  tweetContainer.removeChild(tweetContainer.firstChild);
}
renderHTML();
renderHTML();
window.onload = function () {
  setInterval(getTweets, 5000);
};
