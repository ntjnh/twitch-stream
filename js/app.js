const channels = ["shroud", "OgamingSC2", "cretetion", "syndicate",  "ninja", "shlorox", "zryiedrokmijn", "amaz", "RobotCaleb", "elajjaz", "lirik", "tsm_dyrus", "riotgames", "silvername"];

// Loop through the channels
channels.forEach(channel => {
    createCard(channel);

    // Get stream data from API
    const clientID = "ecek1qkikyqi8smqzpazytcjgok63h";
    const streamDataUrl = "https://api.twitch.tv/helix/streams?user_login=" + channel;

    const streamData = new XMLHttpRequest();
    streamData.onreadystatechange = function() {
        if (streamData.readyState === 4) {
            if (streamData.status === 200) {
                const data = JSON.parse(streamData.responseText);
                const streamData = data.data[0];

                // Get images and channel data
                const offlineStreamUrl = "https://api.twitch.tv/helix/users?login=" + channel;
                const offlineStreamData = new XMLHttpRequest();
                offlineStreamData.onreadystatechange = function() {
                    if(offlineStreamData.readyState === 4) {
                        if(offlineStreamData.status === 200) {
                            const user = JSON.parse(offlineStreamData.responseText);
                            const userData = user.data[0];

                            if (userData) {
                                if(userData.profile_image_url) {
                                    pic.setAttribute("src", userData.profile_image_url);
                                } else {
                                    // If no logo, use dummy image
                                    pic.setAttribute("src", "generic.jpg");
                                }
                            } else {
                                // If channel is not found
                                channelStatus.innerHTML = "<em>Channel not found.</em>";
                                card.appendChild(channelStatus);
                                pic.setAttribute("src", "generic.jpg");
                            }
                        } // End status if
                    } // End readyState if
                };
                offlineStreamData.open("GET", offlineStreamUrl);
                offlineStreamData.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                offlineStreamData.setRequestHeader("Client-ID", clientID);
                offlineStreamData.send();

                // If channel is offline
                if (streamData === undefined) {
                    channelStatus.innerHTML = "<em>Offline</em>";
                    card.appendChild(channelStatus);
                    card.classList.add("offline");
                // Else if channel is currently streaming
                } else if (streamData.type == "live") {
                    // const game = data.stream.game;
                    const viewers = streamData.viewer_count;

                    channelStatus.innerHTML = `${viewers} viewers`;
                    card.appendChild(channelStatus);
                    card.classList.add("online");
                    channelStatus.classList.remove("text-muted");
                    channelStatus.classList.add("status--offline");
                    statusIcon.classList.remove("fa-circle-o");
                    statusIcon.classList.add("fa-circle");
                }
            }
        }
    }; // End ajax callback

    streamData.open("GET", streamDataUrl);
    streamData.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    streamData.setRequestHeader("Client-ID", clientID);
    streamData.send();
}); // End channel loop

filter();

// Create card
function createCard(stream) {
    const card = document.createElement("div");
    const pic = document.createElement("img");
    const name = document.createElement("h3");
    const link = document.createElement("a");
    const statusIcon = document.createElement("i");
    const channelStatus = document.createElement("p");
    const channelsDiv = document.querySelector(".channels");

    card.classList.add("channel-card", "col-6", "col-sm-4", "col-md-3");
    pic.classList.add("img-fluid");
    name.classList.add("lead", "mt-3");
    statusIcon.classList.add("fa", "fa-circle-o");
    channelStatus.classList.add("status", "status--offline");

    link.setAttribute("href", "https://www.twitch.tv/" + stream);
    link.setAttribute("target", "_blank");
    link.textContent = stream;

    card.appendChild(pic);
    name.appendChild(link);
    name.appendChild(statusIcon);
    card.appendChild(name);
    channelsDiv.appendChild(card);
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

/******** Thoughts/todo *********
- isLive variable set to true or false or null when checking streams to find out if online, offline or not found
- The status para for non-existent streams needs to have not-found class instead of offline
    - Non-existent streams shouldn't appear with the offline channels!
- Make the "channel not found" text red (text-danger class)
- Online css class doesn't work
*/