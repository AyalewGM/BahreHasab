
//Ayalew G Mersha, October 1, 2024 
//Bahre Hasab

window.onload = function() {
    // Set default Ethiopian year to the current Ethiopian year (assuming current Gregorian year 2024 -> 2016 Ethiopian)
    const currentGregorianYear = new Date().getFullYear();
    const currentEthiopianYear = currentGregorianYear - 8;
    document.getElementById('ethiopianYear').value = currentEthiopianYear;
    
    // Trigger calculation on page load
    calculateCalendar();

    // Add event listener for the year change
    document.getElementById('ethiopianYear').addEventListener('change', calculateCalendar);
};

function calculateCalendar() {
    const ethiopianYear = parseInt(document.getElementById('ethiopianYear').value);
    
    // Step 1: Calculate Amete Alem
    const yearsBeforeChrist = 5500;
    const ameteAlem = yearsBeforeChrist + ethiopianYear;
    document.getElementById('ameteAlem').innerText = ameteAlem;

    // Step 2: Calculate Evangelist (Wengelawi)
    const evangelists = ["ዮሐንስ", "ማቴዎስ", "ማርቆስ", "ሉቃስ"];
    const wengelawiIndex = ameteAlem % 4;
    const wengelawi = evangelists[wengelawiIndex];
    document.getElementById('wengelawi').innerText = wengelawi;

    // Step 3: Calculate the correct day of New Year (Tinte Qemer)

    const tinteQemer = getEthiopianDayOfWeek(ethiopianYear, "Meskerem", 1);
    document.getElementById('tinteQemer').innerText = `Meskerem 1 (${tinteQemer})`;

    // Step 4: Calculate Metene Rabiet, Medeb, Wenber, Abektie, and Metqi
    const meteneRabiet = Math.floor(ameteAlem / 4);
    const medeb = ameteAlem % 19;
    const wenber = medeb === 0 ? 18 : medeb - 1;
    const abektie = (wenber * 11) % 30;
    const metqi = (wenber * 19) % 30;
    document.getElementById('medeb').innerText = medeb;
    document.getElementById('wenber').innerText = wenber;
    document.getElementById('abektie').innerText = abektie;
    document.getElementById('metqi').innerText = metqi;

    // Step 5: Calculate Beale Metqi
    let bealeMetqiMonth, ninevehMonth, bealeMetqiDay;
    if (metqi > 14) {
        bealeMetqiMonth = "Meskerem";
        bealeMetqiDay = metqi;
        ninevehMonth = "Tirr";
    } else {
        bealeMetqiMonth = "Tikimt";
        bealeMetqiDay = metqi;
        if (bealeMetqiDay > 30) {
            bealeMetqiDay -= 30;
            bealeMetqiMonth = "Tikimt";
        }
        ninevehMonth = "Yekatit";
    }

    // Step 6: Get the Ethiopian day of the week for Beale Metqi
    let bealeMetqiDayOfWeek = getEthiopianDayOfWeek(ethiopianYear, bealeMetqiMonth, bealeMetqiDay);

    // Shift Beale Metqi Day of the Week to the Previous Day
    //bealeMetqiDayOfWeek = shiftDayToPrevious(bealeMetqiDayOfWeek);

    document.getElementById('bealeMetqi').innerText = `${bealeMetqiMonth} ${bealeMetqiDay} (${bealeMetqiDayOfWeek})`;

    // Step 7: Lookup the Tewsak for the adjusted day of the week
    const tewsakTable = {
        "Sunday": 7,
        "Monday": 6,
        "Tuesday": 5,
        "Wednesday": 4,
        "Thursday": 3,
        "Friday": 2,
        "Saturday": 8
    };

    const tewsakOfDay = tewsakTable[bealeMetqiDayOfWeek];

    // Step 8: Calculate Mebaja Hamer (Beale Metqi + Tewsak)
    let mebajaHamer = bealeMetqiDay + tewsakOfDay;
    if (mebajaHamer > 30) {
        mebajaHamer -= 30;  // Adjust if it exceeds 30 days
        ninevehMonth = "Yekatit"; // Move Nineveh to the next month
    }
    document.getElementById('mebajaHamer').innerText = `${ninevehMonth} ${mebajaHamer}`;

    // Step 9: Calculate fasting and holy days based on Nineveh
    const fastingDates = calculateFastingDates(ninevehMonth, mebajaHamer);
    displayFastingDates(fastingDates);
}

// Helper function to shift the day of the week to the previous day
function shiftDayToPrevious(day) {
    const dayMap = {
        "Sunday": "Saturday",
        "Monday": "Sunday",
        "Tuesday": "Monday",
        "Wednesday": "Tuesday",
        "Thursday": "Wednesday",
        "Friday": "Thursday",
        "Saturday": "Friday"
    };
    return dayMap[day];
}

// Function to get the Ethiopian day of the week for a given Ethiopian year, month, and day
function getEthiopianDayOfWeek(ethiopianYear, ethiopianMonth, ethiopianDay) {
    // Ethiopian months array
    const ethiopianMonths = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
    
    // Ethiopian weekdays array
    const ethiopianWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Step 1: Determine the Gregorian year equivalent for the given Ethiopian year
    const gregorianYear = ethiopianYear + 7; // Ethiopian year is 7-8 years behind Gregorian

    // Step 2: Determine the Gregorian date of Meskerem 1 (New Year)
    let meskerem1Date = new Date(Date.UTC(gregorianYear, 8, 11, 7, 0, 0)); // Meskerem 1 at 7:00 AM CET (September 11 UTC)

    // Handle Ethiopian leap years (Meskerem 1 moves to September 12 in a leap year)
    if ((ethiopianYear + 1) % 4 === 0) {
        meskerem1Date = new Date(Date.UTC(gregorianYear, 8, 12, 7, 0, 0)); // September 12 UTC at 7:00 AM CET
    }

    // Step 3: Calculate the total number of days from Meskerem 1 to the given Ethiopian date
    const monthIndex = ethiopianMonths.indexOf(ethiopianMonth);
    const ethiopianMonthsDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Pagumen has 5 days

    let daysFromMeskerem1 = ethiopianDay - 1; // Subtract 1 since Meskerem 1 is the start of the year

    // Add the days for each full month up to the given month
    for (let i = 0; i < monthIndex; i++) {
        daysFromMeskerem1 += ethiopianMonthsDays[i];
    }

    // Step 4: Add the calculated days to Meskerem 1 to get the Gregorian date
    meskerem1Date.setUTCDate(meskerem1Date.getUTCDate() + daysFromMeskerem1);

    // Step 5: Get the Gregorian day of the week at 7:00 AM Central European Time (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const gregorianDayOfWeek = meskerem1Date.getUTCDay();
    console.log(gregorianDayOfWeek)

    // Step 6: Return the corresponding Ethiopian weekday
    return ethiopianWeekdays[gregorianDayOfWeek];
}

// Example usage
const dayOfWeek = getEthiopianDayOfWeek(2016, "Meskerem", 22);
console.log(dayOfWeek);  // Output: Should return the correct day of the week considering 7:00 AM CET


// Helper function to calculate dates of fasting and holy days based on Nineveh
function calculateFastingDates(ninevehMonth, ninevehDay) {
    const fastingAndHolyDays = [
        { name: "አብይ ጾም", tewsak: 14 },
        { name: "ደብረ ዘይት", tewsak: 41 },
        { name: "ሆሳእና", tewsak: 62 },
        { name: "ስቅለት", tewsak: 67 },
        { name: "ትንሳኤ", tewsak: 69 },
        { name: "ርክበ ካህናት", tewsak: 93 },
        { name: "እርገት", tewsak: 108 },
        { name: "ጰራቅሊጦስ", tewsak: 118 },
        { name: "ጾመ ሐዋርያት", tewsak: 119 },
        { name: "ጾመ ድህነት", tewsak: 121 }
    ];

    const results = fastingAndHolyDays.map(day => {
        const totalDays = ninevehDay + day.tewsak;
        const [month, dayOfMonth] = addDaysToEthiopianDate(ninevehMonth, ninevehDay, day.tewsak);
        return { name: day.name, month, day: dayOfMonth };
    });

    return results;
}

// Helper function to add days to a date in the Ethiopian calendar
function addDaysToEthiopianDate(startMonth, startDay, daysToAdd) {
    const months = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
    let currentMonthIndex = months.indexOf(startMonth);
    let currentDay = startDay;

    while (daysToAdd > 0) {
        const daysInCurrentMonth = currentMonthIndex === 12 ? 5 : 30; // Pagumen has 5 days
        const remainingDaysInMonth = daysInCurrentMonth - currentDay;

        if (daysToAdd <= remainingDaysInMonth) {
            currentDay += daysToAdd;
            daysToAdd = 0;
        } else {
            daysToAdd -= remainingDaysInMonth + 1; // Move to the next month
            currentDay = 1;
            currentMonthIndex = (currentMonthIndex + 1) % months.length;
        }
    }

    return [months[currentMonthIndex], currentDay];
}

// Display fasting and holy days
function displayFastingDates(fastingDates) {
    const fastingTable = document.getElementById('fastingTable');
    fastingTable.innerHTML = '';  // Clear previous results
    fastingDates.forEach(day => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.innerText = day.name;
        const dateCell = document.createElement('td');
        dateCell.innerText = `${day.month} ${day.day}`;
        row.appendChild(nameCell);
        row.appendChild(dateCell);
        fastingTable.appendChild(row);
    });
}
