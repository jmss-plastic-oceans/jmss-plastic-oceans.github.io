
const urlParams = new URLSearchParams(document.location.search);
const loading = document.getElementById("loading");
const textWrapper = document.getElementById("text");

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

    fetch(CORS + url).then((response) => {
        response.text().then((text) => {

            history.replaceState(JSON.parse(atob(urlParams.get("data"))), `${title} | Plastic Oceans @ John Monash Science School`, string_to_slug(title));

            let newP = document.createElement("p")
            newP.innerText = text;

            let newT = document.createElement("h1");
            newT.innerText = title;

            loading.style.display = "none";
            textWrapper.appendChild(newT);
            textWrapper.appendChild(newP);

        })
    });


}