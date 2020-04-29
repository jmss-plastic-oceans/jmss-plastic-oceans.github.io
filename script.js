var collapsed = true;
const POA_INSTA_USR = "poa_students";

// ----------------------------------
// Get articles
// ----------------------------------

// Keep some variables out of the function so they can be used for console debugging
var csvData, docIdRegex, prevMessage;
var publishedNum = 0;

// URL of the google sheet with article links and publishing information
const ARTICLE_GSHEET_URL = "https://docs.google.com/spreadsheets/d/1JJ5EX-8RbNiuJ28sq_SwswLtMyHY9yy61s1oLEyM5mA/export?format=csv";

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

				csvData = text.split("\n")
				csvData.forEach(function(val, index) {
					this[index] = val.split(",");
				}, csvData);

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

				// Get Google Docs content based on spreadsheet URL	- this is where the regex comes in handy	
				fetch("https://docs.google.com/document/d/" + val[2].match(docIdRegex)[1] + "/export?format=txt").then(response => {

					response.text().then(articleContent => {

						// Choose whether image/text is aligned left or right alternatively (by getting the remainder of the index over 2)
						let leftRight = (index%2) ? "right":"left";

						// Create new elements
						let newArticleWrapper = document.createElement("div");
						newArticleWrapper.classList.add("article");
						newArticleWrapper.style.zIndex = index + 1;
						newArticleWrapper.style.zIndex = index + 1;

						let newArticleLink = document.createElement("a");
						newArticleLink.classList.add("article-link");
						newArticleLink.href = val[2];
						//newArticleLink.style.zIndex = index + 1;

						let newArticleLinkDiv = document.createElement("div");
						newArticleLinkDiv.classList.add(leftRight + "-title");
						//newArticleLinkDiv.style.zIndex = index + 1;

						let newArticleLinkDivImage = document.createElement("img");
						newArticleLinkDivImage.src = val[3];
						newArticleLinkDivImage.classList.add("article-img");
						newArticleLinkDivImage.classList.add(leftRight + "-img");
						newArticleLinkDivImage.align = leftRight;
						newArticleLinkDivImage.alt = "Article thumbnail image";
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
						newArticleContentBody.innerHTML = articleContent.substring(0,500) + "...";
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
			elem.style.marginTop = `-47vh`;
			elem.style.opacity = "0";
		}
	});

	document.getElementById("collapse-btn").innerText = "View all articles";
	document.getElementById("collapse-btn").style.backgroundColor = "rgb(1, 1, 77)";
	document.getElementById("collapse-btn").style.color = "white";

	collapsed = true;
}

// Function just does the opposite as the other one.
function unCollapse(classname) {
	document.querySelectorAll('.' + classname).forEach((elem, index) => {
		if (index != 0) {
			elem.style.marginTop = 'unset';
			elem.style.opacity = "1";
		}
	});

	document.getElementById("collapse-btn").innerText = "Collapse articles";
	document.getElementById("collapse-btn").style.backgroundColor = "rgb(222, 168, 33)";
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

// Instagram setup
function instagramSetup() {

	// Turn out if you append __a=1 to the end of any Instagram user URL then you get a JSON page with posts

	fetch(`https://www.instagram.com/${POA_INSTA_USR}/?__a=1`).then(response => {

		// Instead of response.text() just parse it as JSON straight up
		response.json().then(raw_json => {

			// All of this graphql.user stuff is just how Instagram organises their JSON information, not anything to do with Javascript
			raw_json.graphql.user.edge_owner_to_timeline_media.edges.forEach((post, index) => {

				// Define the image url, the post url, the caption and the accessibility caption
				let img_url = post.node.display_url;
				let post_url = "https://instagram.com/p/" + post.node.shortcode;
				let caption = post.node.edge_media_to_caption.edges[0].node.text;
				let alt_caption = post.node.accessibility_caption;

				// Get the instagram container from the DOM
				let instagram_container = document.getElementById("instagram-container");
				
				// Create the post container and add images and things to it
				let newInstagramPostContainer = document.createElement("div");
				newInstagramPostContainer.classList.add("instagram-post");
				newInstagramPostContainer.id = "instagram-post-" + index;

				let newInstagramPostLink = document.createElement("a");
				newInstagramPostLink.href = post_url;

				let newInstagramPostImage = document.createElement("img");
				newInstagramPostImage.classList.add("instagram-post-image");
				newInstagramPostImage.src = img_url;
				newInstagramPostImage.alt = alt_caption;

				let newInstagramPostCaption = document.createElement("p");
				newInstagramPostCaption.classList.add("instagram-post-text");
				newInstagramPostCaption.innerText = caption;

				let newInstagramIcon = document.createElement("img");
				newInstagramIcon.src = "images/insta_icon.webp";
				newInstagramIcon.alt = "Instagram logo";
				newInstagramIcon.classList.add("instagram-logo");

				// Append everything to each other and add it to the main website
				newInstagramPostLink.appendChild(newInstagramPostImage);
				newInstagramPostContainer.appendChild(newInstagramIcon);
				newInstagramPostContainer.appendChild(newInstagramPostLink);
				newInstagramPostContainer.appendChild(newInstagramPostCaption);
				instagram_container.appendChild(newInstagramPostContainer);

			})
		})
	})
}