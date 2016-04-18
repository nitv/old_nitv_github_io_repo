var mainContainer;
var imgContainer;
var appImage;
var adContainer;
var adImage;
var controlContainer;
var nextButton;
var introContainer;
var formContainer;
var state = 0;
var numStates = 3;

function init()
{
    console.log("document loaded");
    mainContainer = document.getElementsByClassName("mainContainer")[0];
    imgContainer = document.getElementsByClassName("imgContainer")[0];
    appImage = document.getElementById("appImage");
    adContainer = document.getElementsByClassName("adContainer")[0];
    adImage = document.getElementById("adImage");
    controlContainer = document.getElementsByClassName("controlContainer")[0];
    nextButton = document.getElementById("nextButton");
    introContainer = document.getElementsByClassName("introContainer")[0];
    formContainer = document.getElementsByClassName("formContainer")[0];
}

function handleNextButton()
{
    if (state == 0) {
        console.log("you clicked!");
        introContainer.style.display = "none";
        imgContainer.style.display = "block";
        adContainer.classList.add("adTop");
        //adContainer.style.display = "block";
        
        state = (state + 1) % numStates;
    } else if (state == 1) {
        imgContainer.style.display = "none";
        formContainer.style.display = "block";
        nextButton.style.display = "none";
    }
}