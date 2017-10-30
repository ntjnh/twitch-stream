const channels = ["tinkerleo", "ESL_SC2", "shroud", "OgamingSC2", "cretetion", "syndicate",  "freecodecamp", "kevinho90", "habathcx", "RobotCaleb", "castro_1021", "lirik", "tsm_dyrus", "riotgames"];

channels.forEach(function(channel) {

  //Create user cards
  const $card = $("<div></div>", {"class": "channel-card col-xs-6 col-sm-4 col-md-3"});
  const $pic = $("<img>", {"class": "img-responsive"});
  $card.append($pic);

  const $name = $("<h3>");
  const $link = $("<a>", {href: "https://www.twitch.tv/" + channel, target: "_blank"});
  const $statusIcon = $("<i>", {"class": "fa fa-circle-o"});
  $link.text(channel);
  $name.append($link);
  $name.append($statusIcon);

  $card.append($name);

  const $status = $("<p>", {"class": "text-muted status"});

  $(".channels").append($card);

  //get stream data from api
  const apiStream = "https://wind-bow.glitch.me/twitch-api/streams/" + channel;
  $.ajax(apiStream, {
    dataType: "JSON",
    data: {
      origin: "*"
    },
    type: "GET",
    success: data => {

      // if user is offline
      if (data.stream === null) {
        $status.html("<em>Offline</em>");
        $card.append($status);
        $card.addClass("offline");
        // get images for all + user data for offline channels
        const apiUser = "https://wind-bow.glitch.me/twitch-api/users/" + channel;
        $.ajax(apiUser, {
          dataType: "JSON",
          data: {
            origin: "*"
          },
          type: "GET",
          success: user => {
            if (user.logo) {
              $pic.attr("src", user.logo);
            } else {
              //if no image is available, use dummy image
              $pic.attr("src", "https://bit.ly/2w9qEyu");
            }
          }
        }); // end ajax (user info)
      } else if (data.stream === undefined) {
        $status.html("<em>Channel not found.</em>");
        $card.append($status);
      } else {
        const game = data.stream.game;
        const status = data.stream.channel.status;

        $pic.attr("src", data.stream.channel.logo);
        $status.html(snipStatus(status)).attr("title", status);
        $card.append($status);
        $card.addClass("online");
        $status.removeClass("text-muted");
        $status.addClass("text-success");
        $statusIcon.removeClass("fa-circle-o");
        $statusIcon.addClass("fa-circle");
      }
    }
  }); // end ajax (stream)
}); // end loop

filter();


// Filter
function filter() {
  const $showAll = $("#showAll");
  const $showOnline = $("#showOnline");
  const $showOffline = $("#showOffline");

  $showAll.on("click", () => {
    $showAll.attr("disabled", "disabled");
    $showOnline.removeAttr("disabled");
    $showOffline.removeAttr("disabled");
    $(".offline, .online").show();
  });

  $showOnline.on("click", () => {
    $showAll.removeAttr("disabled");
    $showOffline.removeAttr("disabled");
    $showOnline.attr("disabled", "disabled");
    $(".online").show();
    $(".offline").hide();
  });

  $showOffline.on("click", () => {
    $showAll.removeAttr("disabled");
    $showOnline.removeAttr("disabled");
    $showOffline.attr("disabled", "disabled");
    $(".offline").show();
    $(".online").hide();
  });
}

// status shortening function
function snipStatus(status) {
    if (status.length > 30) {
        return (status.substring(0, 30) + "...");
    }
    else {
        return status;
    }
}
