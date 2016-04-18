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
var combos = [];
var comboId;
var comboIdArray = [];
var currentComboIdIdx = 0;
var maxScreens = 2;
var screenNo = 0;

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
                console.log(combo.questions);
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

function getNextImage()
{
    comboId = comboIdArray[currentComboIdIdx];
    currentComboIdIdx = (currentComboIdIdx + 1) % 5;
    $("#appImage").attr('src', combos[comboId].appURI);
    $("#adImage").attr('src', combos[comboId].adURI).attr('class', combos[comboId].adpos);
}

function askQuestions()
{
    var question;
    quesForm = document.createElement("form");
    quesForm.setAttribute("id", "quesForm");
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
            choice.setAttribute("id", "choice"+i.toString()+j.toString())
            var choiceLabel = document.createElement("label");
            var choiceText = document.createTextNode(combos[comboId].questions[i].choices[j]);
            choiceLabel.appendChild(choiceText);
            choiceLabel.setAttribute("class", "choiceLabels");
            choiceLabel.setAttribute("for", choice.getAttribute("id"))
            console.log(combos[comboId].questions[i].choices[j]);
            //choiceLabel.appendChild(choice);
            quesForm.appendChild(choice);
        }
        //question.appendChild(answers);
    }
    var submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Submit";
    submitBtn.className = "submitBtn";
    submitBtn.setAttribute("form", "quesForm");
    quesForm.appendChild(document.createElement("p"));
    controlContainer.appendChild(submitBtn);

    if (quesForm.attachEvent){
        quesForm.attachEvent("submit", handleFormData);
    } else {
        quesForm.addEventListener("submit", handleFormData);
    }

    formContainer.appendChild(quesForm);
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
            var quesAnsPair = {quesId: questCounter, answerId:      combos[comboId].questions[questCounter].choices.indexOf(quesForm.elements[i].value)};
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
        formContainer.removeChild(quesForm);
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

function recordAnswers(answers)
{
    console.log(answers);
    //alert(answers.comboId);
    $.get("http://vermaverick.com/testapp/response.php", {data: JSON.stringify(answers)}, function (results){
        //alert(results)
    });
    screenNo += 1;
}

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
        getNextImage();
        state = (state + 1) % numStates;
    } else if (state == 1) {
        imgContainer.style.display = "none";
        nextButton.style.display = "none";
        askQuestions();
        formContainer.style.display = "block";
        state = (state + 1) % numStates;
    } else if (state == 2) {
        mainContainer.remove();
        /*
        imgContainer.remove();
        appImage.remove();
        adContainer.remove();
        adImage.remove();
        introContainer.remove();
        formContainer.remove();
        */
        alert("Thank You");
    }
}