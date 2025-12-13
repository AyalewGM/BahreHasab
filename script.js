
//Ayalew G Mersha, October 1, 2024 
//Bahre Hasab

window.onload = function() {
    // Find current Ethiopian year
    //const currentGregorianYear = new Date().getFullYear();
    const currentEthiopianYear = calculateCurrentEthiopianYear();
    //Read from the textbox
    document.getElementById('ethiopianYear').value = currentEthiopianYear;

    // Show current Ethiopian year and today's Gregorian date
    const currentEthYearDisplay = document.getElementById('currentEthiopianYearDisplay');
    const currentGregDateDisplay = document.getElementById('currentGregorianDateDisplay');
    const currentEthFullDateDisplay = document.getElementById('currentEthiopianFullDate');
    if (currentEthYearDisplay) {
        currentEthYearDisplay.innerText = formatNumber(currentEthiopianYear);
    }
    if (currentGregDateDisplay) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        currentGregDateDisplay.innerText = today.toLocaleDateString(undefined, options);
    }
    if (currentEthFullDateDisplay) {
        const d = getCurrentEthiopianDate();
        const ethMonthName = mapMonthToAmharic(d.month);
        const ethDay = formatNumber(d.day);
        const ethYear = formatNumber(d.year);
        const gregForEth = ethiopianToGregorianDate(d.year, d.month, d.day);
        const weekdayEn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][gregForEth.getDay()];
        const weekdayAm = mapWeekDaysToAmharic(weekdayEn);
        currentEthFullDateDisplay.innerText = `${weekdayAm} - ${ethMonthName} ${ethDay} ${ethYear}`;
    }

    // Trigger calculation on page load
    calculateCalendar();

    // Add event listener for the year change
    document.getElementById('ethiopianYear').addEventListener('change', calculateCalendar);

    // Recalculate when numeral system changes
    const numeralRadios = document.querySelectorAll('input[name="numeralSystem"]');
    numeralRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            // Update current Ethiopian year display with new numeral system
            if (currentEthYearDisplay) {
                const yearNow = calculateCurrentEthiopianYear();
                currentEthYearDisplay.innerText = formatNumber(yearNow);
            }
            // Update current Ethiopian full date display with new numeral system
            if (currentEthFullDateDisplay) {
                const d = getCurrentEthiopianDate();
                const ethMonthName = mapMonthToAmharic(d.month);
                const ethDay = formatNumber(d.day);
                const ethYear = formatNumber(d.year);
                const gregForEth = ethiopianToGregorianDate(d.year, d.month, d.day);
                const weekdayEn = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][gregForEth.getDay()];
                const weekdayAm = mapWeekDaysToAmharic(weekdayEn);
                currentEthFullDateDisplay.innerText = `${weekdayAm} - ${ethMonthName} ${ethDay} ${ethYear}`;
            }
            // Re-run calculations so all results switch numerals
            calculateCalendar();

            // Regenerate the Ethiopian calendar so its days reflect the new numeral system
            const currentEthDate = getCurrentEthiopianDate();
            generateEthiopianCalendar(currentEthDate.year, currentEthDate.month, currentEthDate.day);
        });
    });

    // Build current Ethiopian month calendar on load
    const currentEthDate = getCurrentEthiopianDate();
    generateEthiopianCalendar(currentEthDate.year, currentEthDate.month, currentEthDate.day);
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

function getSelectedNumeralSystem() {
    const selected = document.querySelector('input[name="numeralSystem"]:checked');
    return selected ? selected.value : 'arabic';
}

function toGeezNumerals(value) {
    // Simple per-digit mapping to Ethiopic numerals (፩-፱). 0 stays as Latin 0.
    const digitMap = {
        '0': '0',
        '1': '፩',
        '2': '፪',
        '3': '፫',
        '4': '፬',
        '5': '፭',
        '6': '፮',
        '7': '፯',
        '8': '፰',
        '9': '፱'
    };

    // Prefer proper Ethiopic tens for numbers from 1–99 (፩–፱, ፲–፺, ፳፩ … ፺፱)
    const num = Number(value);
    if (Number.isFinite(num) && num >= 1) {
        const unitsMap = {
            1: '፩',
            2: '፪',
            3: '፫',
            4: '፬',
            5: '፭',
            6: '፮',
            7: '፯',
            8: '፰',
            9: '፱'
        };
        const tensMap = {
            10: '፲',
            20: '፳',
            30: '፴',
            40: '፵',
            50: '፶',
            60: '፷',
            70: '፸',
            80: '፹',
            90: '፺'
        };

        function twoDigitToGeez(n) {
            if (n === 0) return '';
            if (n <= 9) return unitsMap[n] || '';
            const tens = Math.floor(n / 10) * 10;
            const unit = n % 10;
            const tensChar = tensMap[tens];
            if (!tensChar) return '';
            if (unit === 0) return tensChar;
            return tensChar + (unitsMap[unit] || '');
        }

        // 1–99: use pure tens/units mapping
        if (num < 100) {
            return twoDigitToGeez(num) || String(value);
        }

        // 100–9999: treat as h*100 + r where 1<=h<=99, 0<=r<100
        // Example: 2016 = 20*100 + 16 → ፳፻፲፮, 2030 = 20*100 + 30 → ፳፻፴
        if (num >= 100 && num < 10000) {
            const hundredsFactor = Math.floor(num / 100); // h
            const remainder = num % 100;                  // r

            const head = twoDigitToGeez(hundredsFactor);
            const tail = twoDigitToGeez(remainder);

            if (!head) {
                // Fallback if we somehow cannot represent the hundreds factor
                return String(value).split('')
                    .map(function (ch) { return Object.prototype.hasOwnProperty.call(digitMap, ch) ? digitMap[ch] : ch; })
                    .join('');
            }

            return tail ? head + '፻' + tail : head + '፻';
        }
    }

    // Fallback: map each digit independently (used for values outside handled ranges)
    return String(value).split('').map(function (ch) {
        return Object.prototype.hasOwnProperty.call(digitMap, ch) ? digitMap[ch] : ch;
    }).join('');
}

function formatNumber(value) {
    const system = getSelectedNumeralSystem();
    if (system === 'geez') {
        return toGeezNumerals(value);
    }
    return String(value);
}

function getCurrentEthiopianDate() {
    const today = new Date();
    let year = calculateCurrentEthiopianYear();

    let isLeap = ((year + 1) % 4 === 0);
    let gYear = year + 7;
    let newYear = new Date(gYear, 8, isLeap ? 12 : 11);
    if (today < newYear) {
        year -= 1;
        isLeap = ((year + 1) % 4 === 0);
        gYear = year + 7;
        newYear = new Date(gYear, 8, isLeap ? 12 : 11);
    }

    let diff = Math.floor((today - newYear) / (1000 * 60 * 60 * 24));
    const months = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
    const monthLengths = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, isLeap ? 6 : 5];
    let monthIndex = 0;
    while (diff >= monthLengths[monthIndex]) {
        diff -= monthLengths[monthIndex];
        monthIndex++;
    }
    const month = months[monthIndex];
    const day = diff + 1;
    return { year, month, day };
}

function ethiopianToGregorianDate(year, month, day) {
    // Compute Gregorian date corresponding to a given Ethiopian date in the same style as getCurrentEthiopianDate
    let isLeap = ((year + 1) % 4 === 0);
    let gYear = year + 7;
    let newYear = new Date(gYear, 8, isLeap ? 12 : 11);

    const months = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
    const monthLengths = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, isLeap ? 6 : 5];

    let offset = 0;
    for (let i = 0; i < months.length; i++) {
        if (months[i] === month) {
            break;
        }
        offset += monthLengths[i];
    }
    offset += (day - 1);

    const result = new Date(newYear.getTime());
    result.setDate(result.getDate() + offset);
    return result;
}

function generateEthiopianCalendar(year, month, currentDay) {
    const container = document.getElementById('ethiopian-calendar');
    if (!container) return;

    container.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'calendar-eth-header';
    const title = document.createElement('div');
    title.className = 'calendar-eth-title';
    title.innerText = `${mapMonthToAmharic(month)} ${formatNumber(year)}`;
    const sub = document.createElement('div');
    sub.className = 'calendar-eth-subtitle';
    sub.innerText = '';
    header.appendChild(title);
    header.appendChild(sub);
    container.appendChild(header);

    const table = document.createElement('table');
    table.className = 'table table-bordered calendar-eth-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    weekdays.forEach(w => {
        const th = document.createElement('th');
        th.innerText = mapWeekDaysToAmharic(w);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const daysInMonth = month === 'Pagumen' ? ((year + 1) % 4 === 0 ? 6 : 5) : 30;

    const firstGregDate = ethiopianToGregorianDate(year, month, 1);
    const firstWeekdayIndex = firstGregDate.getDay(); // 0=Sunday

    let row = document.createElement('tr');
    for (let i = 0; i < firstWeekdayIndex; i++) {
        row.appendChild(document.createElement('td'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        if (row.children.length === 7) {
            tbody.appendChild(row);
            row = document.createElement('tr');
        }
        const cell = document.createElement('td');

        const ethSpan = document.createElement('span');
        ethSpan.className = 'calendar-eth-day-eth';
        ethSpan.innerText = formatNumber(d);

        const gregSpan = document.createElement('span');
        gregSpan.className = 'calendar-eth-day-greg';
        const gregDate = ethiopianToGregorianDate(year, month, d);
        gregSpan.innerText = gregDate.getDate();

        if (d === currentDay) {
            cell.classList.add('calendar-eth-current-day');
        }

        cell.appendChild(ethSpan);
        cell.appendChild(gregSpan);
        row.appendChild(cell);
    }

    while (row.children.length && row.children.length < 7) {
        row.appendChild(document.createElement('td'));
    }
    tbody.appendChild(row);
    table.appendChild(tbody);
    container.appendChild(table);
}

function calculateCalendar() {
    const ethiopianYear = parseInt(document.getElementById('ethiopianYear').value);
    const resultTableBody = document.getElementById('resultTable');
    const fastingTableBody = document.getElementById('fastingTable');

    [resultTableBody, fastingTableBody].forEach(function (el) {
        if (!el) return;
        el.classList.remove('fade-in-soft');
        // Force reflow so the animation can restart
        void el.offsetWidth;
        el.classList.add('fade-in-soft');
    });
    
    // Step 1: Calculate Amete Alem
    const yearsBeforeChrist = 5500;
    const ameteAlem = yearsBeforeChrist + ethiopianYear;
    document.getElementById('ameteAlem').innerText = formatNumber(ameteAlem);

    // Step 2: Calculate Evangelist (Wengelawi)
    const evangelists = ["ዮሐንስ", "ማቴዎስ", "ማርቆስ", "ሉቃስ"];
    const wengelawiIndex = ameteAlem % 4;
    const wengelawi = evangelists[wengelawiIndex];
    document.getElementById('wengelawi').innerText = wengelawi;

    // Step 3: Calculate the correct day of New Year (Tinte Qemer)
    // ይህ አልሰራም፡፡
    // const tinteQemer = getEthiopianDayOfWeek(ethiopianYear, "Meskerem", 1);

    // Step 4: Calculate Metene Rabiet, Medeb, Wenber, Abektie, and Metqi

    const meteneRabiet = Math.floor(ameteAlem / 4);
    const tinteQemer = (meteneRabiet + ameteAlem) % 7

    let ameteAlemQ = ameteAlem % 19;

    const medeb = ameteAlemQ === 0 ? 19 : ameteAlemQ;
    const wenber = medeb - 1;
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

    const newYearDayLabel = formatNumber(1);
    document.getElementById('tinteQemer').innerText = `መስከረም ${newYearDayLabel} (${mapWeekDaysToAmharic(tinteQemerDate)})`;

    document.getElementById('medeb').innerText   = formatNumber(medeb);
    document.getElementById('wenber').innerText  = formatNumber(wenber);
    document.getElementById('abektie').innerText = formatNumber(abektie);
    document.getElementById('metqi').innerText   = formatNumber(metqi);

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
    let bealeMetqiDayOfWeek = getEthiopianDayOfWeek(tinteQemerDate, bealeMetqiMonth + " " + bealeMetqiDay);
   //let bealeMetqiDayOfWeek = getEthiopianDayOfWeek(ethiopianYear, bealeMetqiMonth, bealeMetqiDay);

    // Shift Beale Metqi Day of the Week to the Previous Day
    //bealeMetqiDayOfWeek = shiftDayToPrevious(bealeMetqiDayOfWeek);

    const bealeMetqiDayLabel = formatNumber(bealeMetqiDay);
    document.getElementById('bealeMetqi').innerText = `${mapMonthToAmharic(bealeMetqiMonth)} ${bealeMetqiDayLabel} (${mapWeekDaysToAmharic(bealeMetqiDayOfWeek)})`;

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
    const mebajaHamerLabel = formatNumber(mebajaHamer);
    document.getElementById('mebajaHamer').innerText = `${mapMonthToAmharic(ninevehMonth)} ${mebajaHamerLabel}`;

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
function getEthiopianDayOfWeek(startingDay, targetDate) {
    /**
     * Calculate the day of the week for a given Ethiopian date, counting from Meskerem 1.
     *
     * @param {string} startingDay - The day of the week for Meskerem 1 (e.g., 'Tuesday').
     * @param {string} targetDate - The target Ethiopian date in the format "Month Day" (e.g., 'Tirr 28').
     *
     * @returns {string} The day of the week corresponding to the given Ethiopian date.
     */

    // Map day names to indices (Sunday=0, Monday=1, ..., Saturday=6)
    const dayIndex = {"Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6};

    // Ethiopian calendar month order and their number of days
    const ethiopianMonthDays = {
        "Meskerem": 30,
        "Tikimt": 30,
        "Hidar": 30,
        "Tahsas": 30,
        "Tir": 30,
        "Yekatit": 30,
        "Megabit": 30,
        "Miyazya": 30,
        "Ginbot": 30,
        "Sene": 30,
        "Hamle": 30,
        "Nehase": 30,
        "Pagumen": 5  // 6 in leap year
    };

    // Extract the month and day from the target date
    let [month, day] = targetDate.split(" ");
    day = parseInt(day, 10); // Convert day to an integer

    // Validate inputs
    if (!ethiopianMonthDays.hasOwnProperty(month)) {
        throw new Error(`Invalid month name: ${month}`);
    }

    if (day < 1 || day > ethiopianMonthDays[month]) {
        throw new Error(`Invalid day for ${month}: ${day}`);
    }

    if (!dayIndex.hasOwnProperty(startingDay)) {
        throw new Error(`Invalid starting day of the week: ${startingDay}`);
    }

    // Calculate the total days from Meskerem 1 to the target date
    let totalDays = 0;

    for (const [monthName, daysInMonth] of Object.entries(ethiopianMonthDays)) {
        if (monthName === month) { // When we reach the target month, add only the specific day number
            totalDays += (day - 1); // Subtract 1 because Meskerem 1 is already counted
            break;
        }
        totalDays += daysInMonth; // Add full days of the previous months
    }

    // Calculate the day of the week for the target date
    const startDayIndex = dayIndex[startingDay]; // Index of the starting day (e.g., Tuesday = 2)
    const dayOfWeekIndex = (startDayIndex + totalDays) % 7; // Calculate day of the week index

    // Reverse map index back to day name
    const indexToDay = Object.fromEntries(Object.entries(dayIndex).map(([k, v]) => [v, k]));
    const resultDayOfWeek = indexToDay[dayOfWeekIndex];

    return resultDayOfWeek;
}
//
//
//function getEthiopianDayOfWeek(ethiopianYear, ethiopianMonth, ethiopianDay) {
//    // Ethiopian months array
//    const ethiopianMonths = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
//
//    // Ethiopian weekdays array
//    const ethiopianWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//
//    // Step 1: Determine the Gregorian year equivalent for the given Ethiopian year
//    //const gregorianYear = convertEthiopianToGregorian(ethiopianYear, ethiopianMonth, ethiopianDay); // Ethiopian year is 7-8 years behind Gregorian
//    const gregorianYear = getGregorianYear(ethiopianYear, ethiopianMonth)
//    // Step 2: Determine the Gregorian date of Meskerem 1 (New Year)
//    let meskerem1Date = new Date(Date.UTC(gregorianYear, 8, 11, 7, 0, 0)); // Meskerem 1 at 7:00 AM CET (September 11 UTC)
//
//    // Handle Ethiopian leap years (Meskerem 1 moves to September 12 in a leap year)
//    if ((ethiopianYear + 1) % 4 === 0) {
//        meskerem1Date = new Date(Date.UTC(gregorianYear, 8, 12, 7, 0, 0)); // September 12 UTC at 7:00 AM CET
//    }
//
//    // Step 3: Calculate the total number of days from Meskerem 1 to the given Ethiopian date
//    const monthIndex = ethiopianMonths.indexOf(ethiopianMonth);
//    const ethiopianMonthsDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Pagumen has 5 days
//
//    let daysFromMeskerem1 = ethiopianDay - 1; // Subtract 1 since Meskerem 1 is the start of the year
//
//    // Add the days for each full month up to the given month
//    for (let i = 0; i < monthIndex; i++) {
//        daysFromMeskerem1 += ethiopianMonthsDays[i];
//    }
//
//    // Step 4: Add the calculated days to Meskerem 1 to get the Gregorian date
//    meskerem1Date.setUTCDate(meskerem1Date.getUTCDate() + daysFromMeskerem1);
//
//    // Step 5: Get the Gregorian day of the week at 7:00 AM Central European Time (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//    const gregorianDayOfWeek = meskerem1Date.getUTCDay();
//    console.log(gregorianDayOfWeek)
//
//    // Step 6: Return the corresponding Ethiopian weekday
//    return ethiopianWeekdays[gregorianDayOfWeek];
//}


//function convertEthiopianToGregorian(ethiopianYear, ethiopianMonth, ethiopianDay) {
//    // Ethiopian months array
//    const ethiopianMonths = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
//
//    // Ethiopian weekdays array
//    const ethiopianMonthsDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Regular year, 5 days in Pagumen
//
//    // Step 1: Check if the Ethiopian year is a leap year
//    const isEthiopianLeapYear = (ethiopianYear % 4 === 3); // Ethiopian leap year every 4 years
//    if (isEthiopianLeapYear) {
//        ethiopianMonthsDays[12] = 6; // Pagumen has 6 days in an Ethiopian leap year
//    }
//
//    // Step 2: Determine the Gregorian year equivalent
//    let gregorianYear;
//    const monthIndex = ethiopianMonths.indexOf(ethiopianMonth);
//
//    // If the Ethiopian date is between Meskerem 1 and Tahsas 30, the Gregorian year is 7 years ahead
//    // If the Ethiopian date is between Tirr 1 and Pagumen, the Gregorian year is 8 years ahead
//    if (monthIndex <= 3) {
//        gregorianYear = ethiopianYear + 7;
//    } else {
//        gregorianYear = ethiopianYear + 8;
//    }
//
//    // Step 3: Calculate the Gregorian equivalent of Meskerem 1
//    let meskerem1Date = new Date(gregorianYear, 8, 11); // Meskerem 1 is September 11 in a normal year
//
//    // Adjust for Ethiopian leap years (Meskerem 1 moves to September 12 in Ethiopian leap years)
//    if ((ethiopianYear + 1) % 4 === 0) {
//        meskerem1Date = new Date(gregorianYear, 8, 12); // Meskerem 1 is September 12 in Ethiopian leap years
//    }
//
//    // Step 4: Calculate the total number of days from Meskerem 1 to the given Ethiopian date
//    let daysFromMeskerem1 = ethiopianDay - 1; // Start counting from Meskerem 1
//
//    // Add the number of days for each full month up to the given month
//    for (let i = 0; i < monthIndex; i++) {
//        daysFromMeskerem1 += ethiopianMonthsDays[i];
//    }
//
//    // Step 5: Add the calculated days to Meskerem 1 to get the Gregorian date
//    meskerem1Date.setDate(meskerem1Date.getDate() + daysFromMeskerem1);
//
//    // Return the Gregorian year, month, and day
//    const gregorianMonth = meskerem1Date.getMonth() + 1; // Month is 0-indexed in JavaScript
//    const gregorianDay = meskerem1Date.getDate();
//
//    return {
//        year: meskerem1Date.getFullYear(),
//        month: gregorianMonth,
//        day: gregorianDay
//    };
//}

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
//function getGregorianYear(ethiopianYear, ethiopianMonth) {
//
//    const ethiopianMonths = ["Meskerem", "Tikimt", "Hidar", "Tahisas", "Tirr", "Yekatit", "Megabit", "Miazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagumen"];
//
//    // Step 1: Find the index of the Ethiopian month
//    const monthIndex = ethiopianMonths.indexOf(ethiopianMonth);
//
//    // Step 2: If the month is between Meskerem (index 0) and Tahsas (index 3), the Gregorian year is 7 years ahead
//    // If the month is between Tirr (index 4) and Pagumen (index 12), the Gregorian year is 8 years ahead
//    if (monthIndex <= 3) {
//        return ethiopianYear + 7;
//    } else {
//        return ethiopianYear + 8;
//    }
//}

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
        const item = document.createElement('div');
        item.className = 'fasting-item row align-items-center';

        const nameCol = document.createElement('div');
        nameCol.className = 'col-7 col-md-8 fasting-item-name';
        nameCol.innerText = day.name;

        const dateCol = document.createElement('div');
        dateCol.className = 'col-5 col-md-4 text-end fasting-item-date';
        const formattedDay = formatNumber(day.day);
        const pill = document.createElement('span');
        pill.className = 'fasting-date-pill';
        pill.innerText = `${day.month} ${formattedDay}`;

        dateCol.appendChild(pill);
        item.appendChild(nameCol);
        item.appendChild(dateCol);

        fastingTable.appendChild(item);
    });
}
