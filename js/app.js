const channels = ["ESL_SC2", "shroud", "OgamingSC2", "cretetion", "syndicate",  "freecodecamp", "shlorox", "habathcx", "RobotCaleb", "elajjaz", "lirik", "tsm_dyrus", "riotgames", "silvername"];

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
  
  const channelStatus = document.createElement("p");
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
        
        // If channel is offline
        if (data.stream === null) {
          channelStatus.innerHTML = "<em>Offline</em>";
          card.appendChild(channelStatus);
          card.classList.add("offline");
          
          // Get images and channel data
          const offlineStreamUrl = "https://api.twitch.tv/helix/users?login=" + channel;
          const offlineStreamData = new XMLHttpRequest();
          offlineStreamData.onreadystatechange = function() {
            if(offlineStreamData.readyState === 4) {
              if(offlineStreamData.status === 200) {
                const user = JSON.parse(offlineStreamData.responseText);
                
                if(user.logo) {
                  pic.setAttribute("src", user.logo);
                } else {
                  // If no logo, use dummy image
                  pic.setAttribute("src", "https://bit.ly/2w9qEyu");
                }
              } // End status if
            } // End readyState if
          };
          offlineStreamData.open("GET", offlineStreamUrl);
          offlineStreamData.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
          offlineStreamData.setRequestHeader("Client-ID", clientID);
          offlineStreamData.send();
        // If channel is not found
        } else if(data.stream === undefined) {
          channelStatus.innerHTML = "<em>Channel not found.</em>";
          card.appendChild(channelStatus);
        // Otherwise if online, display stream information
        } else {
          const game = data.stream.game;
          const status = data.stream.channel.status;
          
          pic.setAttribute("src", data.stream.channel.logo);
          channelStatus.innerHTML = snipStatus(status);
          channelStatus.setAttribute("title", status);
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

// Status clipping function
function snipStatus(status) {
  if (status.length > 30) return (status.substring(0, 30) + "...");
  else return status;
}