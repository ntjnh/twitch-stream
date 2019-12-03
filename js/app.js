const channels = ["shroud", "OgamingSC2", "cretetion", "syndicate",  "ninja", "shlorox", "habathcx", "RobotCaleb", "elajjaz", "lirik", "tsm_dyrus", "riotgames", "silvername", "zryiedrokmijn"];

// Loop through the channels
channels.forEach(channel => {
    // Create user cards
    const card = document.createElement("div");
    card.classList.add("channel-card", "col-xs-6", "col-sm-4", "col-md-3");
    const pic = document.createElement("img");
    pic.classList.add("img-responsive");
    card.appendChild(pic);

    const name = document.createElement("h3");
    const link = document.createElement("a");
    link.setAttribute("href", "https://www.twitch.tv/" + channel);
    link.setAttribute("target", "_blank");
    const statusIcon = document.createElement("i");
    statusIcon.classList.add("fa", "fa-circle-o");
    link.textContent = channel;
    name.appendChild(link);
    name.appendChild(statusIcon);

    card.appendChild(name);

    const channelStatus = document.createElement("p"); // TODO: Change this variable -- status not really suitablee
    channelStatus.classList.add("text-muted", "status");

    const channelsDiv = document.querySelector(".channels");
    channelsDiv.appendChild(card);

    // Get stream data from API
    const clientID = "ecek1qkikyqi8smqzpazytcjgok63h";
    const streamDataUrl = "https://api.twitch.tv/helix/streams?user_login=" + channel;

    const streamData = new XMLHttpRequest();
    streamData.onreadystatechange = function() {
        if (streamData.readyState === 4) {
            if (streamData.status === 200) {
                const data = JSON.parse(streamData.responseText);

                // Get images and channel data
                const offlineStreamUrl = "https://api.twitch.tv/helix/users?login=" + channel;
                const offlineStreamData = new XMLHttpRequest();
                offlineStreamData.onreadystatechange = function() {
                    if(offlineStreamData.readyState === 4) {
                        if(offlineStreamData.status === 200) {
                            const user = JSON.parse(offlineStreamData.responseText);

                            if (user.data[0]) { // TODO: Make another variable or something -- I hate this
                                if(user.data[0].profile_image_url) {
                                    pic.setAttribute("src", user.data[0].profile_image_url);
                                } else {
                                    // If no logo, use dummy image
                                    pic.setAttribute("src", "generic.jpg");
                                }
                            } else {
                                // If channel is not found
                                channelStatus.innerHTML = "<em>Channel not found.</em>"; // TODO: Make this text red
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
                if (data.data[0] === undefined) {
                    channelStatus.innerHTML = "<em>Offline</em>";
                    card.appendChild(channelStatus);
                    card.classList.add("offline");
                // Else if channel is currently streaming
                } else if (data.data[0].type == "live") {
                    // const game = data.stream.game;
                    const viewers = data.data[0].viewer_count;

                    channelStatus.innerHTML = `${viewers} viewers`;
                    card.appendChild(channelStatus);
                    card.classList.add("online");
                    channelStatus.classList.remove("text-muted");
                    channelStatus.classList.add("text-success");
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

    // TODO: Channels that are "not found" shouldn't appear with the offline channels!
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

// Status clipping function -- TODO: Probably don't need this function anymore
function snipStatus(status) {
    if (status.length > 30) return (status.substring(0, 30) + "...");
    else return status;
}