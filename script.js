
//Ayalew G Mersha, October 1, 2024 
//Bahre Hasab

window.onload = function() {
    // Find current Ethiopian year
    //const currentGregorianYear = new Date().getFullYear();
    const currentEthiopianYear = calculateCurrentEthiopianYear();
    //Read from the textbox
    document.getElementById('ethiopianYear').value = currentEthiopianYear;
    
    // Trigger calculation on page load
    calculateCalendar();

    // Add event listener for the year change
    document.getElementById('ethiopianYear').addEventListener('change', calculateCalendar);
};

function calculateCurrentEthiopianYear() {
    const today = new Date(); // Get current date
    const gregorianYear = today.getFullYear(); // Current Gregorian year
    const gregorianMonth = today.getMonth(); // 0 = January, 1 = February, ..., 11 = December
    const gregorianDay = today.getDate(); // Day of the month

    // Step 1: Determine if the current year is a Gregorian leap year
    const isGregorianLeapYear = (gregorianYear % 4 === 0 && (gregorianYear % 100 !== 0 || gregorianYear % 400 === 0));

    // Step 2: Define the cutoff date for the Ethiopian New Year (Meskerem 1)
    const ethiopianNewYearDay = isGregorianLeapYear ? 12 : 11; // September 12 in leap years, September 11 otherwise

    // Step 3: Determine the Ethiopian year based on the current date
    if (gregorianMonth < 8 || (gregorianMonth === 8 && gregorianDay < ethiopianNewYearDay)) {
        // If we are before September 11 (or September 12 in a leap year), it's the old Ethiopian year
        return gregorianYear - 8;
    } else {
        // If we are after September 11 (or September 12 in a leap year), it's the new Ethiopian year
        return gregorianYear - 7;
    }
}

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

    //const tinteQemer = getEthiopianDayOfWeek(ethiopianYear, "Meskerem", 1);

    // Step 4: Calculate Metene Rabiet, Medeb, Wenber, Abektie, and Metqi

    const meteneRabiet = Math.floor(ameteAlem / 4);
    const tinteQemer = (meteneRabiet + ameteAlem) % 7

    const medeb = ameteAlem % 19;
    const wenber = medeb === 0 ? 18 : medeb - 1;
    const abektie = (wenber * 11) % 30;
    const metqi = 30 - abektie;
    const tinteQemerTable = {

        0:"Monday",
        1:"Tuesday",
        2:"Wednesday",
        3:"Thursday",
        4:"Friday",
        5:"Saturday",
        6:"Sunday",
    };
    var tinteQemerDate = tinteQemerTable[tinteQemer]
    document.getElementById('tinteQemer').innerText = `መስከረም 1 (${mapWeekDaysToAmharic(tinteQemerDate)})`;

    document.getElementById('medeb').innerText = medeb;
    document.getElementById('wenber').innerText = wenber;
    document.getElementById('abektie').innerText = abektie;
    document.getElementById('metqi').innerText = metqi;

    // Step 5: Calculate Beale Metqi
    let bealeMetqiMonth, ninevehMonth, bealeMetqiDay;
    if (wenber === 0){
     bealeMetqiMonth = "Meskerem";
     bealeMetqiDay = 30;
    }else if (metqi > 14) {
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

    document.getElementById('bealeMetqi').innerText = `${mapMonthToAmharic(bealeMetqiMonth)} ${bealeMetqiDay} (${mapWeekDaysToAmharic(bealeMetqiDayOfWeek)})`;

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
    document.getElementById('mebajaHamer').innerText = `${mapMonthToAmharic(ninevehMonth)} ${mebajaHamer}`;

    // Step 9: Calculate fasting and holy days based on Nineveh
    const fastingDates = calculateFastingDates(ninevehMonth, mebajaHamer);
    displayFastingDates(fastingDates);
}

// የወሮቹን ስም ወደ አማርኛ ቀይር
function mapMonthToAmharic(month) {
    const monthMap = {
       "Meskerem":"መስከረም",
       "Tikimt":"ጥቅምት",
       "Hidar":"ህዳር",
       "Tahisas":"ታህሳስ",
       "Tirr":"ጥር",
       "Yekatit":"የካቲት",
       "Megabit":"መጋቢት",
       "Miazia":"ሚያዚያ",
        "Ginbot":"ግንቦት",
        "Sene":"ሰኔ",
        "Hamle":"ሐምሌ",
        "Nehase":"ነሐሴ",
        "Pagumen":"ጰጉሜ"
    };
    return monthMap[month];
}


// የ እንግሊዝኛውን ቀን ወደ አማርኛ ቀይረው
function mapWeekDaysToAmharic(weekday) {
    const weekdayMap = {
       "Sunday": "እሁድ",
        "Monday": "ሰኞ",
        "Tuesday": "ማክሰኞ",
        "Wednesday": "ረቡእ",
        "Thursday": "ሐሙስ",
        "Friday": "አርብ",
        "Saturday": "ቅዳሜ"
    };
    return weekdayMap[weekday];
}
// የሳምንቱን ቀን አግኝ
function getEthiopianDayOfWeek(ethiopianYear, ethiopianMonth, ethiopianDay) {
    // Ethiopian months array
    const ethiopianMonths = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
    
    // Ethiopian weekdays array
    const ethiopianWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    // Step 1: Determine the Gregorian year equivalent for the given Ethiopian year
    //const gregorianYear = convertEthiopianToGregorian(ethiopianYear, ethiopianMonth, ethiopianDay); // Ethiopian year is 7-8 years behind Gregorian
    const gregorianYear = getGregorianYear(ethiopianYear, ethiopianMonth)
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


function convertEthiopianToGregorian(ethiopianYear, ethiopianMonth, ethiopianDay) {
    // Ethiopian months array
    const ethiopianMonths = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];

    // Ethiopian weekdays array
    const ethiopianMonthsDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Regular year, 5 days in Pagumen

    // Step 1: Check if the Ethiopian year is a leap year
    const isEthiopianLeapYear = (ethiopianYear % 4 === 3); // Ethiopian leap year every 4 years
    if (isEthiopianLeapYear) {
        ethiopianMonthsDays[12] = 6; // Pagumen has 6 days in an Ethiopian leap year
    }

    // Step 2: Determine the Gregorian year equivalent
    let gregorianYear;
    const monthIndex = ethiopianMonths.indexOf(ethiopianMonth);

    // If the Ethiopian date is between Meskerem 1 and Tahsas 30, the Gregorian year is 7 years ahead
    // If the Ethiopian date is between Tirr 1 and Pagumen, the Gregorian year is 8 years ahead
    if (monthIndex <= 3) {
        gregorianYear = ethiopianYear + 7;
    } else {
        gregorianYear = ethiopianYear + 8;
    }

    // Step 3: Calculate the Gregorian equivalent of Meskerem 1
    let meskerem1Date = new Date(gregorianYear, 8, 11); // Meskerem 1 is September 11 in a normal year

    // Adjust for Ethiopian leap years (Meskerem 1 moves to September 12 in Ethiopian leap years)
    if ((ethiopianYear + 1) % 4 === 0) {
        meskerem1Date = new Date(gregorianYear, 8, 12); // Meskerem 1 is September 12 in Ethiopian leap years
    }

    // Step 4: Calculate the total number of days from Meskerem 1 to the given Ethiopian date
    let daysFromMeskerem1 = ethiopianDay - 1; // Start counting from Meskerem 1

    // Add the number of days for each full month up to the given month
    for (let i = 0; i < monthIndex; i++) {
        daysFromMeskerem1 += ethiopianMonthsDays[i];
    }

    // Step 5: Add the calculated days to Meskerem 1 to get the Gregorian date
    meskerem1Date.setDate(meskerem1Date.getDate() + daysFromMeskerem1);

    // Return the Gregorian year, month, and day
    const gregorianMonth = meskerem1Date.getMonth() + 1; // Month is 0-indexed in JavaScript
    const gregorianDay = meskerem1Date.getDate();

    return {
        year: meskerem1Date.getFullYear(),
        month: gregorianMonth,
        day: gregorianDay
    };
}

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

// የፈረንጆቹን አመት አግኝ፡፡
function getGregorianYear(ethiopianYear, ethiopianMonth) {

    const ethiopianMonths = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];

    // Step 1: Find the index of the Ethiopian month
    const monthIndex = ethiopianMonths.indexOf(ethiopianMonth);

    // Step 2: If the month is between Meskerem (index 0) and Tahsas (index 3), the Gregorian year is 7 years ahead
    // If the month is between Tirr (index 4) and Pagumen (index 12), the Gregorian year is 8 years ahead
    if (monthIndex <= 3) {
        return ethiopianYear + 7;
    } else {
        return ethiopianYear + 8;
    }
}

// ስሌት
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

    return [mapMonthToAmharic(months[currentMonthIndex]), currentDay];
}

// አጽዋማት እና በአላት አሳይ
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
