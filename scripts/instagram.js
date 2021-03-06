const POA_INSTA_USR = "poa_students";

// Instagram setup
function instagramSetup() {

	// Turn out if you append __a=1 to the end of any Instagram user URL then you get a JSON page with posts

	fetch(`https://srg-cors-proxy.herokuapp.com/https://www.instagram.com/${POA_INSTA_USR}/?__a=1`).then(response => {

		// Instead of response.text() just parse it as JSON straight up
		response.json().then(raw_json => {

			// All of this graphql.user stuff is just how Instagram organises their JSON information, not anything to do with Javascript
			raw_json.graphql.user.edge_owner_to_timeline_media.edges.forEach((post, index) => {

				// Limit instagram posts to 4 so we don't crowd the site.
				if (index < 4) {
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
					newInstagramIcon.src = "images/social_icons/insta-color.webp";
					newInstagramIcon.alt = "Instagram logo";
					newInstagramIcon.classList.add("instagram-logo");

					// Append everything to each other and add it to the main website
					newInstagramPostLink.appendChild(newInstagramPostImage);
					newInstagramPostContainer.appendChild(newInstagramIcon);
					newInstagramPostContainer.appendChild(newInstagramPostLink);
					newInstagramPostContainer.appendChild(newInstagramPostCaption);

					// Use the Javascript Vibrant library to make the post containers match their image swatch
					Vibrant.from(img_url).getPalette((err, palette) => {
						newInstagramPostContainer.style.backgroundColor = `rgb(${ palette.LightVibrant._rgb.join(",") })`;	
					});

					instagram_container.appendChild(newInstagramPostContainer);
				}

			})
		})
	})
}