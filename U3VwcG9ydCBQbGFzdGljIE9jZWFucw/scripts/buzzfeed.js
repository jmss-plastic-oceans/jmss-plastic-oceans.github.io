// Buzzfeed quiz-grabbing code!

// Feed URL - redirected through CORS Anywhere so we can access it cross-origin.
let feed_url = "https://cors-anywhere.herokuapp.com/https://www.buzzfeed.com/api/v2/feeds/poa_students";

function buzzfeedSetup() {
    // Quizzes element
    let quiz_wrapper = document.getElementById("quizzes");

    fetch(feed_url).then((response) => response.json()).then((data) => {
        if (data.success != 1) { return console.error("Failed at getting quizzes from Buzzfeed :(. [ERR: API Failure]") }

        data.buzzes.filter(b => b.is_quiz).forEach(b => {

            let newQuizElement = document.createElement("div");
            newQuizElement.classList.add("quiz");

            let description = document.createElement("p");
            description.innerText = b.description;

            let title = document.createElement("h3");
            title.innerText = b.title;
            
            let link = document.createElement("a");
            link.href = "https://buzzfeed.com" + b.canonical_path;

            let img = document.createElement("img");
            img.src = b.images.big;
            
            link.appendChild(img);
            newQuizElement.appendChild(link);
            newQuizElement.appendChild(title);
            newQuizElement.appendChild(description);

            quiz_wrapper.appendChild(newQuizElement);

        });

    });
}