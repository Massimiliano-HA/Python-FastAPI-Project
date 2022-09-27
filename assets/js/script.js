var host = '127.0.0.1', port = 8044;
var xhr = new XMLHttpRequest();
var index = 0;
var currentGame = {
    "pseudo" : "Guest",
    "score" : 0
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

function sendName()
{
    let popUp = document.getElementById('name-pop-up');
    currentGame.pseudo = popUp.getElementsByTagName('input')[0].value;
    if (currentGame.pseudo.length >= 3 && currentGame.pseudo.length <= 16)
    {
        $("#name-pop-up").fadeOut(1000);
        $("#wrong-nickname").fadeOut(1000);
        $("#dots").fadeOut(1000);
        $('#leaderboard').css("display", "flex").hide().fadeIn(1500);
        $('header').css("display", "flex").hide().fadeIn(1500);
        document.querySelector('#content').style.marginTop = '10px';
        document.querySelector('#name').innerHTML = currentGame.pseudo;
        
        fetch(`http://${host}:${port}/ranking`, {
            method: "POST"
        })
        .then((result) => result.json())
        .then((data) => {
            data.forEach(element => {
                let newLine = document.querySelector('.line').cloneNode(true);
    
                newLine.querySelector(".rankingUsername").innerHTML = element.pseudo;
                newLine.querySelector(".rankingUserNote").innerHTML = element.score;
                
                document.getElementById('tab').appendChild(newLine);
            });
        });

        fetch(`http://${host}:${port}/questions`, {
            method: "POST"
        })
        .then((result) => result.json())
        .then((data) => {
            cartes = data;
        });
    }   
    else
    {
        $("#wrong-nickname").fadeIn(1000);
    }
}

function result() {
    // $('#leaderboard').fadeIn(1500);
    $('.carte').css("display", "none");
    $('#result').css("display", "flex").hide().fadeIn(400);
    $('#retour-fin').css("display", "flex").hide().fadeIn(400);
    // .....

    document.querySelector('#mainInfo').innerHTML = currentGame.score * 100 / cartes.length + '%';

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
}

/* for (let index = 0; index < 10; index++) 
{
    let newLine = document.querySelector('.line').cloneNode(true);
    document.getElementById('tab').appendChild(newLine);
    
} */

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
    $("#wrong-nickname").fadeOut(1000);
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

function retour()
{
    fetch(`http://${host}:${port}/upload`, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(currentGame)
    });
    
    $('#result').css("display", "none");
    $('#retour-fin').fadeOut(1000);
    $('#leaderboard').fadeIn(1500);
    document.getElementById('mainInfo').innerHTML = "Overall Ranking";
}

/*  var refresh = setInterval(
    function () {
        $('#leaderboard').load("index.html");
    },
    3000);   */