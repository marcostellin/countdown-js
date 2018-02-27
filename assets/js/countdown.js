var date = document.querySelector("input[type=date]");
var years = document.querySelector(".years");
var months = document.querySelector(".months");
var days = document.querySelector(".days");
var hours = document.querySelector(".hours");
var minutes = document.querySelector(".minutes");
var seconds = document.querySelector(".seconds");

var countdown = moment.duration();


date.addEventListener("input", function(){
        
    console.log("Date input event fired");

    var splitDate = this.value.split("-");

    var curDate = moment(new Date());

    // The -1 in month is necessary because the months are zero based in Date objects
    var nextDate = moment(new Date(splitDate[0], splitDate[1] - 1, splitDate[2]));

    var diffArray = diffTime(curDate, nextDate);

    countdown = moment.duration({
        seconds: diffArray[5],
        minutes: diffArray[4],
        hours: diffArray[3],
        days: diffArray[2],
        months: diffArray[1],
        years: diffArray[0]
    });

    setInterval(decrementTime, 1000);

});

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
function decrementTime(){
    var decrement = moment.duration(1, 's');
    countdown = countdown.subtract(decrement);
    displayCurTime();
    
}

//Format the HTML in order to show the countdown time
function displayCurTime(){
    years.textContent = countdown.years();
    months.textContent = countdown.months();
    days.textContent = countdown.days();
    hours.textContent = countdown.hours();
    minutes.textContent = countdown.minutes();
    seconds.textContent = countdown.seconds();
}


