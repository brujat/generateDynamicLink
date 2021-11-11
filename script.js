(function GenerateDynamicLink () {
    //API_KEY should be changed project settings -> web api key
    const API_KEY = 'AIzaSyDKrNHQcr75Y2n9Y39GXpV_JSat-mhHRIo'
    var $ = document.querySelector.bind(document),
    button = $('#generateLink'),
    deepLink = $('#deepLink'),
    packageName = $('#packageName'),
    afl = $('#afl'),
    ofl = $('#ofl'),
    utm_source = $('#utm_source'),
    utm_medium = $('#utm_medium'),
    utm_campaign = $('#utm_campaign'),
    shortLink = $('#shortLink'),
    ibi = $('#ibi'),
    ifl = $('#ifl'),
    isi = $('#isi');

    function returnUrlParamsBasedOnValue(param, value) {
        if(value) {
            return `&${param}=${value}`
        }
        return ``;
    }
   

    button.addEventListener('click', async function buttonClick() {
        //empty previous link if clicked again
        shortLink.innerText = '';

        //alert if no values 
        if(!deepLink.value) {
            shortLink.innerText = "Deep Link URL is mandatory";
        }

        //manually generate dynamic long url
        var url = `https://saloncentric.page.link/?link=${deepLink.value}${returnUrlParamsBasedOnValue('apn', packageName.value)}${returnUrlParamsBasedOnValue('afl', afl.value)}${returnUrlParamsBasedOnValue('ofl', ofl.value)}${returnUrlParamsBasedOnValue('utm_source', utm_source.value)}${returnUrlParamsBasedOnValue('utm_medium', utm_medium.value)}${returnUrlParamsBasedOnValue('utm_campaign', utm_campaign.value)}${returnUrlParamsBasedOnValue('ibi', ibi.value)}${returnUrlParamsBasedOnValue('ifl', ifl.value)}${returnUrlParamsBasedOnValue('isi', isi.value)}`;

        //actuall api call to generate short link with long dynamic link
        var postData = await fetch(`https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                longDynamicLink: `${url}`,
                suffix: {
                    option: "UNGUESSABLE"
                }
            })
        })

        var data = await postData.json();
        if(data.shortLink && data.previewLink) {
            shortLink.innerText = `Short Link: ${data.shortLink} and Preview Link: ${data.previewLink}`
        }
    })
})();