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
    isi = $('#isi'),
    radioValue,
    andriodValue;

    function returnUrlParamsBasedOnValue(param, value) {
        if(value) {
            return `&${param}=${value}`
        }
        return ``;
    }

    $('.container').addEventListener('click', function accordianHeaderClick(event) {
        if(event.target.classList.value === 'accordian-header') {
            event.target.parentElement.querySelector('.accordian-content').classList.toggle('animate');
            event.target.querySelector('svg').classList.toggle('rotate');
        }
    });

    $('#radios').addEventListener('click', function radioClick(event) {
        if(event.target && (event.target.matches('.radio-label') || event.target.matches(`input[type='radio']`))) {
            radioValue = event.currentTarget.querySelector(`input[type='radio']`).value;
        }
    });

    $('#andriod-radios').addEventListener('click', function radioClick(event) {
        if(event.target && (event.target.matches('.radio-label') || event.target.matches(`input[type='radio']`))) {
            andriodValue = event.currentTarget.querySelector(`input[type='radio']`).value;
        }
    });

    button.addEventListener('click', async function buttonClick() {
        //empty previous link if clicked again
        shortLink.classList.remove('red');
        shortLink.innerText = 'Loading . . .';

        //alert if no values 
        if(!deepLink.value) {
            shortLink.innerText = "Deep Link URL is mandatory";
            shortLink.classList.add('red');
        }

        //manually generate dynamic long url
        var url = `https://saloncentric.page.link/?link=${deepLink.value}${returnUrlParamsBasedOnValue('apn', packageName.value)}${returnUrlParamsBasedOnValue('ofl', ofl.value)}${returnUrlParamsBasedOnValue('utm_source', utm_source.value)}${returnUrlParamsBasedOnValue('utm_medium', utm_medium.value)}${returnUrlParamsBasedOnValue('utm_campaign', utm_campaign.value)}${returnUrlParamsBasedOnValue('ibi', ibi.value)}`;

        if(radioValue === 'customurl') {
            url = `${url}${returnUrlParamsBasedOnValue('ifl', ifl.value)}`
        } else {
            url = `${url}${returnUrlParamsBasedOnValue('isi', ibi.value)}`
        }

        if(andriodValue === 'customurl') {
            url = `${url}${returnUrlParamsBasedOnValue('afl', afl.value)}`
        }

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
            shortLink.classList.remove('red');
            shortLink.innerText = `Short Link: ${data.shortLink} and Preview Link: ${data.previewLink}`;
        } 
    })
})();