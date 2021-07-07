var collapsed = true;
const ARTICLE_IMG_FAILED_SRC = "http://1.bp.blogspot.com/-_YrXXcaGrhw/Uorol4N7jpI/AAAAAAAAPFM/SpJzbfGIhfk/s1600/Screen+Shot+2013-11-18+at+11.19.22+PM.png";


// ----------------------------------
// Get articles
// ----------------------------------

// Keep some variables out of the function so they can be used for console debugging
var csvData, docIdRegex, prevMessage;
var publishedNum = 0;

// The CORS proxy circumvents the Access-Control-Allow-Origin header on the Google servers.
const CORS = "https://srg-cors-proxy.herokuapp.com/"

// URL of the google sheet with article links and publishing information
const ARTICLE_GSHEET_URL = CORS + "https://docs.google.com/spreadsheets/d/1twAf3i_0UoV1vm9gVbBa6W0EzKShxj9khc6e2GJrqPg/export?format=csv";

// Main article fetching function
function articleSetup() {

	// This element is where all the articles are inserted into
	let updatesWrapper = document.getElementById("articles-wrapper");

	// This regular expression matches the document ID in a url.
	docIdRegex = new RegExp('https://docs.google.com/document/d/(.*)/');

	// Fetch the main google sheet, then chain a bunch of functions to it that makes sure they run properly
	fetch(ARTICLE_GSHEET_URL)
		.then((response) => {	

			// There are a lot of .then() because Javascript's fetch() function is a Promise, which means it
			// runs in the background and returns the result like this. To ensure everything happens in the right
			// order we chain them together.

			// After running, get the response text
			response.text().then(text => {

				// After getting the response text, parse the CSV file which is returned

				csvData = text.split("\n");
				csvData = csvData.map(x => x.split(",").slice(1))

				// .shift() removes the first row (header row)
				csvData.shift();

				// Write csvData to console for debugging, then invoke the google docs part of the program
				console.dir(csvData);
				appendArticles(csvData);

			});
		})
		.then((data) => {

			console.log("Articles should be added now!");

			document.getElementById("articles-loading").style.display = "none";
			document.getElementById("loading-msg").style.display="none";

		});
	
	// This function fetches public google docs' text and writes it to the site
	function appendArticles(csvData) {

		csvData.forEach(function (val, index) {

			// Only fetch information if the article is marked for publishing
			if (val[4] === "TRUE") {

				console.log("Adding following article to site...");
				console.dir(val);

				let docUrl = "https://docs.google.com/document/d/" + val[2].match(docIdRegex)[1] + "/export?format=txt";

				// Get Google Docs content based on spreadsheet URL	- this is where the regex comes in handy	
				fetch(CORS + docUrl).then(response => {

					response.text().then(articleContent => {

						let isValid = true;
						
						if (response.headers.get("Content-Type").includes("text/html")) {

							console.log(`=== ATTENTION PLASTIC OCEANS DEVELOPER ===
Article ID ${val[2].match(docIdRegex)[1]} is invalid - check permissions!
Article has been restricted.`);

							articleContent = "ATTENTION: Article cannot be fetched by the website. Please try again later. [Error: Google Authorization failed].";
							isValid = false;

						}

						// Choose whether image/text is aligned left or right alternatively (by getting the remainder of the index over 2)
						let leftRight = (index%2) ? "right":"left";

						// Create new elements
						let newArticleWrapper = document.createElement("div");
						newArticleWrapper.classList.add("article");
						newArticleWrapper.style.zIndex = index + 1;
						newArticleWrapper.style.zIndex = index + 1;

						if (!isValid) {
							newArticleWrapper.classList.add("invalid-article");
						}

						let newArticleLink = document.createElement("a");
						newArticleLink.classList.add("article-link");

						let data = {
							url: docUrl,
							title: val[0]
						};

						newArticleLink.href = isValid ? "article/?data=" + btoa(JSON.stringify(data)): "javascript:alert('There was an error fetching this article, so we can\\'t show it right now. Please try again later.')";

						//newArticleLink.style.zIndex = index + 1;

						let newArticleLinkDiv = document.createElement("div");
						newArticleLinkDiv.classList.add(leftRight + "-title");
						//newArticleLinkDiv.style.zIndex = index + 1;

						let newArticleLinkDivImage = document.createElement("img");
						newArticleLinkDivImage.src = isValid ? (val[3] || `https://lh3.google.com/u/0/d/${val[2].match(docIdRegex)[1]}=k`) : ARTICLE_IMG_FAILED_SRC;
						newArticleLinkDivImage.onerror = (e) => { console.log("Image for article is not valid " + e.target.src); e.target.src=ARTICLE_IMG_FAILED_SRC }
						newArticleLinkDivImage.classList.add("article-img");
						newArticleLinkDivImage.classList.add(leftRight + "-img");
						newArticleLinkDivImage.align = leftRight;
						newArticleLinkDivImage.alt = val[3] ? "Article thumbnail image":"Image showing printout of the article text";
						//newArticleLinkDivImage.style.zIndex = index + 1;

						let newArticleContentWrapper = document.createElement("div");
						newArticleContentWrapper.classList.add("title-text");
						//newArticleContentWrapper.style.zIndex = index + 1;

						let newArticleContentTitle = document.createElement("h5");
						newArticleContentTitle.classList.add("article-title");

						if (index == 0) {
							newArticleContentTitle.innerHTML = "Latest: " + val[0];
							newArticleWrapper.style.opacity = "1";
							newArticleWrapper.style.marginTop = "unset";
						} else {
							newArticleContentTitle.innerHTML = val[0];
						}


						//newArticleContentTitle.style.zIndex = index + 1;

						let newArticleContentSubtitle = document.createElement("h6");
						newArticleContentSubtitle.classList.add("article-subtitle");
						newArticleContentSubtitle.innerHTML = val[1];
						//newArticleContentSubtitle.style.zIndex = index + 1;

						let newArticleContentDate = document.createElement("span");
						newArticleContentDate.classList.add("article-date");
						newArticleContentDate.innerHTML = val[5];

						let newArticleContentBody = document.createElement("p");
						newArticleContentBody.classList.add("article-content");

						let articleTextOnlySpan = document.createElement("span");
						articleTextOnlySpan.innerHTML = marked(articleContent);

						newArticleContentBody.innerHTML = articleTextOnlySpan.innerText.split("\n")[0].substring(0,500) + (isValid ? "...":"");
						//newArticleContentBody.style.zIndex = index + 1;

						// Append elements to each other
						newArticleContentWrapper.appendChild(newArticleContentTitle);
						newArticleContentWrapper.appendChild(newArticleContentSubtitle);
						newArticleContentWrapper.appendChild(newArticleContentDate);
						newArticleContentWrapper.appendChild(newArticleContentBody);

						newArticleLinkDiv.appendChild(newArticleLinkDivImage);
						newArticleLinkDiv.appendChild(newArticleContentWrapper);

						newArticleLink.appendChild(newArticleLinkDiv);

						newArticleWrapper.appendChild(newArticleLink);

						updatesWrapper.appendChild(newArticleWrapper);

						publishedNum++;

						document.getElementById("loading-msg").innerText = `Please wait, articles are loading... (${index+1}/${csvData.length})`;
						console.log("Finished!");


					});

				}, error => {
					console.error(error);
				});
			} else {

				console.log("The article " + val[0] + " was marked as Not For Publishing.");

			}
		});

	}

}

// After 30 seconds of continuous loading, show a help message (program likely broken).
setTimeout(function () {
	if (document.getElementById("articles-loading").style.display != "none") {
		document.getElementById("loading-msg").innerHTML = 'Not loading? Report an <a href="https://github.com/jmss-plastic-oceans/jmss-plastic-oceans.github.io/issues">issue</a>.';
	}
}, 30000)

// Function to make all the articles collapse in a really cool way (except the first one)
function collapseCoolly(classname) {
	document.querySelectorAll('.' + classname).forEach((elem, index) => {
		if (index != 0) {
			elem.style.display = "none";
		}
	});

	document.getElementById("collapse-btn").innerText = "View all articles";
	document.getElementById("collapse-btn").style.backgroundColor = "#303d7b";
	document.getElementById("collapse-btn").style.color = "white";

	collapsed = true;
}

// Function just does the opposite as the other one.
function unCollapse(classname) {
	document.querySelectorAll('.' + classname).forEach((elem, index) => {
		if (index != 0) {
			elem.style.display = "inline-block";
		}
	});

	document.getElementById("collapse-btn").innerText = "Collapse articles";
	document.getElementById("collapse-btn").style.backgroundColor = "#2ebfcc";
	document.getElementById("collapse-btn").style.color = "white";

	collapsed = false;
}

// Different type of function definition so it can be initialised asynchronously after the collapse var
var toggleCollapse = function (classname) {
	if (collapsed) {
		unCollapse(classname);
	} else {
		collapseCoolly(classname);
	}
}
