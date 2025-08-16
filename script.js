// initializing local storage
let recipeBookData = JSON.parse(localStorage.getItem("recipeBookData")) || [];

// targetting necessary elements
const title = document.querySelector("#title");
const allCards = document.querySelector("#allCards");
const recipeName = document.querySelector("#recipeName");
const emptySearch = document.querySelector("#emptySearch");
const recipeImage = document.querySelector("#recipeImage");
const addRecipeBtn = document.querySelector("#addRecipeBtn");
const btnClearForm = document.querySelector("#btnClearForm");
const addRecipeForm = document.querySelector("#addRecipeForm");
const allCardsTitle = document.querySelector("#allCardsTitle");
const closeModalBtn = document.querySelector("#closeModalBtn");
const noSearchFound = document.querySelector("#noSearchFound");
const recipeModalImg = document.querySelector("#recipeModalImg");
const addRecipeWrapper = document.querySelector("#addRecipeWrapper");
const recipeModalTitle = document.querySelector("#recipeModalTitle");
const recipeSearchForm = document.querySelector("#recipeSearchForm");
const recipeIngredients = document.querySelector("#recipeIngredients");
const recipeSearchInput = document.querySelector("#recipeSearchInput");
const recipeModalWrapper = document.querySelector("#recipeModalWrapper");
const deleteRecipeModalBtn = document.querySelector("#deleteRecipeModalBtn");
const allCardsResultsTitle = document.querySelector("#allCardsResultsTitle");
const recipeModalIngredients = document.querySelector("#recipeModalIngredients");
const recipePreparationSteps = document.querySelector("#recipePreparationSteps");
const recipeModalPreparationSteps = document.querySelector("#recipeModalPreparationSteps");

// function which toggle's add recipe form but adding/removing class
function toggleAddRecipeForm() {
    if (addRecipeWrapper.classList.contains("hideElement")) {
        addRecipeWrapper.classList.remove("hideElement");
    } else {
        addRecipeWrapper.classList.add("hideElement");
    }
};

// function which clears search input and add/remove class to hide/unhide unneccessary message
function clearSearch() {
    recipeSearchInput.value = "";
    emptySearch.classList.add("hideElement");
    noSearchFound.classList.add("hideElement");
    allCardsResultsTitle.classList.add("hideElement");
    allCardsTitle.classList.remove("hideElement");
};

// function which search recipe from the recipe book data
function searchRecipeBookData() {
    // add class to hide unneccessary message
    emptySearch.classList.add("hideElement");
    noSearchFound.classList.add("hideElement");
    if (recipeSearchInput.value.trim() === "") {
        // check if search input is empty and display error message
        emptySearch.classList.remove("hideElement");
        return;
    }

    // after filtering search input data, we store it in const variable
    const searchRecipeBookData = recipeBookData.filter((recipeData) => recipeData.recipeName.trim().includes(recipeSearchInput.value));

    // conditional to display recipe book data or error message
    if (searchRecipeBookData.length > 0) {
        allCardsTitle.classList.add("hideElement");
        allCardsResultsTitle.classList.remove("hideElement");
        displayAllRecipes(searchRecipeBookData, false);
    }
    else {
        allCards.innerHTML = "";
        allCardsTitle.classList.add("hideElement");
        allCardsResultsTitle.classList.add("hideElement");
        noSearchFound.classList.remove("hideElement");
    }
};

// function which returns promise to handle image
function handleImage(input) {
    return new Promise((resolve, reject) => {
        if (!(input instanceof File)) {
            reject(new Error("Input is not a File"));
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            resolve({
                base64: e.target.result, // Base64 string
                type: input.type, // MIME type
                name: input.name, // File name
                size: input.size, // File size in bytes
            });
        };

        reader.onerror = function () {
            reject(new Error("Error reading file"));
        };

        reader.readAsDataURL(input);
    });
};

// function which display single recipe card
function displayRecipeCard(recipeData) {
    // create p tag and add inner text & class
    const cardTitle = document.createElement("p");
    cardTitle.innerText = recipeData.recipeName;
    cardTitle.className = "recipeCardTitle";

    // create img tag and add src, alt & class
    const cardImg = document.createElement("img");
    cardImg.src = recipeData.recipeImage;
    cardImg.alt = recipeData.recipeName;
    cardImg.className = "recipeCardImg";

    // create button tag and add inner text & class
    const cardBtn = document.createElement("button");
    cardBtn.innerText = "See Complete Recipe";
    cardBtn.className = "recipeCardBtn";

    // create div tag and add id & class
    const cardBody = document.createElement("div");
    cardBody.id = recipeData.id;
    cardBody.className = "recipeCard";

    // add all elements to parent
    cardBody.append(cardTitle);
    cardBody.append(cardImg);
    cardBody.append(cardBtn);

    // add cardBody to all cards wrapper
    allCards.append(cardBody);
};

// function which display all recipe's cards 
function displayAllRecipes(recipeBookData, clearSearchForm = true) {
    // condition to clear search form
    clearSearchForm && clearSearch();
    // clears the recipe list wrapper    
    allCards.innerHTML = "";
    if (recipeBookData.length === 0) {
        // check recipe list data length and display message
        noSearchFound.classList.remove("hideElement");
        allCardsTitle.classList.add("hideElement");
    }
    else {
        // add class to hide unneccessary message
        noSearchFound.className = "hideElement";
        // loop to iterate over recipe book data
        for (let i = 0; i < recipeBookData.length; i++) {
            displayRecipeCard(recipeBookData[i]);
        }
    }
};

// call display all recipes function to initalize recipe book
displayAllRecipes(recipeBookData);

// add eventlistener to refresh the recipe book app
title.addEventListener("click", () => {
    displayAllRecipes(recipeBookData);
    addRecipeWrapper.classList.add("hideElement");
});

// add eventlistener to toggle add recipe form
addRecipeBtn.addEventListener("click", () => {
    toggleAddRecipeForm();
});

// add eventlistener to clear add recipe form input data
btnClearForm.addEventListener("click", () => {
    recipeName.value = recipeIngredients.value = recipePreparationSteps.value = recipeImage.value = "";
});

// add eventlistener to close recipe modal
closeModalBtn.addEventListener("click", () => {
    recipeModalWrapper.className = "hideElement";
});

// add eventlistener to search recipe from recipe book data
recipeSearchForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    searchRecipeBookData();
});

// add eventlistener to add recipe and save it to local storage
addRecipeForm.addEventListener("submit", async (evt) => {
    // stop the page from refreshing
    evt.preventDefault();
    // get first selected image
    const file = recipeImage.files[0];
    // stop and return if there is no image uploaded
    if (!file) {
        alert("Please upload an image!");
        return;
    }

    // try/catch for handle image promise function 
    try {
        // waiting for handle image promise function to return image data and then storing it in const variable
        const imgData = await handleImage(file);
        // add recipe data to local array
        recipeBookData.push({
            id: crypto.randomUUID(),
            recipeName: recipeName.value,
            recipeIngredients: recipeIngredients.value,
            recipePreparationSteps: recipePreparationSteps.value,
            recipeImage: imgData.base64,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        // store recipe book data to local storage
        localStorage.setItem("recipeBookData", JSON.stringify(recipeBookData));
        // clear add recipe form input data
        recipeName.value = recipeIngredients.value = recipePreparationSteps.value = recipeImage.value = "";
        // hiding recipe form by toggle function
        toggleAddRecipeForm();
        // display all recipe's with updated data
        displayAllRecipes(recipeBookData);
    } catch (err) {
        // logging error if there
        console.error(err);
    }
});

// add eventlistener to populate recipe data in recipe modal
allCards.addEventListener("click", (evt) => {
    // extracting recipe id
    const recipeId = evt.target.parentElement.id;
    // finding recipe from recipe book data using recipe id
    const recipeData = recipeBookData.filter((recipe) => recipe.id === recipeId)[0];

    // if found recipe then we populate recipe data in recipe modal
    if (recipeData) {
        recipeModalWrapper.classList.remove("hideElement");
        deleteRecipeModalBtn.children[0].id = recipeData.id;
        recipeModalTitle.innerText = recipeData.recipeName;
        recipeModalIngredients.innerText = recipeData.recipeIngredients;
        recipeModalPreparationSteps.innerText = recipeData.recipePreparationSteps;
        recipeModalImg.src = recipeData.recipeImage;
        recipeModalImg.alt = recipeData.recipeName;
    }
});

// add eventlistener to delete recipe from recipe book data
deleteRecipeModalBtn.addEventListener("click", (evt) => {
    // conditional to check if mouse click was correct    
    if (evt.target.id === "deleteRecipeModalBtn") {
        // target recipe id to be removed
        const removeRecipe = evt.target.children[0].id;
        // after filtering recipe data to be removed, we store rest data in const variable
        const updatedRecipeBookData = recipeBookData.filter((recipeData) => recipeData.id !== removeRecipe);
        // update recipe book data to local array
        recipeBookData = updatedRecipeBookData;
        // store recipe book data to local storage        
        localStorage.setItem("recipeBookData", JSON.stringify(recipeBookData));
        // call display all recipes function to display updated recipe's        
        displayAllRecipes(recipeBookData);
        recipeModalWrapper.className = "hideElement";
    }
});