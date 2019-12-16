const users = ["ESL_CSGO", "OgamingSC2", "cretetion", "RocketLeague",  "ninja", "CapcomFighters", "DrDisrespect", "Fortnite", "GRONKH", "lirik", "thegameawards", "riotgames", "silvername"];
const clientID = "ecek1qkikyqi8smqzpazytcjgok63h";

// Loop through the channels
users.forEach((user, i) => {
    createCard(user, i);
    getUserImage(user, i);
    getViewerCount(user, i);
});

function getUserImage(user, i) {
    const dataUrl = `https://api.twitch.tv/helix/users?login=${user}`;

    fetch(dataUrl, {
        headers: new Headers({
            "Content-Type": "application/json; charset=UTF-8",
            "Client-ID": clientID
        })
    }).then(data => {
        return data.json();
    }).then(stream => {
        const imageElement = document.querySelector(`#user-${i} img`);
        const userImage = stream.data[0].profile_image_url;
        let imageUrl = userImage ? userImage : "404.jpg";
        imageElement.setAttribute("src", imageUrl);
    });
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
                    setStatus("online", i, dataObj);
                } else {
                    setStatus("offline", i, dataObj);
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

function setStatus(status, i, obj) {
    const card = document.getElementById(`user-${i}`);
    card.classList.add(status);

    const el = document.querySelector(`#user-${i} .status`);
    if (status === "online") {
        el.textContent = `${obj.viewer_count} viewers`;
    } else {
        el.innerHTML = "<em>Offline</em>";
    }
    el.classList.add(`status--${status}`);

    const icon = document.querySelector(`#user-${i} h3 .fa`);
    icon.classList.add(`status--${status}`, status === "online" ? "fa-circle" : "fa-circle-o");
}

function createCard(user, i) {
    const userUrl = `https://www.twitch.tv/${user}`;

    const card = document.createElement("div");
    card.setAttribute("id", `user-${i}`);
    card.classList.add("stream", "col-6", "col-sm-4", "col-md-3");

    const pic = document.createElement("img");
    pic.classList.add("img-fluid");
    card.appendChild(pic);

    const name = document.createElement("h3");
    name.classList.add("lead", "mt-3");
    card.appendChild(name);

    const link = document.createElement("a");
    link.setAttribute("class", "stream__link");
    link.setAttribute("href", userUrl);
    link.setAttribute("target", "_blank");
    link.textContent = user;
    name.appendChild(link);

    const streamsDiv = document.querySelector(".streams");
    streamsDiv.appendChild(card);

    const statusIcon = document.createElement("i");
    statusIcon.classList.add("status-icon", "fa");
    name.appendChild(statusIcon);

    const streamStatus = document.createElement("p");
    streamStatus.classList.add("status");
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