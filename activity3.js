let username;
let dictionaryData;
let timer = 0;

let greetingsData = ['hey !', 'hi !', 'hello !', 'hows your day going ?', 'how are you ?', 'howdy partner !',
    '\'sup !', 'you seem happy, why is that ?', 'how are you ?', 'how is life ?', 'how are things ?',
    'how are you doing ?', 'are you doing good ?', 'are you fine ?', 'how is your day going ?',
    'how is your day ?', 'what\'s up !', 'whats up !', 'you good ?', 'how you doing ?'];


var userResponseText = null;
var elizaQuestionText = null;
var elizaResponseText = null;



function initLoad() {
    fetch('./default.json')
        .then((response) => response.json())
        .then((data) => {
            dictionaryData = data;
            console.log('Shubhangi initLoad', dictionaryData);
            console.log(dictionaryData);
        })
        .catch((error) => console.log(error));
    sessionStorage.setItem('history', []);
}

function resetTimerValue() {
    clearTimeout(timer);

    timer = window.setInterval(function () {
        let randomNum = Math.floor(Math.random() * Math.floor(dictionary.entries[dictionary.entries.length - 1].answer.length));
        alert(username + ", " + dictionary.entries[dictionary.entries.length - 1].answer[randomNum]);
    }, 30000);
}

function getUserName() {
    let userName = document.getElementById('username').value;
    if (!userName || userName.length == 0) {
        alert('Please enter your name!');
        return;
    }
    username = userName;
    sessionStorage.setItem('username',username)
    display();
}

function display() {

    let mainDiv = document.createElement('div');
    mainDiv.id = 'main';

    let greetingsDisplayDiv = document.createElement('div');
    greetingsDisplayDiv.id = 'greetingsDiv'

    let msgDisplayDiv = document.createElement('div');
    msgDisplayDiv.id = 'msgDiv';

    let msgHeader = document.createElement('p');
    msgHeader.textContent = username + ', ' + getRandomElement(greetingsData);

    greetingsDisplayDiv.appendChild(msgHeader);
    msgDisplayDiv.appendChild(greetingsDisplayDiv);

    mainDiv.appendChild(msgDisplayDiv);

    let msgInputDiv = document.createElement('div');
    msgInputDiv.id = 'msgInput-div';

    let msgInput = document.createElement('input');
    msgInput.id = 'msgInput';
    msgInput.type = 'text';
    msgInput.name = 'message';
    msgInputDiv.appendChild(msgInput);

    let submitButton = document.createElement('button');
    submitButton.class = "button";
    submitButton.id = 'submitBtn';
    submitButton.innerHTML = 'Send';
    submitButton.onclick = handleUserResponse;
    msgInputDiv.appendChild(submitButton);

    mainDiv.appendChild(msgInputDiv);

    document.getElementById('username_div').hidden = true;
    document.body.appendChild(mainDiv);
    

    
    let historyButton = document.createElement('button');
    historyButton.class = "button";
    historyButton.id = 'historyBtn';
    historyButton.innerHTML = 'Show History';
    historyButton.onclick = showHistory;
    mainDiv.appendChild(historyButton);

    let historyDiv = document.createElement('p');
    historyDiv.id = 'history-div';
    mainDiv.appendChild(historyDiv);

}

function showHistory() {
    //let history = JSON.parse(sessionStorage.getItem('history'));
    let html = ''
    
    html += "<p>User history: " +
    sessionStorage.getItem("username") + " - " + sessionStorage.getItem("userResponseText").toString() + " - " + sessionStorage.getItem("elizaResponseText").toString()  + " - " +sessionStorage.getItem("elizaQuestionText").toString() ;
  
    document.getElementById("history-div").innerHTML = html;
    sessionStorage.setItem('isHistoryShown', 'true');
    return false;
  }
function renderChat(user_input, response) {
    let greetingsDiv = document.getElementById('greetingsDiv');
    if (greetingsDiv) {
        greetingsDiv.remove();
    }

    let chatDiv = document.getElementById('msgDiv')


    userResponseText = document.createElement('p');


    userResponseText.textContent = username + ':\t' + user_input;
    chatDiv.appendChild(userResponseText);


    elizaResponseText = document.createElement('p');


    elizaResponseText.textContent = 'Eliza' + ':\t' + getRandomElement(response.answer);
    chatDiv.appendChild(elizaResponseText);


    elizaQuestionText = document.createElement('p');


    elizaQuestionText.textContent = 'Eliza' + ':\t' + getRandomElement(response.question);
    chatDiv.appendChild(elizaQuestionText);

    document.getElementById('msgInput').value = '';

    sessionStorage.setItem("userResponseText",userResponseText);
    sessionStorage.setItem("elizaResponseText",elizaResponseText);
    sessionStorage.setItem("elizaQuestionText",elizaQuestionText);

    resetTimerValue();

}
function handleUserResponse() {

    let user_input = document.getElementById('msgInput').value;

    if (!user_input || user_input.length == 0) {
        alert('Please enter some response!');
        return;
    }

    if (newJsonString(user_input)) {
        renderLearningAnnouncement("I just got smarter!");
    }
    else if (inputIsJson(user_input)) {
        renderLearningAnnouncement('Sorry, I can\'t understand that!');
    }
    else {
        let response = sendResponse(user_input.split(' '));
        renderChat(user_input, response);
    }
}

function sendResponse(user_inputTokens) {
    clearTimeout(timer);
    let tokens = [...user_inputTokens];
    return getResponse(tokens)
}

function getResponse(tokens) {
    const respData = {
        "key": ["other", "miscellaneous", "bored", "welcome", "new"],
        "answer": ["We should change the subject", "I agree", "Quid pro quo", "We should start anew"],
        "question": ["What is the weather outside?", "How is your day going?", "What do you think of me?", "Anything interesting going on?", "Is something troubling you?", "You seem happy, why is that?"]
    }
    while (tokens.length > 0) {
        let selectedTokenIndex = getRandomValue(tokens.length);
        let selectedToken = tokens[selectedTokenIndex].replace(/[.!,?]/g, "");
        tokens.splice(selectedTokenIndex, 1);

        let respObjects = dictionaryData.entries.filter(obj => obj['key'].includes(selectedToken));
        let selectedObjects = getRandomElement(respObjects);

        if (selectedObjects && Object.keys(selectedObjects).length > 0) {
            return selectedObjects;
        }
    }
    return respData;
}

function getRandomElement(arr) {
    return arr[getRandomValue(arr.length)];
}

function getRandomValue(max) {
    return Math.floor(Math.random() * max);
}

function inputIsJson(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        console.log(e);
        return false;
    }
    return true;
}

function renderLearningAnnouncement(str) {

    let chatDiv = document.getElementById('main');

    let elizaText = document.createElement('p');
    elizaText.textContent = str;
    chatDiv.appendChild(elizaText);

    document.getElementById('msgInput').value = '';

    resetTimerValue();

}

function newJsonString(str) {
    try {

        let obj = JSON.parse(JSON.stringify(str));

        if (obj.hasOwnProperty('key') && Array.isArray(obj['key']) && obj['key'].length > 0
            && obj.hasOwnProperty('answer') && Array.isArray(obj['answer']) && obj['answer'].length > 0
            && obj.hasOwnProperty('question') && Array.isArray(obj['question']) && obj['question'].length > 0) {
            console.log(obj);
            dictionaryData.entries.push(obj);
            return true;
        }
        else {
            return false
        }
    } catch (e) {
        console.log(e);
        return false;
    }

}

var dictionary = {
    "dictionary_name": "default",
    "entries":
        [{
            "key": ["stupid", "dumb", "idiot", "unintelligent", "simple-minded", "braindead", "foolish", "unthoughtful"],
            "answer": ["educated", "informed", "schooled", "skilled", "trained", "logical", "rational", "reasonable", "valid"]
        }, {
            "key": ["unattractive", "hideous", "ugly"],
            "answer": ["attractive", "beauteous", "beautiful", "lovely", "pretty", "ravishing"]
        }, {
            "key": ["ambiguous", "cryptic", "dark", "nebulous", "obscure", "unintelligible"],
            "answer": ["obvious", "plain", "unambiguous", "understandable", "unequivocal"]
        }, {
            "key": ["incapable", "incompetent", "inept", "unable", "unfit", "unqualified", "weak", "artless"],
            "answer": ["accomplished", "fit", "adept", "complete", "consummate"]
        }, {
            "key": ["emotionless", "heartless", "unkind", "mean", "selfish", "evil"],
            "answer": ["benevolent", "benignant", "gentle", "kind", "clement"]
        }, {
            "key": ["notPresent"],
            "answer": ["We should change the topic", "I agree", "Quid pro quo", "We should start anew"]
        }, {
            "key": ["idle"],
            "answer": ["I am waiting here", "cat got your tongue?", "Can you reply something?", "are you there?", "speechless", "You have been idle for more than 30 seconds", "What's the matter?", " Say something"]
        }]
};