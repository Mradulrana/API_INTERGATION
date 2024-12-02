document.addEventListener("DOMContentLoaded", () => {
    let searchCount = 0;
    const maxSearchesBeforeRecaptcha = 10;
    const initialMaxChars = 190; // Initial character limit
    let updatedCharCount = 0; // Initial typed character count
    const loader = document.querySelector(".loader");
    const charCounter = document.getElementById("charCounter");
    const searchInput = document.getElementById("queryInput");
    const searchButton = document.getElementById("searchButton");
    const resultDiv = document.getElementById("resultDiv");
    const gptResponse = document.getElementById("gptResponse");
    const recaptchaDiv = document.getElementById("recaptchaDiv");
    const closeRecaptcha = document.getElementById("closeRecaptcha");
    const modal = document.getElementById("modal");
    const proceedButton = document.getElementById("proceedButton");
    const cancelButton = document.getElementById("cancelButton");
    const overlay = document.getElementById("overlay");
    const mainContainer = document.querySelector(".main-container");

    if (
        !loader ||
        !modal ||
        !proceedButton ||
        !cancelButton ||
        !recaptchaDiv ||
        !closeRecaptcha ||
        !charCounter ||
        !searchInput ||
        !overlay ||
        !resultDiv ||
        !gptResponse
    ) {
        console.error("One or more required elements are missing in the HTML.");
        return;
    }

    // Show loader and overlay when the page is loading
    loader.style.display = "block";

    // Hide loader and overlay once the page content is loaded
    window.addEventListener('load', () => {
        loader.style.display = "none"; // Hide loader when page is fully loaded
    });

    // Character counter functionality
    searchInput.addEventListener("input", () => {
        updatedCharCount = searchInput.value.length;

        // Calculate remaining characters dynamically
        const remainingChars = Math.max(0, initialMaxChars - updatedCharCount);

        // Prevent input beyond the initial character limit
        if (updatedCharCount > initialMaxChars) {
            searchInput.value = searchInput.value.substring(0, initialMaxChars);
            updatedCharCount = searchInput.value.length; // Recalculate after trimming
        }

        // Update the character counter
        charCounter.textContent = `Character count: ${updatedCharCount} / ${remainingChars}`;
        charCounter.style.color = remainingChars <= 0 ? "red" : "black";
    });

    // Handle Enter key press
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission behavior
            handleSearch(searchInput.value.trim());
        }
    });

    // Search button click handler
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.trim();
        if (!query) return;

        if (searchInput.value.length > initialMaxChars) {
            alert(`Character limit exceeded! Maximum allowed is ${initialMaxChars}.`);
            return;
        }

        searchCount++;
        if (searchCount > maxSearchesBeforeRecaptcha) {
            showModalPopup();
        } else {
            handleSearch(query);
        }

        searchInput.value = ""; // Clear input field after submission
    });

    // Modal cancel button
    cancelButton.addEventListener("click", () => {
        modal.classList.add("hidden");
        overlay.classList.add("hidden");
    });

    // Modal proceed button
    proceedButton.addEventListener("click", () => {
        modal.classList.add("hidden");
        showRecaptchaPopup();
    });

    // Close Recaptcha popup
    closeRecaptcha.addEventListener("click", () => {
        recaptchaDiv.classList.add("hidden");
        overlay.classList.add("hidden");
    });

    // Handle Recaptcha success callback
    window.onRecaptchaSuccess = function () {
        console.log("reCAPTCHA verified!");
        recaptchaDiv.classList.add("hidden");
        overlay.classList.add("hidden");
    };

    // Handle search logic with loader and overlay visibility
    function handleSearch(query) {
        if (!query) {
            alert("Please enter a valid input.");
            return;
        }

        // Show loader and overlay when search starts
        loader.style.display = "block";


        fetch("/api/classify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                // Hide loader and overlay once the response is received
                loader.style.display = "none";

                console.log("API Response:", data);

                if (data.valid) {
                    resultDiv.innerHTML = `<p><strong>Category:</strong><br> ${data.category}</p>`;
                    gptResponse.innerHTML = `<p><strong>Response:</strong><br> ${data.gptResponse}</p>`;
                    resultDiv.classList.remove("hidden");
                    gptResponse.classList.remove("hidden");
                    smoothScrollUp();
                } else {
                    resultDiv.textContent = "This search is unrelated. Showing modal...";
                    resultDiv.classList.remove("hidden");
                    gptResponse.classList.add("hidden");
                    showModalPopup();
                }
            })
            .catch((err) => {
                // Hide loader and overlay if error occurs
                loader.style.display = "none";
                overlay.style.display = "none"; // Hide overlay

                console.error("Error:", err);
                resultDiv.textContent = "An error occurred. Please try again.";
                resultDiv.classList.remove("hidden");
                gptResponse.classList.add("hidden");
            });
    }

    // Show modal popup
    function showModalPopup() {
        modal.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }

    // Show Recaptcha popup
    function showRecaptchaPopup() {
        recaptchaDiv.classList.remove("hidden");
        overlay.classList.remove("hidden");
    }

    // Smooth scroll effect
    function smoothScrollUp() {
        mainContainer.style.transition = "transform 0.5s ease-in-out";
        mainContainer.style.transform = "translateY(-100px)";
        gptResponse.style.display = "block";
        resultDiv.style.display = "block";
        setTimeout(() => {
            mainContainer.style.transform = "translateY(-50px)";
        }, 500);
    }
});
