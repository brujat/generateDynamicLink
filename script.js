(function GenerateDynamicLink() {
  //API_KEY should be changed project settings -> web api key
  const API_KEY = "AIzaSyDKrNHQcr75Y2n9Y39GXpV_JSat-mhHRIo";
  var $ = document.querySelector.bind(document),
    button = $("#generateLink"),
    deepLink = $("#deepLink"),
    packageName = $("#packageName"),
    afl = $("#afl"),
    ofl = $("#ofl"),
    utm_source = $("#utm_source"),
    utm_medium = $("#utm_medium"),
    utm_campaign = $("#utm_campaign"),
    shortLink = $("#shortLink"),
    ibi = $("#ibi"),
    ifl = $("#ifl"),
    isi = $("#isi"),
    radioValue,
    andriodValue,
    shortLinkTemplate = $("#dynamicshortlink");

  function returnUrlParamsBasedOnValue(param, value) {
    if (value) {
      return `&${param}=${value}`;
    }
    return ``;
  }

  function bindCopyEvent() {
    $("#copy").addEventListener("click", function copy() {
      let shortLinkText = $(".shortlinkcontent");

      //select the text
      shortLinkText.select();
      shortLinkText.setSelectionRange(0, 99999); //for mobile

      /* Copy the text inside the text field */
      navigator.clipboard.writeText(shortLinkText.value);
    });
  }

  $(".container").addEventListener(
    "click",
    function accordianHeaderClick(event) {
      if (
        event.target.classList.contains("accordian-header") ||  event.target.classList.contains("arrow-down")
      ) {
        if (event.target.classList.contains("arrow-down")) {
          event.target.parentElement.parentElement
            .querySelector(".accordian-content")
            .classList.toggle("animate");
            event.target.parentElement.querySelector('svg').classList.toggle('rotate');
        } else {
          event.target.parentElement
            .querySelector(".accordian-content")
            .classList.toggle("animate");
            event.target.querySelector('svg').classList.toggle('rotate');
        }
      }
    }
  );

  $("#radios").addEventListener("click", function radioClick(event) {
    if (
      event.target &&
      (event.target.matches(".radio-label") ||
        event.target.matches(`input[type='radio']`))
    ) {
      radioValue = event.currentTarget.querySelector(
        `input[type='radio']:checked`
      ).value;
    }
  });

  $("#andriod-radios").addEventListener("click", function radioClick(event) {
    if (
      event.target &&
      (event.target.matches(".radio-label") ||
        event.target.matches(`input[type='radio']`))
    ) {
      andriodValue = event.currentTarget.querySelector(
        `input[type='radio']:checked`
      ).value;
    }
  });

  button.addEventListener("click", async function buttonClick() {
    //empty previous link if clicked again
    shortLink.classList.remove("red");
    shortLink.innerText = "Loading . . .";

    //alert if no values
    if (!deepLink.value) {
      shortLink.innerText = "Deep Link URL is mandatory";
      shortLink.classList.add("red");
      return;
    }

    //manually generate dynamic long url
    var url = `https://saloncentric.page.link/?link=${
      deepLink.value
    }${returnUrlParamsBasedOnValue(
      "apn",
      packageName.value
    )}${returnUrlParamsBasedOnValue(
      "ofl",
      ofl.value
    )}${returnUrlParamsBasedOnValue(
      "utm_source",
      utm_source.value
    )}${returnUrlParamsBasedOnValue(
      "utm_medium",
      utm_medium.value
    )}${returnUrlParamsBasedOnValue(
      "utm_campaign",
      utm_campaign.value
    )}${returnUrlParamsBasedOnValue("ibi", ibi.value)}`;

    if (radioValue === "customurl") {
      url = `${url}${returnUrlParamsBasedOnValue("ifl", ifl.value)}`;
    } else {
      url = `${url}${returnUrlParamsBasedOnValue("isi", "1037955384")}`;
    }

    if (andriodValue === "customurl") {
      url = `${url}${returnUrlParamsBasedOnValue("afl", afl.value)}`;
    }

    //actuall api call to generate short link with long dynamic link
    var postData = await fetch(
      `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longDynamicLink: `${url}`,
          suffix: {
            option: "UNGUESSABLE",
          },
        }),
      }
    );

    var data = await postData.json();
    debugger;
    if (data.shortLink && data.previewLink) {
      let template = shortLinkTemplate.content.cloneNode(true);
      template.querySelector(".shortlinkcontent").value = data.shortLink;
      shortLink.classList.remove("red");
      shortLink.innerText = "";
      shortLink.appendChild(template);
      bindCopyEvent();
    }

    if(data.error) {
      shortLink.classList.add("red");
      shortLink.innerText = data.error.message;
    }
  });
})();
