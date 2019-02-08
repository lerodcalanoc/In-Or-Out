$(document).ready(function () {

    $("#add-food").on("click", function (event) {
        event.preventDefault();

        //this gets the options for different recipes
        var ingredient = $("#search-bar").val().trim();
        var foods = [];
        var apiKey = "690178e9a1bd7c5314bc05fe6b77a9dd"
        var queryURL = "https://www.food2fork.com/api/search?key=" + apiKey + "&q=" + ingredient + "&sort=r&page=2";

        console.log(queryURL);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            $(".jumbotron").empty();
            var result = JSON.parse(response);
            console.log(result);

            for (var i = 0; i < result.recipes.length; i++) {
                var buttonTitle = result.recipes[i].title;
                console.log(buttonTitle);
                var recipeID = result.recipes[i].recipe_id;
                // console.log(recipeID);
                var newButton = $("<button>").attr("class", "choices").text(buttonTitle);
                newButton.attr("data-recipe", recipeID)
                $(".jumbotron").prepend(newButton);
            }
        });
    });
    // gets recipe ID to get recipes for user's choice on F2F
    $(document).on("click", ".choices", getRecipes);

    function getRecipes() {
        var recipe = $(this).attr("data-recipe");
        console.log(recipe);

        var queryURL = "https://www.food2fork.com/api/get?key=6085193110d842cc5f85203d6d4c5756&rId=" + recipe + "&sort=r";
        console.log(queryURL)
        $.ajax({
            url: queryURL,
            method: "GET"

        }).then(function (response) {
            var result = JSON.parse(response);
            console.log(result);

            var imageURL = result.recipe.image_url;
            console.log(imageURL);

            var ingredients = result.recipe.ingredients;
            console.log(ingredients);
        })
    };
    // $(document).on("click", "#add-food", getIngredient);
    // $("#choices").on("click", function () {

    // })
    function ingredientsCall() {
    $.ajax({
        url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
        headers: {
            "x-app-id": "9d90687a",
            "x-app-key": "ce2d2319cdcd23cd6bf1f7cc07da62b9",
            "x-remote-user-id": 0
        },
        "query": "chicken",
        method: "POST"
    }).then(function(response) {;
        var ingredientResponse = JSON.parse(response);
        console.log(ingredientResponse);
    })
    }
});
