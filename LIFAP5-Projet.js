/* global downloadPromise uploadPromise resetPromise updatePromise */
/* see http://eslint.org/docs/rules/no-undef */

/************************************************************** */
/* CONSTANTES */
/************************************************************** */

const api_header = 'X-API-KEY';
const api_key_value = 'ad1939d50a6138a47ba4';
let headers = new Headers();
headers.set(api_header, api_key_value);

const base_url = "localhost:8888";
const local_todos = "./Projet-2018-todos.json";
const local_users = "./Projet-2018-users.json";

const url = 'http://localhost:8888/index.php/todos/';

const mon_todo = {
    'title': 'un nouveau todo',
    'desc': "Description du nouveau todo",
    'people': []
};

const data = JSON.stringify(mon_todo);

fetch(url, { method: 'GET', headers: headers})
    .then(function(response) {
        console.log("hey");
        if (response.ok) {

            return response.json();
        } else {
            console.log(`Erreur dans la requête ${url}: ${response.code}`);
            throw("Erreur lors de la requête sur le serveur");
        }
    })
    .then(function(todoEnJson) {
        // faireQuelqueChoseAvecLesDonnees(todoEnJson);
        console.log(todoEnJson);
        todoEnJson.map(showContent);


    });


function showContent(todoEnJson) {
    let temp = document.getElementsByTagName("template")[0];
    console.log(temp.content.querySelector('li'));
    temp.content.querySelector('li .content').innerHTML = todoEnJson['title'];
    temp.content.querySelector('li div div').id = todoEnJson['_id'];
    temp.content.querySelector('.expend').href = "#"+todoEnJson['_id'];
    temp.content.querySelector('#desc').innerHTML = todoEnJson['desc'];
    temp.content.querySelector('#deadline').innerHTML = todoEnJson['deadline'];
    temp.content.querySelector('#people').innerHTML = todoEnJson['people'];

    let clon = temp.content.cloneNode(true);
    document.getElementById(todoEnJson['status']).appendChild(clon);

}


////////////////////////////////////////////////////////////////////////////////
// ETAT : classe d'objet pour gérer l'état courant de l'application
////////////////////////////////////////////////////////////////////////////////

function State(users = [], todos = [], filters = [], sort = "NONE"){
  this.users  = users;
  this.todos  = todos;
  this.filters = filters;
  this.sort   = sort;

  //returns the JSON object of a user
  this.get_user_info = (user_id) => {
    return this.users.find((o)=>o['_id']===user_id);
  };

  //returns the TODO objects created by a user
  this.get_user_todos = (user_id) => {
    console.debug(`get_user_todos(${user_id})`); // with ${this.todos}
    const result = this.todos.filter( o => o['createdBy']===user_id );
    return result;
  };

  //returns the TODO objects where a user is mentioned
  this.get_mentioned_todos = (user_id) => {
    let mentioned_todos = [];
    return mentioned_todos;
  };
}//end State


////////////////////////////////////////////////////////////////////////////////
// OUTILS : fonctions outils, manipulation et filtrage de TODOs
////////////////////////////////////////////////////////////////////////////////


function showTodo()
{
        if(document.getElementById("TodoId").style.visibility=="visible") {
            document.getElementById("TodoId").style.visibility = "collapse";
            document.getElementById("butontodo").style.color = "grey";
        }
        else {
            document.getElementById("TodoId").style.visibility = "visible";
            document.getElementById("butontodo").style.color = "red";
        }
}
function showDoing()
{

    if(document.getElementById("DoingId").style.visibility=="visible") {
        document.getElementById("DoingId").style.visibility = "collapse";
        document.getElementById("butondoing").style.color = "grey";
    }
    else {
        document.getElementById("DoingId").style.visibility = "visible";
        document.getElementById("butondoing").style.color = "red";
    }
}
function showDone()
{
    if(document.getElementById("DoneId").style.visibility=="visible") {
        document.getElementById("DoneId").style.visibility = "collapse";
        document.getElementById("butondone").style.color = "grey";
    }
    else {
        document.getElementById("DoneId").style.visibility = "visible";
        document.getElementById("butondone").style.color = "red";
    }
}

function addFunction() {
        let liste= document.createElement("li");
        let div = document.createElement("div");
        let div2 = document.createElement("div");
        let p1 =document.createElement("p");
        let p2 =document.createElement("p");
        let p3 =document.createElement("p");
        let test="list";
    		test +=document.getElementById("upload-state").value;
        let id=document.getElementById(test).getElementsByTagName("li").length+1;
        liste.className="list-group-item";
		    liste.innerHTML=document.getElementById("upload-desc").value;
		    div.className="item-option";
        let divid="collapse"
        divid+=id;
        divid+=document.getElementById("upload-state").value;
        div2.id=divid;
        div2.className="panel-collapse collapse";
        div2.setAttribute("role","tabpanel");
        div2.setAttribute("aria-labelledby","headingTwo");
        p1.innerHTML=document.getElementById("upload-mentioned").value;
        p2.innerHTML=document.getElementById("upload-deadline").value;
        p3.innerHTML=document.getElementById("upload-state").value;
        div2.appendChild(p1);
        div2.appendChild(p2);
        div2.appendChild(p3);
        div.innerHTML = "<a role=\"button\" class=\"nav-link\" data-toggle=\"collapse\" href=\"#"+divid+"\" aria-expanded=\"true\" aria-controls="+divid+" class=\"trigger collapsed\"><i class=\"fal fa-arrows-alt\"></i></a><a role=\"button\" onclick=\"editTodo(this)\" data-toggle=\"modal\" data-target=\"#modifieModal\"><i class=\"fas fa-edit\"></i></a><a role=\"button\" class=\"nav-link\" onclick='DeleteTodo(this,this.parentNode.parentNode.parentNode.id)'><i class=\"fas fa-trash-alt\"></i></a>"
        div.appendChild(div2);
        liste.appendChild(div);
        document.getElementById(test).appendChild(liste);
}

function DeleteTodo(test,frome){
	document.getElementById(frome).removeChild(test.parentNode.parentNode);
}

let donnee;
function editTodo(test){
		    document.getElementById("upload-desc2").value = test.parentNode.parentNode.innerHTML.split('<',1)[0];
        document.getElementById("upload-mentioned2").value = test.parentNode.childNodes[3].childNodes[0].innerHTML;
        document.getElementById("upload-deadline2").value = test.parentNode.childNodes[3].childNodes[1].innerHTML;
        document.getElementById("upload-state2").value = test.parentNode.childNodes[3].childNodes[2].innerHTML;
        donnee = test;
}


function valide()
{
  if(donnee.parentNode.childNodes[3].childNodes[2].innerHTML==document.getElementById("upload-state2").value)
  {
    donnee.parentNode.childNodes[3].childNodes[0].innerHTML=document.getElementById("upload-mentioned2").value;
    donnee.parentNode.childNodes[3].childNodes[1].innerHTML=document.getElementById("upload-deadline2").value;
    donnee.parentNode.childNodes[3].childNodes[2].innerHTML=document.getElementById("upload-state2").value ;
    donnee.parentNode.parentNode.innerHTML=document.getElementById("upload-desc2").value+'<div class="item-option"><a role="button"'+donnee.parentNode.parentNode.innerHTML.split('<div class="item-option"><a role="button"',2)[1];
  }
  else{
    let liste= document.createElement("li");
    let div = document.createElement("div");
    let div2 = document.createElement("div");
    let p1 =document.createElement("p");
    let p2 =document.createElement("p");
    let p3 =document.createElement("p");
    let test="list";
    test +=document.getElementById("upload-state2").value;
    let id=document.getElementById(test).getElementsByTagName("li").length+1;
    liste.className="list-group-item";
    liste.innerHTML=document.getElementById("upload-desc2").value;
    div.className="item-option";
    let divid="collapse"
    divid+=id;
    divid+=document.getElementById("upload-state2").value;
    div2.id=divid;
    div2.className="panel-collapse collapse";
    div2.setAttribute("role","tabpanel");
    div2.setAttribute("aria-labelledby","headingTwo");
    p1.innerHTML=document.getElementById("upload-mentioned2").value;
    p2.innerHTML=document.getElementById("upload-deadline2").value;
    p3.innerHTML=document.getElementById("upload-state2").value;
    div2.appendChild(p1);
    div2.appendChild(p2);
    div2.appendChild(p3);
    div.innerHTML = "<a role=\"button\" class=\"nav-link\" data-toggle=\"collapse\" href=\"#"+divid+"\" aria-expanded=\"true\" aria-controls="+divid+" class=\"trigger collapsed\"><i class=\"fal fa-arrows-alt\"></i></a><a role=\"button\" onclick=\"editTodo(this)\" data-toggle=\"modal\" data-target=\"#modifieModal\"><i class=\"fas fa-edit\"></i></a><a role=\"button\" class=\"nav-link\" onclick='DeleteTodo(this,this.parentNode.parentNode.parentNode.id)'><i class=\"fas fa-trash-alt\"></i></a>"
    div.appendChild(div2);
    liste.appendChild(div);
    document.getElementById(test).appendChild(liste);
    DeleteTodo(donnee,donnee.parentNode.parentNode.parentNode.id);
  }
}


////////////////////////////////////////////////////////////////////////////////
// RENDU : fonctions génération de HTML à partir des données JSON
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// HANDLERS : gestion des évenements de l'utilisateur dans l'interface HTML
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// FETCH Fonction permettant de charger des données asynchrones
////////////////////////////////////////////////////////////////////////////////
/*function get_local_todos() {
  return fetch(local_todos)
    .then(response => response.text())
}

function get_local_users() {
  return fetch(local_users)
    .then(response => response.text())
}

function import_json()
{
  get_local_todos()
  .then((result) => {
    result = JSON.parse(result);
    console.log(result);
    $("#todo1").text(result[0]["title"]);
  });
}
import_json();*/

/************************************************************** */
/** MAIN PROGRAM */
/************************************************************** */
/*document.addEventListener('DOMContentLoaded', function(){
  let state = {};

  // garde pour ne pas exécuter dans la page des tests unitaires.
  if (document.getElementById("title-test-projet") == null) {

    Promise.all([get_local_users(),get_local_todos()])
    .then(values => values.map(JSON.parse))
    .then(values => new State(values[0], values[1]))
    .then(state => state.get_user_todos('romuald'))
    .then(todos => todos.map(x => x['title']))
    .then(todos => console.log(todos))
    .catch(reason => console.error(reason));
  }
// }, false);*/