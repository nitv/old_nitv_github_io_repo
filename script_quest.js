var app = document.getElementById("app_image");
var ad = document.getElementById("ad_image");
var appDiv = document.getElementsByClassName("appContainer")[0];
var adDiv = document.getElementsByClassName("adContainer")[0];
var introDiv = document.getElementsByClassName("introText")[0];
var questDiv = document.getElementsByClassName("questions")[0];
var outerCont = document.getElementsByClassName("outerContainer")[0];
var quesForm = document.createElement("form");

var maxScreens = 2;
var screenNo = 0;
var comboId;
var appWidth;
var appHeight;
var appDivWidth;
var appDivHeight;
var appRatio;
var appArea;
var adWidth;
var adHeight;
var adDivWidth;
var adDivHeight;
var adRatio;
var adArea;
var combos = [];
var pageState = -1;
var stateNames = ['intro', 'app+image', 'app-only', 'questionnaire'];
var numStates = 3;
var comboIdArray = [];
var currentComboIdIdx = 0;

console.log = function(){}

$.ajax({
    type: "GET",
    url: "combosquestions.txt",
    dataType: "json",
    success: function(json) {
        for (i=0; i < $(json).length; i++) {
            var combo = {};
            //console.log($(json)[i].id, $(json)[i].appURI, $(json)[i].adURI, $(json)[i].adpos);
            combo.id = $(json)[i].combo;
            combo.appURI = $(json)[i].images.appURI;
            combo.adURI = $(json)[i].images.adURI;
            combo.adpos = $(json)[i].images.adpos;
            combo.questions = [];
            for (j=0; j < $(json)[i].questions.length; j++){
                var question = {};
                question.id = $(json)[i].questions[j].id;
                question.ques = $(json)[i].questions[j].ques;
                question.choices = $(json)[i].questions[j].choices;
                combo.questions.push(question);
            }
            combos.push(combo);
        }
    
        console.log(combos);    
        comboIdArray = create_unique_random_array(maxScreens, 0, maxScreens - 1);
        console.log(comboIdArray);
    }
})

// RETURNS PSEUDO-RANDOM NUMBER IN RANGE min...max
function random_number(min,max) {
    return (Math.round((max-min) * Math.random() + min));
}

function create_unique_random_array(num_elements, min, max) {
    var temp, nums = new Array;

    for (var element=0; element<num_elements; element++) {
        //IMPORTANT: DON'T FORGET THE SEMI-COLON AT THE END
        while((temp=number_found(random_number(min,max),nums))==-1);
        nums[element] = temp;
    }

    return (nums);
}

function number_found (random_number, number_array) {
    for (var element=0; element<number_array.length; element++) {
        if (random_number==number_array[element]) {
            return (-1);
        }
    }

    return (random_number);
}

function getAppImageDimensions()
{
    var tempImg = document.getElementById("app_image");
    appWidth = parseInt(tempImg.naturalWidth);
    appHeight = parseInt(tempImg.naturalHeight);
    appRatio = appWidth / appHeight;
    
    if (appRatio > 1){ //landscape
        appDiv.style = "width: 572px; height: 322px; display: table-cell; margin: 22% auto; z-index: 15; position: relative; left: 164px; top: 139px;";
    } else { //portrait
        appDiv.className = "appImage";
    }
}

function getNextImage()
{
    comboId = comboIdArray[currentComboIdIdx];
    currentComboIdIdx = (currentComboIdIdx + 1) % 5;
    $("#app_image").attr('src', combos[comboId].appURI);
    app.onload = getAppImageDimensions;
    $("#ad_image").attr('src', combos[comboId].adURI).attr('class', combos[comboId].adpos);
}

function askQuestions()
{
    var question;
    quesForm = document.createElement("form");
    for (i=0; i < combos[comboId].questions.length; i++){
        question = document.createElement("p");
        question.setAttribute("id", combos[comboId].questions[i].id);
        question.className = "questionText";
        var textNode = document.createTextNode("Question " + (i+1).toString() + ":  " + combos[comboId].questions[i].ques);
        question.appendChild(textNode);
        quesForm.appendChild(question);
        quesForm.appendChild(document.createElement("p"));
    
        for (j=0; j < combos[comboId].questions[i].choices.length; j++){
            choice = document.createElement("input");
            choice.type = "radio";
            choice.name = combos[comboId].questions[i].id;
            choice.setAttribute("value", combos[comboId].questions[i].choices[j]);
            var choiceLabel = document.createElement("label");
            var choiceText = document.createTextNode(combos[comboId].questions[i].choices[j]);
            choiceLabel.appendChild(choiceText);
            choiceLabel.setAttribute("class", "choiceLabels");
            console.log(combos[comboId].questions[i].choices[j]);
            choiceLabel.appendChild(choice);
            quesForm.appendChild(choiceLabel);
        }
        //question.appendChild(answers);
    }
    var submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Submit";
    submitBtn.className = "submitBtn";
    quesForm.appendChild(document.createElement("p"));
    quesForm.appendChild(submitBtn);

    if (quesForm.attachEvent){
        quesForm.attachEvent("submit", handleFormData);
    } else {
        quesForm.addEventListener("submit", handleFormData);
    }

    questDiv.appendChild(quesForm);
}

function recordAnswers(answers)
{
    console.log(answers);
    //alert(answers.comboId);
    $.get("http://vermaverick.com/testapp/response.php", {data: JSON.stringify(answers)}, function (results){
        //alert(results)
    });
    screenNo += 1;
}

function handleFormData(e){
    var questCounter = 0;
    var numQuestions = combos[comboId].questions.length;
    var answerArray = [];

    //answerArray.push({"comboId": comboId});
    if (e.preventDefault) e.preventDefault();
    
    var answerObj = {};
    answerObj.comboId = comboId;
    console.log("handling form data");
    for (i=0; i<quesForm.elements.length; i++){
        if(quesForm.elements[i].checked == true){
            console.log("Question: ", combos[comboId].questions[questCounter].ques);
    //        quesAnsPair.quesId = questCounter;
            console.log("your answer: ", quesForm.elements[i].value);
    //        quesAnsPair.answerId = combos[comboId].questions[questCounter].choices.indexOf(quesForm.elements[i].value);
            var quesAnsPair = {quesId: questCounter, answerId: combos[comboId].questions[questCounter].choices.indexOf(quesForm.elements[i].value)};
            console.log(quesAnsPair);
            questCounter += 1;
            answerArray.push(quesAnsPair);
        }
    }
    answerObj.answers = answerArray;
    console.log(answerObj); 
    console.log("questCounter, numQuestions =", questCounter, numQuestions);
    if (questCounter < numQuestions) {
        alert("Please answer all questions");
        return true;
    } else {
        recordAnswers(answerObj);
        questDiv.removeChild(quesForm);
        handleNextButton();
        return false;
    }
}

function validateForm()
{
    for (i=0; i < quesForm.elements[i].length; i++){
        if (quesForm.elements[i].value == null || quesForm.elements[i].value == ""){
            alert("Please answer all the questions");
            return false;
        }
    }
}

function handleNextButton()
{
    pageState = (pageState + 1) % numStates;

    if (pageState == 0) {
        introDiv.innerHTML = "<h1>Screen No. " + (screenNo + 1).toString() + "</h1><p>Please press 'Next'</p>";
        introDiv.style.display = "block";
        appDiv.style.display = "none";
        ad.style.display = "none";
        questDiv.style.display = "none";
        nextButton.style.display = "block";
    } else if (pageState == 1) {
        getNextImage();
        introDiv.style.display = "none";
        appDiv.style.display = "block";
        ad.style.display = "block";
    } else if (pageState == 2) {
        ad.style.display = "none";
        appDiv.style.display = "none";
        questDiv.style.display = "block";
        nextButton.style.display = "none";
        askQuestions();
    }
    
    console.log("current state: \n", pageState);
    
    if (screenNo == 5) {
        introDiv.innerHTML = "<h1>Thank you for your time. Have a nice day!</h1><br><p>Please close this browser window now.</p>";
        introDiv.style.display = "block";
        appDiv.style.display = "none";
        ad.style.display = "none";
        nextButton.style.display = "none";    
    }
}
