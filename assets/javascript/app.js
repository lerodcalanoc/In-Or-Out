$(document).ready(function () {

    var apiKey = "81c527acf8813ceb9ac2721483d87f9a";

    var searchValid;
    function searchValidate() {
        var alertText = "";
        var searchField = $("#search-bar").val();
        if (searchField = "" || !isNaN(searchField)) {
            alertText = "Please input a food to search for!";
            searchValid = false;
        }
        else {
            searchValid = true;
        }
        $("#alert-text").text(alertText);
    }

    $("#add-food").on("click", function (event) {
        event.preventDefault();

        //this gets the options for different recipes
        searchValidate();
        if (searchValid === true) {
            var ingredient = $("#search-bar").val().trim();
            var queryURL = "https://www.food2fork.com/api/search?key=" + apiKey + "&q=" + ingredient + "&sort=r&page=2";
            console.log(queryURL);

            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                $(".jumbotron").empty();
                var result = JSON.parse(response);
                console.log(result);

                for (var i = 0; i < 10; i++) {
                    var buttonTitle = result.recipes[i].title;
                    console.log(buttonTitle);
                    var recipeID = result.recipes[i].recipe_id;
                    // console.log(recipeID);
                    var newButton = $("<button>").attr("class", "choices").text(buttonTitle);
                    newButton.attr("data-recipe", recipeID)
                    $(".jumbotron").prepend(newButton);
                }
            });
        };
    });

    // gets recipe ID to get recipes for user's choice on F2F
    $(document).on("click", ".choices", getRecipes);
    function getRecipes() {
        var recipeID = $(this).attr("data-recipe");
        console.log(recipeID);
        var queryURL = "https://www.food2fork.com/api/get?key=" + apiKey + "&rId=" + recipeID + "&sort=r";

        $.ajax({
            url: queryURL,
            method: "GET"

        }).then(function (response) {
            var result = JSON.parse(response);
            console.log(result);
            var imageURL = result.recipe.image_url;
            var ingredients = result.recipe.ingredients;

            var recipeCalories = 0;
            var recipeCholesterol = 0;
            var recipeDietaryFiber = 0;
            var recipeTotalFat = 0;
            var recipeTransFat = 0;
            var recipeSatFat = 0;
            var recipeSodium = 0;
            var recipeCarbs = 0;
            var recipeSugars = 0;
            var recipeProtein = 0;

            $.ajax({
                url: "https://trackapi.nutritionix.com/v2/natural/nutrients",
                headers: {
                    'Content-Type': 'application/json',
                    'x-app-id': '9d90687a',
                    'x-app-key': 'ce2d2319cdcd23cd6bf1f7cc07da62b9',
                    'x-remote-user-id': 0
                },
                data: JSON.stringify({
                    query: ingredients.join(', ')
                }),
                method: "POST"
            }).done(function (response) {
                console.log(response.foods)
                for (var i = 0; i < response.foods.length; i++) {
                    recipeCalories = parseInt(recipeCalories + response.foods[i].nf_calories);
                    recipeCholesterol = parseInt(recipeCholesterol + response.foods[i].nf_cholesterol);
                    recipeDietaryFiber = parseInt(recipeDietaryFiber + response.foods[i].nf_dietary_fiber);
                    recipeTotalFat = parseInt(recipeTotalFat + response.foods[i].nf_total_fat);
                    recipeTransFat = parseInt(recipeTransFat + response.foods[i].nf_trans_fat);
                    recipeSatFat = parseInt(recipeSatFat + response.foods[i].nf_saturated_fat);
                    recipeSodium = parseInt(recipeSodium + response.foods[i].nf_sodium);
                    recipeCarbs = parseInt(recipeCarbs + response.foods[i].nf_total_carbohydrate);
                    recipeSugars = parseInt(recipeSugars + response.foods[i].nf_sugars);
                    recipeProtein = parseInt(recipeProtein + response.foods[i].nf_protein);
                }
                $(".jumbotron").empty();
                $("#recipe-calories").text(recipeCalories);
                $("#recipe-cholesterol").text(recipeCholesterol);
                $("#recipe-dietary-fiber").text(recipeDietaryFiber)
                $("#recipe-total-fat").text(recipeTotalFat);
                $("#recipe-trans-fat").text(recipeTransFat);
                $("#recipe-sat-fat").text(recipeSatFat);
                $("#recipe-sodium").text(recipeSodium);
                $("#recipe-total-carbs").text(recipeCarbs);
                $("#recipe-sugars").text(recipeSugars);
                $("#recipe-protein").text(recipeProtein);
                
            });
        });
    };


    $(document).on("click", ".choices", getMenuItem);

    function getMenuItem() {
        var menuItem = $(this).text();
        // console.log(menuItem);
        $.ajax({
            url: "https://trackapi.nutritionix.com/v2/search/instant",
            headers: {
                "x-app-id": "9d90687a",
                "x-app-key": "ce2d2319cdcd23cd6bf1f7cc07da62b9"
            },
            data: {
                query: menuItem,
                "branded": true,
                "branded_type": 1,
                "detailed": true,
                "common": false,
            },
            method: "POST"
        }).then(function (response) {
            var item = response;
            console.log(item);

            var i = Math.floor(Math.random() * 19);
            console.log(i);

            var restaurant = item.branded[i].brand_name;
            var menuItemName = item.branded[i].food_name;

            console.log(restaurant);
            console.log(menuItemName);

            if (item.branded[i].full_nutrients.length == 14) {
                var sodium = item.branded[i].full_nutrients[8].value;
                var cholestrol = item.branded[i].full_nutrients[11].value;
                var transFat = item.branded[i].full_nutrients[12].value;
                var satFat = item.branded[i].full_nutrients[13].value;
                var satPerc = Math.round((20 / satFat) * 100);
                var cholPerc = Math.round((300 / cholestrol) * 100);
                var sodPerc = Math.round((2400 / sodium) * 100);
                $(".nutxSod").html(sodium);
                $(".nutxSodPerc").html(sodPerc);
                $(".nutxChol").html(cholestrol);
                $(".nutxCholPerc").html(cholPerc);
                $(".nutxTrans").html(transFat);
                $(".nutxSatFat").html(satFat);
                $(".nutxSatPerc").html(satPerc);
            };

            if (item.branded[i].full_nutrients.length == 10) {
                var sodium = item.branded[i].full_nutrients[6].value;
                var cholestrol = item.branded[i].full_nutrients[7].value;
                var transFat = item.branded[i].full_nutrients[8].value;
                var satFat = item.branded[i].full_nutrients[9].value;
                var satPerc = Math.round((20 / satFat) * 100);
                var cholPerc = Math.round((300 / cholestrol) * 100);
                var sodPerc = Math.round((2400 / sodium) * 100);

                $(".nutxSod").html(sodium);
                $(".nutxSodPerc").html(sodPerc);
                $(".nutxChol").html(cholestrol);
                $(".nutxCholPerc").html(cholPerc);
                $(".nutxTrans").html(transFat);
                $(".nutxSatFat").html(satFat);
                $(".nutxSatPerc").html(satPerc);
            };

            var protein = item.branded[i].full_nutrients[0].value;
            var totalFat = item.branded[i].full_nutrients[1].value;
            var totalCarbohydrates = item.branded[i].full_nutrients[2].value;
            var calories = item.branded[i].full_nutrients[3].value;
            var sugars = item.branded[i].full_nutrients[4].value;
            var dietaryFiber = item.branded[i].full_nutrients[5].value;
            // var sodium = item.branded[i].full_nutrients[6].value;
            // var cholestrol = item.branded[i].full_nutrients[7].value;
            // var transFat = item.branded[i].full_nutrients[8].value;
            // var satFat = item.branded[i].full_nutrients[9].value;
            var servingQuantiy = item.branded[i].serving_qty;
            var servingUnit = item.branded[i].serving_unit;
            var calFromFat = totalFat * 9;
            var fatPerc = Math.round((65 / totalFat) * 100);
            // var satPerc = Math.round((20 / satFat) * 100);
            // var cholPerc = Math.round((300 / cholestrol) * 100);
            // var sodPerc = Math.round((2400 / sodium) * 100);
            var carbPerc = Math.round((300 / totalCarbohydrates) * 100);
            var fiberPerc = Math.round((25 / dietaryFiber) * 100);


            $(".nutritionixServing").html("Serving Size " + servingQuantiy + " " + servingUnit);
            $(".nutxCalories").html("<b>Calories </b>" + calories);
            $(".nutxTotalFat").html(totalFat);
            $(".nutxFatPerc").html(fatPerc);
            $(".nutxCalFromFat").html("<b>" + calFromFat + "</b>");
            // $(".nutxSatFat").html(satFat);
            // $(".nutxSatPerc").html(satPerc);
            // $(".nutxTrans").html(transFat);
            // $(".nutxChol").html(cholestrol);
            // $(".nutxCholPerc").html(cholPerc);
            // $(".nutxSod").html(sodium);
            // $(".nutxSodPerc").html(sodPerc);
            $(".nutxCarb").html(totalCarbohydrates);
            $(".nutxCarbPerc").html(carbPerc);
            $(".nutxFiber").html(dietaryFiber);
            $(".nutxFiberPerc").html(fiberPerc);
            $(".nutxSugar").html(sugars);
            $(".nutxProtein").html(protein);
            // var fullNurtients = item.branded[i].full_nutrients;
            // console.log(fullNurtients);

        })
    };
});