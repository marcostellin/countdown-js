var localStorage = window.localStorage;
var newCntdownBtn = document.querySelector("#newCountdown"); 
var cntdownContainer = document.querySelector("#container");

//Maximum nine countdowns available
var countdownIds = [];
var MAX_CNTDOWNS = 9;
var cntdowns = new Array(MAX_CNTDOWNS);

//localStorage.clear();

init();

setInterval(decrementCntdown,1000);

function init(){

    restoreCntdowns();

    var dateFields = document.querySelectorAll("input[type=date]");
    var closeButtons = document.querySelectorAll(".btn-close");
    var titleFields = document.querySelectorAll("input[type=text");

    for (var i = 0; i < dateFields.length; i++){
        dateFields[i].addEventListener("input", initializeCntdown);
        closeButtons[i].addEventListener("click", removeCntdown);
        titleFields[i].addEventListener("input", setTitle);
    }

    window.addEventListener("unload", function(){
        for (var i = 0; i < cntdowns.length; i++){
            if (cntdowns[i]){
                cntdowns[i].hasStarted = false;
            }
        }

        localStorage.setItem("countdownIds", JSON.stringify(countdownIds));
        localStorage.setItem("cntdowns", JSON.stringify(cntdowns));
    });

    newCntdownBtn.addEventListener("click", function addCounter(){
        var cntdownIdValue = countdownIds.pop(); 

        if (cntdownIdValue != undefined){
            buildCounterHTML(cntdownIdValue);

            var cntdownDate = document.querySelector("#cntdown-" + cntdownIdValue + " input[type=date]");
            var cntClose = document.querySelector("#cntdown-" + cntdownIdValue + " .btn-close");
            var title = document.querySelector("#cntdown-" + cntdownIdValue + " input[type=text]");
            
            cntdownDate.addEventListener("input", initializeCntdown);
            cntClose.addEventListener("click", removeCntdown);
            title.addEventListener("input", setTitle)
        } else {
            alert("Too Many Countdowns. The limit is 9!");
        }
    });
}

function setTitle(){
    var cntdownIdValue = Number(this.parentElement.getAttribute("id").replace("cntdown-",""));
    cntdowns[cntdownIdValue].title = this.value;
}

//Create the HTML to display the countdown with ID id in the browser
function buildCounterHTML(id){
    var cntdownDiv = document.createElement("div");
    var cntdownId = document.createAttribute("id");
    cntdownId.value = "cntdown-" + id;
    cntdownDiv.setAttributeNode(cntdownId);
    cntdownDiv.innerHTML =  "<input type=text placeholder=\"Title\"><button class=\"btn-close\"><i class=\"fas fa-times\"></i></button>" +
                            "<p>"+
                            "<span class=\"years\">0</span> Y "+ 
                            "<span class=\"months\"> 0 </span> Mo "+
                            "<span class=\"days\"> 0 </span> D "+
                            "<span class=\"hours\"> 0 </span> H "+
                            "<span class=\"minutes\"> 0 </span> M "+
                            "<span class=\"seconds\"> 0 </span> S " + 
                            "</p>"+ 
                            "<input type=\"date\">";

    cntdownContainer.appendChild(cntdownDiv);

    //var titleField = document.querySelector("#cntdown-" + id + " input[type=text]")
    //titleField.value = cntdowns[id].title;
    console.log("Created countdown with ID " + id);
}

function restoreCntdowns(){
    if (localStorage.getItem("countdownIds")){
        countdownIds = JSON.parse(localStorage.getItem("countdownIds"));
    } else {
        for (var i = 0; i < MAX_CNTDOWNS; i++){
            countdownIds[i] = i;
        }
    }

    if (localStorage.getItem("cntdowns")){
        cntdowns = JSON.parse(localStorage.getItem("cntdowns"));
        for (var i = 0; i < cntdowns.length; i++){
            if (cntdowns[i]){
                buildCounterHTML(i);
                var splitDate = cntdowns[i].deadline;
                var titleField = document.querySelector("#cntdown-" + i + " input[type=text]");
                cntdowns[i].duration = computeDuration(splitDate);
                cntdowns[i].hasStarted = true;
                titleField.value = cntdowns[i].title;
            }
        }
    }
}

function initializeCntdown(){
    console.log("Date input event fired");
    var splitDate = this.value.split("-");

    var cntdownIdValue = Number(this.parentElement.getAttribute("id").replace("cntdown-",""));

    cntdowns[cntdownIdValue] = {duration: computeDuration(splitDate),
                                deadline: splitDate,
                                title: "",
                                hasStarted: true
                                };

    displayCurTime(cntdownIdValue);
}

function computeDuration(splitDate){
    var curDate = moment(new Date());

    // The -1 in month is necessary because the months are zero based in Date objects
    var nextDate = moment(new Date(splitDate[0], splitDate[1] - 1, splitDate[2]));
    var diffArray = diffTime(curDate, nextDate);

    return moment.duration({
                            seconds: diffArray[5],
                            minutes: diffArray[4],
                            hours: diffArray[3],
                            days: diffArray[2],
                            months: diffArray[1],
                            years: diffArray[0]
                          });
}

//Remove the countdown when close button is clicked
function removeCntdown(){
    console.log("Close button clicked");
    var container = this.parentElement;
    var parentOfContainer = container.parentElement;
    var cntdownIdValue = Number(container.getAttribute("id").replace("cntdown-", ""));

    //Reset countdown object
    cntdowns[cntdownIdValue] = null;

    //Make the id available for other countdowns
    countdownIds.push(cntdownIdValue);
    parentOfContainer.removeChild(container);
}

//Accept two dates and return an array containing the number of years, months, days, hours, minutes and seconds
//between date1 and date2
function diffTime(date1, date2){
    var timeUnits = ["years", "months", "days", "hours", "minutes", "seconds"];
    var out = [];

    for (var i=0; i < timeUnits.length; i++){
        var difference = date2.diff(date1, timeUnits[i]);
        date1.add(difference, timeUnits[i]);
        out.push(difference);
    }

    return out;
}

//Selects the current countdowns and decrement them by one second
function decrementCntdown(){
    var curCntdowns = document.querySelectorAll("#container div");
    for (var i = 0; i < curCntdowns.length; i++){

        var cntdownIdValue = Number(curCntdowns[i].getAttribute("id").replace("cntdown-", ""));
        if (cntdowns[cntdownIdValue] != undefined && cntdowns[cntdownIdValue].hasStarted){
            decrementTime(cntdownIdValue);
        }

    }
}

//Decrement the countdown by 1 second
function decrementTime(id){

    if (!(cntdowns[id].duration.years() === 0 &&
        cntdowns[id].duration.months() === 0 &&
        cntdowns[id].duration.days() === 0 &&
        cntdowns[id].duration.hours() === 0 &&
        cntdowns[id].duration.minutes() === 0 &&
        cntdowns[id].duration.seconds() === 0)){

        var decrement = moment.duration(1, 's');
        cntdowns[id].duration = cntdowns[id].duration.subtract(decrement);
        displayCurTime(id);
    }    
}

//Format the HTML in order to show the countdown time
function displayCurTime(id){

    var query = "#cntdown-" + id;

    var years = document.querySelector(query + " .years");
    var months = document.querySelector(query + " .months");
    var days = document.querySelector(query + " .days");
    var hours = document.querySelector(query + " .hours");
    var minutes = document.querySelector(query + " .minutes");
    var seconds = document.querySelector(query + " .seconds");

    years.textContent = cntdowns[id].duration.years();
    months.textContent = cntdowns[id].duration.months();
    days.textContent = cntdowns[id].duration.days();
    hours.textContent = cntdowns[id].duration.hours();
    minutes.textContent = cntdowns[id].duration.minutes();
    seconds.textContent = cntdowns[id].duration.seconds();
}


