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
var numStates = 2;
var combos = [];
var comboId;
var comboIdArray = [];
var currentComboIdIdx = 0;
var maxScreens = 1;
var screenNo = 1;

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
        comboIdArray = create_unique_random_array(1, 0, 4);
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

function getImages()
{
    comboId = comboIdArray[currentComboIdIdx];
    currentComboIdIdx = (currentComboIdIdx + 1) % 5;
    $("#appImage").attr('src', combos[comboId].appURI);
    $("#adImage").attr('src', combos[comboId].adURI).attr('class', combos[comboId].adpos);
}

function toggleQuestions()
{
    console.log("toggleQuestions");
    var elems = document.getElementById("quesForm").childNodes;
    console.log(elems, elems.length);
    
    if (document.getElementById("choice00").checked) {
        for (var elem=0; elem < elems.length; elem++) {
            console.log(elem, elems[elem]);
            elems[elem].style.display = "block";
        }
    } else {
        for (var elem=0; elem < elems.length; elem++) {
            if (elems[elem].getAttribute("id") != "ques0" && elems[elem].type != "submit") {
                elems[elem].style.display = "none";
            }
        }
    }
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
        var questDiv = document.createElement("div");
        questDiv.setAttribute("id", "ques" + combos[comboId].questions[i].id.toString());
        
        if (i == 0) {
            questDiv.style.display = "block";
        } else {
            questDiv.style.display = "none";
        }
        
        questDiv.appendChild(question);
        quesForm.appendChild(questDiv);
        //quesForm.appendChild(document.createElement("p"));
        
        for (j=0; j < combos[comboId].questions[i].choices.length; j++){
            choice = document.createElement("input");
            choice.type = "radio";
            choice.name = combos[comboId].questions[i].id;
            choice.setAttribute("value", combos[comboId].questions[i].choices[j]);
            choice.setAttribute("id", "choice"+i.toString()+j.toString());
            if (i == 0) { //attach an event handler to just the first question's answer options
                choice.onchange = toggleQuestions;
            }
            
            var choiceLabel = document.createElement("label");
            //var choiceText = document.createTextNode(combos[comboId].questions[i].choices[j]);
            //choiceLabel.appendChild(choiceText);
            choiceLabel.setAttribute("class", "choiceLabels");
            choiceLabel.setAttribute("for", choice.getAttribute("id"));
            choiceLabel.textContent = combos[comboId].questions[i].choices[j];
            //console.log(combos[comboId].questions[i].choices[j]);
            //choiceLabel.appendChild(choice);
            //if (i > 0) {
                /*Hide all options for all questions other than the first question.
                  Once the first question gets a 'Yes', all these reappear*/
            //    choice.style.display = "none";
            //    choiceLabel.style.display = "none";
                
                /*Hide all other questions other than the first.
                  Once someone answers a 'yes' to the first question, the rest of the questions would appear*/
            //    question.style.display = "none";
                
                //for (var hr in document.getElementsByTagName("hr")) {
                //    hr.style.display = "block";
                //}
            //}
            //choiceLabel.appendChild(document.createElement("br"));
            questDiv.appendChild(choice);
            questDiv.appendChild(choiceLabel);
            questDiv.appendChild(document.createElement("br"));
        }
        //question.appendChild(answers);
        if (i + 1 != combos[comboId].questions.length){
            //quesForm.appendChild(document.createElement("hr"));
        }
    }
    var submitBtn = document.createElement("input");
    submitBtn.type = "submit";
    submitBtn.value = "Submit";
    submitBtn.className = "submitBtn";
    submitBtn.setAttribute("form", "quesForm");
    //quesForm.appendChild(document.createElement("p"));
    //controlContainer.appendChild(submitBtn);
    quesForm.appendChild(submitBtn);

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
    var divs = quesForm.childNodes;
    //answerArray.push({"comboId": comboId});
    if (e.preventDefault) e.preventDefault();
    
    var answerObj = {};
    answerObj.comboId = comboId;
    console.log("handling form data");
    
    if (divs[0].children[4].checked) { //i.e. "No" is selected
        console.log("YAY!!!");
        var quesAnsPair = {quesId: 0, 
                           answerId: combos[comboId].questions[0].choices.indexOf(divs[0].childNodes[1].value)};
        answerArray.push(quesAnsPair);
        
        for (var i=1; i<numQuestions; i++) {
            quesAnsPair = {quesId: i, answerId: null};
            answerArray.push(quesAnsPair);
        }
        
        answerObj.answers = answerArray;
        recordAnswers(answerObj);
        formContainer.removeChild(quesForm);
        handleNextButton();
        return false;
    }
    
    for (var i=0; i<numQuestions; i++) {
        for (var j=0; j<divs[i].childNodes.length; j++){
            if (divs[i].childNodes[j].type == "radio" && divs[i].childNodes[j].checked == true) {
                var quesAnsPair = {quesId: questCounter,
                                    answerId: combos[comboId].questions[i].choices.indexOf(divs[i].childNodes[j].value)};
                answerArray.push(quesAnsPair);
                console.log("questCounter:", questCounter);
                questCounter += 1;
            }
        }
    }
    
    answerObj.answers = answerArray;
    console.log(answerObj);
    if (questCounter < numQuestions) {
        alert("Please answer all questions");
        return true;
    } else {
        recordAnswers(answerObj);
        formContainer.removeChild(quesForm); //remove the form
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
    $.get("response.php", {data: JSON.stringify(answers)}, function (results){
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
    if (state == 0) { //state with image displayed
        //console.log("you clicked!");
        introContainer.style.display = "none";
        imgContainer.style.display = "block";
        adContainer.classList.add("adTop");
        //adContainer.style.display = "block";
        getImages();
    } else if (state == 1) { //state with quiz sets. i.e. has substates.
        imgContainer.style.display = "none";
        //nextButton.style.display = "none";
        controlContainer.style.display = "none";
        askQuestions();
        formContainer.style.display = "block";
    }
    
    state = (state + 1) % numStates;
    
    if (screenNo < maxScreens) {
        screenNo += 1;
    } else if (state == 0){
        //destroy everything and say thank you!
        for (var i=0; i < mainContainer.childNodes.length; i++) {
            mainContainer.childNodes[i].remove();
        }
        if (screenNo == maxScreens) {
            var thankYouMsg = document.createElement("h1");
            thankYouMsg.textContent = "Thank You!";
            mainContainer.appendChild(thankYouMsg);
        }
    }
}
