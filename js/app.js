const users = ["shroud", "OgamingSC2", "cretetion", "syndicate",  "ninja", "shlorox", "zryiedrokmijn", "amaz", "RobotCaleb", "elajjaz", "lirik", "tsm_dyrus", "riotgames", "silvername"];
const clientID = "ecek1qkikyqi8smqzpazytcjgok63h";

// Loop through the channels
users.forEach((user, i) => {
    createUserCard(user, i);
    getUserImage(user, i);
    getViewerCount(user, i);
});


function getUserImage(user, i) {
    const dataUrl = `https://api.twitch.tv/helix/users?login=${user}`;
    const userData = new XMLHttpRequest();

    userData.onreadystatechange = function() {
        if (userData.readyState === 4) {
            if (userData.status === 200) {
                const data = JSON.parse(userData.responseText);
                const dataObj = data.data[0]; // I don't like this variable name

                // Check if the user image exists
                if (Boolean(dataObj)) {
                    if (dataObj.profile_image_url) {
                        document.querySelector(`#user-${i} img`).setAttribute("src", dataObj.profile_image_url);
                    }
                } else { // Otherwise, return null
                    // Image needs to be super generic but not the 404 "image not found" one, needs to be USER not found
                }
            }
        }
    };

    userData.open("GET", dataUrl);
    userData.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    userData.setRequestHeader("Client-ID", clientID);
    userData.send();
}

function getViewerCount(user, i) {
    const dataUrl = `https://api.twitch.tv/helix/streams?user_login=${user}`;
    const streamData = new XMLHttpRequest();

    streamData.onreadystatechange = function() {
        if (streamData.readyState === 4) {
            if (streamData.status === 200) {
                const data = JSON.parse(streamData.responseText);
                const dataObj = data.data[0];

                if (dataObj) {
                    isOnline(i, dataObj);
                }
            }
        }
    };

    streamData.open("GET", dataUrl);
    streamData.setRequestHeader("Content-Type", "applicaion/json; charset=UTF-8");
    streamData.setRequestHeader("Client-ID", clientID);
    streamData.send();
}

filter();

function isOnline(i, obj) {
    const status = document.querySelector(`#user-${i} .status`);
    status.textContent = `${obj.viewer_count} viewers`;
    status.classList.add("status--online");

    const icon = document.querySelector(`#user-${i} h3 .fa`);
    icon.classList.add("fa-circle");
}

function createUserCard(user, i) {
    const userUrl = `https://www.twitch.tv/${user}`;

    const card = document.createElement("div");
    card.setAttribute("id", `user-${i}`);
    card.classList.add("channel-card", "col-6", "col-sm-4", "col-md-3");

    const pic = document.createElement("img");
    pic.classList.add("img-fluid");
    pic.setAttribute("src", "404.jpg");
    card.appendChild(pic);

    const name = document.createElement("h3");
    name.classList.add("lead", "mt-3");
    card.appendChild(name);

    const link = document.createElement("a");
    link.setAttribute("href", userUrl);
    link.setAttribute("target", "_blank");
    link.textContent = user;
    name.appendChild(link);

    const streamsDiv = document.querySelector(".streams");
    streamsDiv.appendChild(card);

    const statusIcon = document.createElement("i");
    statusIcon.classList.add("fa", "fa-circle-o");
    name.appendChild(statusIcon);

    const streamStatus = document.createElement("p");
    streamStatus.classList.add("status", "status--offline");
    streamStatus.innerHTML = "<em>Offline</em>"; 
    card.appendChild(streamStatus);
}

// Filter
function filter() {
    const showAll = document.getElementById("showAll");
    const showOnline = document.getElementById("showOnline");
    const showOffline = document.getElementById("showOffline");

    showAll.addEventListener("click", () => {
        showAll.setAttribute("disabled", "disabled");
        showOnline.removeAttribute("disabled");
        showOffline.removeAttribute("disabled");
        const all = document.querySelectorAll(".offline, .online");
        for (const streamer of all) {
            streamer.style.display = "block";
        }
    });

    showOnline.addEventListener("click", () => {
        showAll.removeAttribute("disabled");
        showOffline.removeAttribute("disabled");
        showOnline.setAttribute("disabled", "disabled");
        const online = document.querySelectorAll(".online");
        const offline = document.querySelectorAll(".offline");
        for (const onlineStreamer of online) {
            onlineStreamer.style.display = "block";
        }
        for (const offlineStreamer of offline) {
            offlineStreamer.style.display = "none";
        }
    });

    showOffline.addEventListener("click", () => {
        showAll.removeAttribute("disabled");
        showOnline.removeAttribute("disabled");
        showOffline.setAttribute("disabled", "disabled");
        const online = document.querySelectorAll(".online");
        const offline = document.querySelectorAll(".offline");
        for (const offlineStreamer of offline) {
            offlineStreamer.style.display = "block";
        }
        for (const onlineStreamer of online) {
            onlineStreamer.style.display = "none";
        }
    });
}