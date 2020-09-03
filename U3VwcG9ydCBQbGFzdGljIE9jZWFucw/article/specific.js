
const urlParams = new URLSearchParams(document.location.search);
const loading = document.getElementById("loading");
const textWrapper = document.getElementById("text");
const share = document.getElementById("share");
const oldURL = document.location.href;

const sharewrapper = document.getElementById("sharewrapper");
const sharelink = document.getElementById("sharelink");
const closeshare = document.getElementById("closeshare");

closeshare.onclick = () => {
    sharewrapper.style.visibility = "hidden";
}

let shortUrl, articleTitle;

share.onclick = () => {
    if (articleTitle) {

        if (localStorage.getItem(string_to_slug(articleTitle))) {

            shortUrl = localStorage.getItem(string_to_slug(articleTitle));
            sharelink.innerText = shortUrl;
            sharelink.href = "//" + shortUrl;

            try {
                navigator.share({
                    title: articleTitle,
                    text: "An article by Plastic Oceans Students",
                    url: shortUrl
                })
            } catch (e) {
                sharewrapper.style.visibility = "unset";
            }

        } else {
            fetch(`https://api.rebrandly.com/v1/links?domain[fullName]=${encodeURIComponent("rebrand.ly")}&slashtag=${encodeURIComponent("plasticoceansstudents-" + string_to_slug(articleTitle))}`, {
                method: 'get',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    "apikey": btoa("çV¹ßxwãÖÚó¾9ÕÎs¼×Fû")
                }
            }).then(res => res.json()).then((res) => {
                console.log(res);
                if (res.length == 0) {
                    const linkData = {
                        destination: oldURL,
                        domain: { fullName: "rebrand.ly" },
                        title: `Article by POA Students - ${articleTitle}`,
                        slashtag: "plasticoceansstudents-" + string_to_slug(articleTitle)
                    };
                
                    fetch('https://api.rebrandly.com/v1/links', {
                        method: 'post',
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Content-Type': 'application/json',
                            "apikey": btoa("çV¹ßxwãÖÚó¾9ÕÎs¼×Fû")
                        },
                        body: JSON.stringify(linkData)
                    }).then(res=>res.json()).then(res => {
                
                        console.log(res);
                        shortUrl = res.shortUrl;
        
                        localStorage.setItem(string_to_slug(articleTitle), shortUrl);
                
                        sharelink.innerText = shortUrl;
                        sharelink.href = "//" + shortUrl;
                
                    }).then(() => {
                        try {
                            navigator.share({
                                title: articleTitle,
                                text: "An article by Plastic Oceans Students",
                                url: shortUrl
                            })
                        } catch (e) {
                            sharewrapper.style.visibility = "unset";
                        }
                    });
                } else {
                    shortUrl = res[0].shortUrl;
    
                    localStorage.setItem(string_to_slug(articleTitle), shortUrl);
            
                    sharelink.innerText = shortUrl;
                    sharelink.href = "//" + shortUrl;

                    try {
                        navigator.share({
                            title: articleTitle,
                            text: "An article by Plastic Oceans Students",
                            url: shortUrl
                        })
                    } catch (e) {
                        sharewrapper.style.visibility = "unset";
                    }
                }

            })            
        }

    } else {
        share.style.backgroundColor = "lightcoral";
        share.style.color = "white;"
        setTimeout(() => {
            share.style.backgroundColor = "unset"
            share.style.color = "black";
        }, 1000);
    }
}

// The CORS proxy circumvents the Access-Control-Allow-Origin header on the Google servers.
const CORS = "https://srg-cors-proxy.herokuapp.com/";

function string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaaeeeeiiiioooouuuunc------";

    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

if (!urlParams.get("data")) {

    loading.innerHTML = "Sorry! Article not found. <a href='../'>Go back</a>";

} else {

    const { url, title } = JSON.parse(atob(urlParams.get("data")));
    articleTitle = title;
    let code;

    fetch(CORS + url).then((response) => {
        code = [response.status, response.statusText];
        response.text().then((text) => {

            let newP = document.createElement("p")
            let newT = document.createElement("h1");

            newP.innerText = text;

            if (code[0] != 200) {
                newT.style.fontFamily = 'monospace';
                newT.innerHTML = "error " + code[0] + " - please <a href='https://github.com/jmss-plastic-oceans/jmss-plastic-oceans.github.io/issues/new'>file an issue</a>.";
                newP.innerHTML = "For media team: please check document access restrictions.<br>Error message: " + code[1];
                document.title = "error " + code[0];
            } else {
                newT.innerText = title;
                document.title = `${title} | Article | Plastic Oceans Students`
            }

            loading.style.display = "none";
            textWrapper.appendChild(newT);
            textWrapper.appendChild(newP);

        })
    });

}