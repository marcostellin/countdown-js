var date = document.querySelector("input[type=date]");
var newCntdownBtn = document.querySelector("#newCountdown"); 
var cntdownContainer = document.querySelector("#container");

//Maximum nine countdowns available
var countdownIds = [0,1,2,3,4,5,6,7,8];
var cntdowns = [];

init();





function init(){

    //Initialize countdown objects
    for (var i=0; i < countdownIds.length; i++){
        cntdowns[i] = {};
    }

    newCntdownBtn.addEventListener("click", function addCounter(){
        var cntdownDiv = document.createElement("div");
        var cntdownId = document.createAttribute("id");
        var cntdownIdValue = countdownIds.pop(); 
        cntdownId.value = "cntdown-" + cntdownIdValue;
        cntdownDiv.setAttributeNode(cntdownId);

        cntdownDiv.innerHTML = "<button>X</button>" + "<p>"+
                                "<span class=\"years\">0</span> Y "+ 
                                "<span class=\"months\"> 0 </span> Mo "+
                                "<span class=\"days\"> 0 </span> D "+
                                "<span class=\"hours\"> 0 </span> H "+
                                "<span class=\"minutes\"> 0 </span> M "+
                                "<span class=\"seconds\"> 0 </span> S " + 
                                "</p>"+ 
                                "<input type=\"date\">";

        cntdownContainer.appendChild(cntdownDiv);

        var cntdownDate = document.querySelector("#cntdown-" + cntdownIdValue + " input[type=date]");
        cntdownDate.addEventListener("input", initializeCntdown);
    });

}

function initializeCntdown(){
    console.log("Date input event fired");
    var splitDate = this.value.split("-");
    var curDate = moment(new Date());

    // The -1 in month is necessary because the months are zero based in Date objects
    var nextDate = moment(new Date(splitDate[0], splitDate[1] - 1, splitDate[2]));
    var diffArray = diffTime(curDate, nextDate);

    var cntdownIdValue = Number(this.parentElement.getAttribute("id").replace("cntdown-",""));

    cntdowns[cntdownIdValue].duration = moment.duration({
                                    seconds: diffArray[5],
                                    minutes: diffArray[4],
                                    hours: diffArray[3],
                                    days: diffArray[2],
                                    months: diffArray[1],
                                    years: diffArray[0]
                                    });
    cntdowns[cntdownIdValue].id = cntdownIdValue;

    if (cntdowns[cntdownIdValue].intervalId === undefined){
        cntdowns[cntdownIdValue].intervalId = setInterval(function() {decrementTime(cntdownIdValue)}, 1000);
    }

    displayCurTime(cntdownIdValue);
}

//Accpet two dates and return an array containing the number of years, months, days, hours, minutes and seconds
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

//Decrement the countdown of 1 second
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


