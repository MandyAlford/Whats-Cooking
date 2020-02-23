import './css/base.scss';
import $ from 'jquery';

import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';
import domUpdates from './domUpdates';

let ingredientData
let ingredientsData
let users
let ingredientsArchive = [];
let cookbook;
let cookbookArchive = [];
let user, pantry;

function getData(type) {
	const root = 'https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/';
	const url = `${root}${type}`;
	const promise = fetch(url)
	                .then(data => data.json());
	return promise;
}
// to do; refactor this so it isn't living in global scope
let recipes = getData('recipes/recipeData');
let ingredients = getData('ingredients/ingredientsData');
let userss = getData('users/wcUsersData');

Promise.all([recipes, ingredients, userss]).then(promises => {
  recipes = promises[0];
  ingredients = promises[1];
  userss = promises[2];
}).then(() => {
  users = userss.wcUsersData
  cookbook = new Cookbook(recipes.recipeData);
  onStartup(cookbook, cookbook.recipes, ingredients.ingredientsData, users)
  // greetUser();
}).catch(error => console.log(error.message));


let favButton = $('.view-favorites');
let homeButton = $('.home')
let cardArea = $('.all-cards');
let headerSearch = $('#search-input');
let searchText = headerSearch.val();
let viewToCookButton = $('#view-to-cook-button')
let postButton = $('.post-button')
let deleteButton = $('.delete-button');

headerSearch.on('keyup', () => domUpdates.searchByName(cookbook, user))
cardArea.on('click', () => domUpdates.cardButtonConditionals(cookbook, user, pantry, ingredientsArchive));
homeButton.on('click', () => domUpdates.cardButtonConditionals(cookbook, user, pantry, ingredientsArchive));
favButton.on('click', () => domUpdates.viewFavorites(user));
cardArea.on('click', () => {
	if ($(event.target).hasClass('close-btn')) {
		domUpdates.closeRecipe(cookbook)
	}
});
viewToCookButton.on('click', () => domUpdates.viewRecipesToCook(event, user));
postButton.on('click', () => pantry.postIngredient(user));
deleteButton.on('click', () => pantry.deleteIngredient(user));


function onStartup(cookbook, recipeData, ingredientData, users) {
	  let userId = (Math.floor(Math.random() * 49) + 1)
	  let newUser = users.find(user => {
	    return user.id === Number(userId);
	  });
	  user = new User(userId, newUser.name, newUser.pantry)
	  pantry = new Pantry(newUser.pantry)
	  cookbook.recipes = cookbook.recipes.map((recipe) => {
	    return new Recipe(recipe, ingredientData)
	  })
	  // domUpdates.populateCards(recipeData, user);
		ingredientsArchive = ingredientData;
		domUpdates.cardButtonConditionals(cookbook, user, pantry, ingredientsArchive)
	  domUpdates.greetUser(user);
	  cookbookArchive = cookbook;

	  domUpdates.searchByName(cookbook)

	}
