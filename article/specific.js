
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
let allowShare = false;

share.onclick = () => {
    if (articleTitle && allowShare) {

        if (localStorage.getItem(string_to_slug(articleTitle))) {

            shortUrl = localStorage.getItem(string_to_slug(articleTitle));
            sharelink.innerText = shortUrl;
            sharelink.href = "https://" + shortUrl;

            try {
                navigator.share({
                    title: articleTitle,
                    text: "An article by Plastic Oceans Students",
                    url: "//" + shortUrl
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
                                url: "//" + shortUrl
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
                            url: "//" + shortUrl
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

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

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
    
    if (str.length < 5){
        
        str = makeid(5)
           
    }
    
    
    return str;
}

if (!urlParams.get("data")) {

    loading.innerHTML = "Sorry! Article not found. <a href='../' style='text-decoration:underline'>Go back</a>";

} else {

    let url, title;
    let doRequest = true;

    try {
        data = JSON.parse(atob(urlParams.get("data")));
        url = data.url; title = data.title;
    } catch (e) {
        let newP = document.createElement("p")
        let newT = document.createElement("h1");
        newT.style.fontFamily = 'monospace';
        newT.innerHTML = "Error - please check the page URL or <a href='https://github.com/jmss-plastic-oceans/jmss-plastic-oceans.github.io/issues/new'>file an issue</a>.";
        newP.innerHTML = "If you got to this page from a link, please notify the media team. Otherwise, check the URL.<br><br>[<code>" + e + "</code>]";
        document.title = `Error | JMSS Plastic Oceans`;

        loading.style.display = "none";
        textWrapper.appendChild(newT);
        textWrapper.appendChild(newP);

        allowShare = false;
        doRequest = false;

        share.classList.add("disabled");
        share.onclick = () => {
            alert("We're sorry, we can't share this article right now. Please contact the media team.");
        }

    }

    if (doRequest) {

        articleTitle = title;
        let code;

        fetch(CORS + url).then((response) => {
            code = [response.status, response.statusText];
            response.text().then((text) => {

                let newP = document.createElement("p")
                let newT = document.createElement("h1");

                newP.innerHTML = marked(text);

                if (code[0] != 200) {
                    newT.style.fontFamily = 'monospace';
                    newT.innerHTML = "error " + code[0] + " - please <a href='https://github.com/jmss-plastic-oceans/jmss-plastic-oceans.github.io/issues/new'>file an issue</a>.";
                    newP.innerHTML = "For media team: please check document access restrictions (visible to everyone).<br>Error message: " + code[1];
                    document.title = "Error | JMSS Plastic Oceans";
                } else {
                    newT.innerText = title;
                    document.title = `${title} | Article | Plastic Oceans Students`;
                    allowShare = true;
                }

                loading.style.display = "none";
                textWrapper.appendChild(newT);
                textWrapper.appendChild(newP);

            })
        });

    }

}
