
const urlParams = new URLSearchParams(document.location.search);
const loading = document.getElementById("loading");
const textWrapper = document.getElementById("text");

// The CORS proxy circumvents the Access-Control-Allow-Origin header on the Google servers.
const CORS = "https://srg-cors-proxy.herokuapp.com/"

if (!urlParams.get("data")) {
    loading.innerHTML = "Sorry! Article not found. <a href='../'>Go back</a>";
} else {

    const { url, title } = JSON.parse(atob(urlParams.get("data")));

    fetch(CORS + url).then((response) => {
        response.text().then((text) => {

            let newP = document.createElement("p")
            newP.innerText = text;

            let newT = document.createElement("h1");
            newT.innerText = title;
            document.title = `${title} | Plastic Oceans @ John Monash Science School`;

            loading.style.display = "none";
            textWrapper.appendChild(newT);
            textWrapper.appendChild(newP);

        })
    });


}