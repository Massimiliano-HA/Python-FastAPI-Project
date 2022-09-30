var host = '127.0.0.1', port = 8000;
var refreshLeaderboardID;
var totalScore;
var index = 0;
var currentGame = {
    "pseudo" : "Guest",
    "password" : "",
    "score" : null
};
var cartes = [];

function generateCarte()
{   
    document.querySelector('#mainInfo').innerHTML = `${index + 1}/${cartes.length}`;
    let newCarte = document.querySelector('.carte').cloneNode(true);
    newCarte.querySelector('.question').innerHTML = cartes[index].question;
    newCarte.removeChild(newCarte.querySelector('.answer'));

    cartes[index].answers.forEach(answer => {
        let newAnswer = document.querySelector('.answer').cloneNode(true);
        newAnswer.querySelector('.answerLabel').innerHTML = answer;
        newCarte.appendChild(newAnswer);
    });
    if(index == cartes.length - 1){
        newCarte.querySelector('#next').innerHTML = "Finish";
        // newCarte.querySelector('#next').onclick = "result()";
        // newCarte.querySelector('#next').setAttribute("onclick","result()");
    } 
    document.querySelector('#content').appendChild(newCarte);
}

function startTest()
{
    currentGame.score = 0;
    if (index != 0) {
        var cartes = document.getElementsByClassName('carte');
        for (let j = 0; j < cartes.length; j++) {
            cartes[j + 1].remove();
        }
        index = 0;
    }
    generateCarte();
    document.querySelector('#content').style.display = 'flex';
    document.getElementById("start-button").style.display = "none";
    document.querySelector("#manageAccount").style.display = "none";
    document.getElementById("rickRoll").style.display = "block";
    
    $("#content").css("display", "flex").hide().fadeIn();
    $('#leaderboard').css("display", "none");
}

function next()
{
    let allAnswers = document.querySelectorAll('.carte')[1].querySelectorAll('.answer');
    let check = [];

    for (let i = 0; i < allAnswers.length; i++)
    {
        if( allAnswers[i].getElementsByTagName('input')[0].checked ) check.push(i);
    }

    let goodAnswer = true;
    
    if(check.length != cartes[index].goodAnswerIndex.length) goodAnswer = false;

    if(goodAnswer)
    {
        for(let i = 0; i < check.length; i++)
        {
            if(check[i] != cartes[index].goodAnswerIndex[i])
            {
                goodAnswer = false;
                break;
            }
        }
    }

    if(goodAnswer) currentGame.score++;

    if(index == cartes.length - 1)
    {
        result();
    }
    else
    {
        index++;
        document.querySelector('#content').removeChild(document.querySelector('#content').lastChild);
        generateCarte(index);
        $('.carte').css("display", "block").hide().fadeIn(500);
    }
}

function checkInput(pseudo, password)
{
    if(pseudo == "" || password == "")
    {
        document.querySelector('#monkey-interface p').innerHTML = "Each field need to be filled";
        $("#monkey-interface").fadeIn(1000);
    }
    else if(pseudo.length < 3)
    {
        document.querySelector('#monkey-interface p').innerHTML = "Pseudo is too short !";
        $("#monkey-interface").fadeIn(1000);
    }
    else if(pseudo.length > 16)
    {
        document.querySelector('#monkey-interface p').innerHTML = "Pseudo is too long !";
        $("#monkey-interface").fadeIn(1000);
    }
    else if(password.length < 4)
    {
        document.querySelector('#monkey-interface p').innerHTML = "Password is too short !";
        $("#monkey-interface").fadeIn(1000);
    }
    else
    {
        return true;
    }

    return false;
}

async function loginRequest(pseudo, password)
{
    let apiResponse;

    await fetch(`http://${host}:${port}/login`, {
        method : 'POST',
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({pseudo, password})
    })
    .then(response => response.json())
    .then(json => apiResponse = json);

    return apiResponse;
}

async function register()
{
    let pseudo = document.querySelector('#pseudo').value, password = document.querySelector('#password').value;
    if(!checkInput(pseudo, password)) return;
    let apiResponse = await loginRequest(pseudo, password);

    if(apiResponse.pseudo == undefined)
    {
        fetch(`http://${host}:${port}/register`, {
            method : 'POST',
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({pseudo, password})
        });

        document.querySelector('#monkey-interface').style.backgroundColor = 'rgb(51, 192, 0)';
        document.querySelector('#monkey-interface p').innerHTML = "Account created !";
        $("#monkey-interface").fadeIn(1000);
    }
    else
    {
        document.querySelector('#monkey-interface p').innerHTML = "Account already exist !";
        $("#monkey-interface").fadeIn(1000);
    }
}

async function unregister()
{
    let pseudo = document.querySelector('#pseudo').value, password = document.querySelector('#password').value;
    if(!checkInput(pseudo, password)) return;
    let apiResponse = await loginRequest(pseudo, password);
    
    if(apiResponse.pseudo != undefined)
    {
        await fetch(`http://${host}:${port}/delete`, {
            method : 'DELETE',
            headers : {
                "Content-type" : "application/json"
            },
            body : JSON.stringify({pseudo, password})
        });

        document.querySelector('#monkey-interface').style.backgroundColor = 'rgb(51, 192, 0)';
        document.querySelector('#monkey-interface p').innerHTML = "Account deleted !";
        $("#monkey-interface").fadeIn(1000);
    }
    else
    {
        document.querySelector('#monkey-interface p').innerHTML = "Account doesn't exist !";
        $("#monkey-interface").fadeIn(1000);
    }
}

async function login()
{
    let pseudo = document.querySelector('#pseudo').value, password = document.querySelector('#password').value;
    if(!checkInput(pseudo, password)) return;
    let apiResponse = await loginRequest(pseudo, password);

    if(apiResponse.pseudo == undefined)
    {   
        document.querySelector('#monkey-interface p').innerHTML = "Wrong username/password !";
        $("#monkey-interface").fadeIn(1000);
    }
    else
    {
        currentGame.pseudo = apiResponse.pseudo;
        currentGame.score = apiResponse.score;
        currentGame.password = apiResponse.password;

        $("#name-pop-up").fadeOut(1000);
        $("#monkey-interface").fadeOut(1000);
        $("#dots").fadeOut(1000);
        $('#leaderboard').css("display", "flex").hide().fadeIn(1500);
        $('header').css("display", "flex").hide().fadeIn(1500);
        document.querySelector('#content').style.marginTop = '10px';
        document.querySelector('#name').innerHTML = currentGame.pseudo;

        refreshLeaderboardID = refreshLeaderboard();

        fetch(`http://${host}:${port}/questions`, {
            method: "GET"
        })
        .then((result) => result.json())
        .then((data) => {
            cartes = data;
        });
    }   
}

function refreshLeaderboard()
{
    return setInterval(() => {
        console.log('Refreshing');

        for(let i=0; i < totalScore; i++)
        {
            document.getElementById('tab').removeChild(document.getElementById('tab').lastChild);
        }

        fetch(`http://${host}:${port}/ranking`, {
            method: "GET"
        })
        .then((result) => result.json())
        .then((data) => {
            totalScore = data.length;
            data.forEach(element => {
                if(element.score == 'null') return;
                let newLine = document.querySelector('.line').cloneNode(true);
    
                newLine.querySelector(".rankingUsername").innerHTML = element.pseudo;
                newLine.querySelector(".rankingUserNote").innerHTML = element.score;
                
                document.getElementById('tab').appendChild(newLine);
            });
        });
    }, 5000);
}

function result() {
    // $('#leaderboard').fadeIn(1500);
    $('.carte').css("display", "none");
    $('#result').css("display", "flex").hide().fadeIn(400);
    $('#retour-fin').css("display", "flex").hide().fadeIn(400);
    // .....
    
    if(currentGame.score < cartes.length * 0.5){
        document.querySelector("#rating").setAttribute("src", "assets/img/ranking-d.png");
        document.getElementById("results").innerHTML = "Va falloir bosser...";
    }
    else if(currentGame.score < cartes.length * 0.7 ){
        document.querySelector("#rating").setAttribute("src", "assets/img/ranking-c.png");
        document.getElementById("results").innerHTML = "Vous passez de justesse";
    }
    else if(currentGame.score < cartes.length * 0.8 ){
        document.querySelector("#rating").setAttribute("src", "assets/img/ranking-b.png");
        document.getElementById("results").innerHTML = "Vous êtes en bonne voie";
    }
    else if(currentGame.score < cartes.length * 0.95 ){
        document.querySelector("#rating").setAttribute("src", "assets/img/ranking-A.png");
        document.getElementById("results").innerHTML = "Vous êtes bons";
    }
    else if(currentGame.score < cartes.length * 1 ){
        document.querySelector("#rating").setAttribute("src", "assets/img/ranking-s.png");
        document.getElementById("results").innerHTML = "Vous êtes très bon";
    }
    else{
        document.querySelector("#rating").setAttribute("src", "assets/img/ranking-X.png");
        document.getElementById("results").innerHTML = "DIVIIIIIIIINNNNNN";
    }

    currentGame.score = currentGame.score * 100 / cartes.length + '%';
    document.querySelector('#mainInfo').innerHTML = currentGame.score;
}

function Random()
{
    let rand = Math.random() * (90 - 1) + 1;
    return rand;
}
const circleRand = document.getElementsByClassName('circleRandom');

for (let index = 0; index < circleRand.length; index++)
{
    circleRand[index].style.setProperty('--top', `${Random()}` + "%");
    circleRand[index].style.setProperty('--left', `${Random()}` + "%");
    circleRand[index].style.setProperty('--right', `${Random()}` + "%");
    circleRand[index].style.setProperty('--bottom', `${Random()}` + "%");
    circleRand[index].style.setProperty('--height', `${Random()}` + "px");
    circleRand[index].style.setProperty('--length', `${Random()}` + "px");
}

$("#pseudo").click(function ()
{
    $("#monkey-interface").fadeOut(1000);
})

function lunatic()
{
    if(document.querySelector("#rating").getAttribute("src") == "assets/img/ranking-X.png")
    {
        currentGame.score = `${currentGame.score}+`;
        document.getElementById("rating").setAttribute("src", "assets/img/ranking-xh.png");
        document.getElementById("results").innerHTML = "PLUUUSS QUEEE DIIIIIIVVIIIIIIIINNNNNNNNN";
    }
}

async function retour()
{
    let pload = {
        pseudo : currentGame.pseudo,
        password : currentGame.password,
        score : currentGame.score
    };

    console.log(currentGame.score);

    await fetch(`http://${host}:${port}/upload`, {
        method: 'PATCH',
        headers: {
            "Content-type" : "application/json"
        },
        body: JSON.stringify(pload)
    });
    
    $('#result').css("display", "none");
    $('#retour-fin').fadeOut(1000);
    $('#leaderboard').fadeIn(1500);
    document.getElementById('mainInfo').innerHTML = "Overall Ranking";
    document.querySelector("#manageAccount").style.display = "block";
}

async function verify()
{
    if( document.querySelector('#pseudoAccountInput').value == currentGame.pseudo &&
    document.querySelector('#passwordAccountInput').value == currentGame.password)
    {
        document.querySelector('#changePseudoButton').removeAttribute('disabled');
        document.querySelector('#changePasswordButton').removeAttribute('disabled');
        
        document.querySelector('#pseudoAccountInput').value = "";
        document.querySelector('#passwordAccountInput').value = "";
        
        document.querySelector('#pseudoAccountInput').setAttribute('disabled', null);
        document.querySelector('#passwordAccountInput').setAttribute('disabled', null);

        document.querySelector('#mgrAccountValid').innerHTML = "Change";
        document.querySelector('#mgrAccountValid').setAttribute('disabled', null);
        
        document.querySelector('#mainInfo').innerHTML = "Account Management"
    }
    else document.querySelector('#mainInfo').innerHTML = "Login failed"
}

function displayManageAccountPage()
{
    document.querySelector("#manageAccount").style.display = "none";
    document.querySelector('#leaderboard').style.display = "none";
    document.querySelector('#manageAccountPage').style.display = "block";
    document.querySelector('#mainInfo').innerHTML = "Please relogin"
}

function changePseudo()
{
    document.querySelector('#changePseudoButton').setAttribute('disabled', null);
    document.querySelector('#changePasswordButton').setAttribute('disabled', null);

    document.querySelector('#pseudoAccountInput').removeAttribute('disabled');
    document.querySelector('#mgrAccountValid').removeAttribute('disabled');
    document.querySelector('#mgrAccountValid').setAttribute('onclick', 'sendNewPseudo()');
}

function changePassword()
{
    document.querySelector('#changePseudoButton').setAttribute('disabled', null);
    document.querySelector('#changePasswordButton').setAttribute('disabled', null);

    document.querySelector('#passwordAccountInput').removeAttribute('disabled');
    document.querySelector('#mgrAccountValid').removeAttribute('disabled');
    document.querySelector('#mgrAccountValid').setAttribute('onclick', 'sendNewPassword()');
}

function sendNewPseudo()
{
    fetch(`http://${host}:${port}/change_pseudo`, {
        method : 'PATCH',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({
            pseudo : currentGame.pseudo,
            password : currentGame.password,
            new_pseudo : document.querySelector('#pseudoAccountInput').value
        })
    });

    currentGame.pseudo = document.querySelector('#pseudoAccountInput').value;
    
    document.querySelector('#pseudoAccountInput').value = "";

    document.querySelector('#mgrAccountValid').setAttribute('disabled', null);
    document.querySelector('#pseudoAccountInput').setAttribute('disabled', null);

    document.querySelector('#changePseudoButton').removeAttribute('disabled');
    document.querySelector('#changePasswordButton').removeAttribute('disabled');
}

function sendNewPassword()
{
    fetch(`http://${host}:${port}/change_password`, {
        method : 'PATCH',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({
            pseudo : currentGame.pseudo,
            password : currentGame.password,
            new_password : document.querySelector('#passwordAccountInput').value
        })
    });

    currentGame.password = document.querySelector('#passwordAccountInput').value;

    document.querySelector('#passwordAccountInput').value = "";

    document.querySelector('#mgrAccountValid').setAttribute('disabled', null);
    document.querySelector('#passwordAccountInput').setAttribute('disabled', null);

    document.querySelector('#changePseudoButton').removeAttribute('disabled');
    document.querySelector('#changePasswordButton').removeAttribute('disabled');
}

function displayMainPage()
{
    document.querySelector('#leaderboard').style.display = 'flex';
    document.querySelector('#manageAccountPage').style.display = 'none';

    document.querySelector('#mainInfo').innerHTML = "Overall Ranking"

    document.querySelector('#changePseudoButton').setAttribute('disabled', null);
    document.querySelector('#changePasswordButton').setAttribute('disabled', null);

    document.querySelector('#pseudoAccountInput').removeAttribute('disabled');
    document.querySelector('#passwordAccountInput').removeAttribute('disabled');

    document.querySelector('#mgrAccountValid').setAttribute('onclick', 'verify()');
    document.querySelector('#mgrAccountValid').innerHTML = 'Verify';
    document.querySelector('#mgrAccountValid').removeAttribute('disabled');

    document.querySelector("#manageAccount").style.display = "block";
}

/*  var refresh = setInterval(
    function () {
        $('#leaderboard').load("index.html");
    },
    3000); */