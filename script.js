var containerEl = $('.container');
var currDayEl = $('#currentDay');
var jumbotronEl = $('.jumbotron');

//hour to be displayed
var dayHour = 9;
//hour in 24-hour form to handle before/after moments
var dayHourTF = 9;
var dayTime = "AM";

//loads saved information from local storage
var hoursArray = JSON.parse(localStorage.getItem('hoursArrayLS'));

var rowArray = [];

var displayTimeEl = $('<p>');
containerEl.append(displayTimeEl);

//function to update current time
function updateTime() {
    currTime = moment();
    displayTimeEl.text(currTime.format('hh:mm:ss A'));
}

updateTime();

//sets interval so 'updateTime' function will be called and time will be updated every 1000 milliseconds (1 second)
setInterval(function () {
    updateTime();
    //at the top of every hour, the color of each row will be updated to reflect the current time of day
    if (moment().minutes() == "00" && moment().seconds() == "00") {
        location.reload();
    }
    //at the beginning of every day, the local storage will be cleared, emptying the list of scheduled events for each hour and renders a new page
    if (currTime == moment().startOf('day')) {
        localStorage.clear();
        location.reload();
    }
},1000);

newDay();

//renders the page
function newDay() {

    //formats date displayed at top of page
    currDayEl.text(moment().format("dddd, MMMM Do"));

    //if the array in local storage is not empty, the information is loaded in from local storage and parsed into an object array
    if (localStorage.getItem('hoursArrayLS') != null) {
        hoursArray = JSON.parse(localStorage.getItem('hoursArrayLS'));
    }
    //if the array in local storage is empty, new objects are created for each hour of the day and loaded into a new array
    else {

        for (var i = 0; i < 9; i++) {
            if (dayHour == 12 || dayHour < 9) {
                dayTime = "PM";
            }
            else {
                dayTime = "AM";
            }

            if (dayHour == 13) {
                dayHour = 1;
                dayTime = "PM";
            }

            var startT = moment().hours(dayHourTF).minutes(0).seconds(0);
            var endT = moment().hours(dayHourTF).minutes(59).seconds(59);

            var hourObj = {
                hourNum: dayHour,
                timeOfDay: dayTime,
                toDoLine: " ",
                startTime: startT,
                endTime: endT
            };

            dayHour++;
            dayHourTF++;

            if(hoursArray == null ) {
                var hoursArray = [hourObj];
            }
            else {
                hoursArray.push(hourObj);
            }
        }
    }   

    //rows of elements are created and added to the page
    //information from the array (whether newly created or loaded in from local storage) is used to fill these rows
    for (var j = 0; j < hoursArray.length; j++) {

        var rowEl = $('<div>');
        
        rowEl.addClass('row');
        rowEl.attr('data-index',j);

        var timeBlockEl = $('<section>');
        timeBlockEl.addClass('timeBlock');

        var timeHead = $('<h3>');
        timeHead.addClass('hour');
       
        timeHead.text(hoursArray[j].hourNum + ' ' + hoursArray[j].timeOfDay);

        var toDo = $('<textArea>');
        toDo.text(hoursArray[j].toDoLine);


        if (currTime.isBefore(hoursArray[j].startTime)) { 
            toDo.addClass('future');
        }
        else if (currTime.isAfter(hoursArray[j].startTime) && currTime.isBefore(hoursArray[j].endTime)) {
            toDo.addClass('present');
        }
        
        else if (currTime.isAfter(hoursArray[j].endTime)) {
            toDo.addClass('past');
        } 

        var saveButton = $('<button class="saveBtn">Save</button>');

        timeBlockEl.append(timeHead);
        rowEl.append(timeBlockEl);
        rowEl.append(toDo);
        rowEl.append(saveButton);

        if (rowArray == null ) {
            var rowArray = [rowEl];
        }
        else {
            rowArray.push(rowEl);
        }

        containerEl.append(rowEl);
    }

    localStorage.setItem('hoursArrayLS', JSON.stringify(hoursArray));

    console.log(hoursArray);
}


function saveToDo(event) {
    //an array of hour objects is loaded in from local storage and parsed to be an array of objects
    var hourArr = JSON.parse(localStorage.getItem('hoursArrayLS'));
    var btnClicked = $(event.target);
    //text from the text area of the desired hour row is saved into a variable
    var txt = btnClicked.parent('.row').children('textArea').val();
    var index = btnClicked.parent('.row').attr('data-index');
    //the text to be saved is set as the text content of the hour object's 'toDoLine' field
    hourArr[index].toDoLine = txt;
    //the updated array is saved into local storage
    localStorage.setItem('hoursArrayLS', JSON.stringify(hourArr));
}


// function colorHours() {
//     for (var i = 0; i < hoursArray.length; i++) {
//         if (moment().isAfter(hoursArray[i].startTime) && moment().isBefore(hoursArray[i].endTime)) {
//             $('hoursArray[i] > textArea:first').removeClass('future');
//             $('hoursArray[i] > textArea:first').addClass('present');
//         }
//         if (moment().isBefore(hoursArray[i].startTime)) { 
//             $('hoursArray[i] > textArea:first').removeClass('future');
//         }
//         if (moment().isAfter(hoursArray[i].endTime)) {
//             $('hoursArray[i] > textArea:first').removeClass('present');
//             $('hoursArray[i] > textArea:first').addClass('past');
//         } 
//         console.log('hour ' + i + ' colored');
//     }
// }

containerEl.on('click', '.saveBtn', saveToDo);
