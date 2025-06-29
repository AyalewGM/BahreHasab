
//Ayalew G Mersha, October 1, 2024 
//Bahre Hasab

window.onload = function() {
    const currentDate = getCurrentEthiopianDate();
    document.getElementById('ethiopianYear').value = currentDate.year;

    // Trigger calculation on page load
    calculateCalendar();
    generateEthiopianCalendar(currentDate.year, currentDate.month, currentDate.day);

    // Add event listener for the year change
    document.getElementById('ethiopianYear').addEventListener('change', calculateCalendar);
    const numeralSelect = document.getElementById('numeralSystem');
    if (numeralSelect) {
        numeralSelect.addEventListener('change', () => {
            calculateCalendar();
            const c = getCurrentEthiopianDate();
            generateEthiopianCalendar(c.year, c.month, c.day);
        });
    }
};

function updateResult(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value;
    }
}

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

function computeCalendarValues(ethiopianYear) {
    const yearsBeforeChrist = 5500;
    const ameteAlem = yearsBeforeChrist + ethiopianYear;

    const evangelists = ["ዮሐንስ", "ማቴዎስ", "ማርቆስ", "ሉቃስ"];
    const wengelawiIndex = ameteAlem % 4;
    const wengelawi = evangelists[wengelawiIndex];

    const meteneRabiet = Math.floor(ameteAlem / 4);
    const tinteQemer = (meteneRabiet + ameteAlem) % 7;
    const ameteAlemQ = ameteAlem % 19;

    const medeb = ameteAlemQ === 0 ? 19 : ameteAlemQ;
    const wenber = medeb - 1;
    const abektie = (wenber * 11) % 30;
    const metqi = 30 - abektie;
    const tinteQemerTable = {
        0: "Monday",
        1: "Tuesday",
        2: "Wednesday",
        3: "Thursday",
        4: "Friday",
        5: "Saturday",
        6: "Sunday",
    };
    const tinteQemerDate = tinteQemerTable[tinteQemer];

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

    const bealeMetqiDayOfWeek = getEthiopianDayOfWeek(
        tinteQemerDate,
        bealeMetqiMonth + " " + bealeMetqiDay
    );

    const tewsakTable = {
        Sunday: 7,
        Monday: 6,
        Tuesday: 5,
        Wednesday: 4,
        Thursday: 3,
        Friday: 2,
        Saturday: 8,
    };

    let mebajaHamer = bealeMetqiDay + tewsakTable[bealeMetqiDayOfWeek];
    if (mebajaHamer > 30) {
        mebajaHamer -= 30;
        ninevehMonth = "Yekatit";
    }

    const fastingDates = calculateFastingDates(ninevehMonth, mebajaHamer);

    return {
        ameteAlem,
        wengelawi,
        tinteQemerDate,
        medeb,
        wenber,
        abektie,
        metqi,
        bealeMetqiMonth,
        bealeMetqiDay,
        bealeMetqiDayOfWeek,
        ninevehMonth,
        mebajaHamer,
        fastingDates,
    };
}

function renderCalendar(values) {
    updateResult("ameteAlem", formatNumber(values.ameteAlem));
    updateResult("wengelawi", values.wengelawi);
    window.firstDayOfYear = values.tinteQemerDate;
    updateResult(
        "tinteQemer",
        `መስከረም ${formatNumber(1)} (${mapWeekDaysToAmharic(values.tinteQemerDate)})`
    );
    updateResult("medeb", formatNumber(values.medeb));
    updateResult("wenber", formatNumber(values.wenber));
    updateResult("abektie", formatNumber(values.abektie));
    updateResult("metqi", formatNumber(values.metqi));
    updateResult(
        "bealeMetqi",
        `${mapMonthToAmharic(values.bealeMetqiMonth)} ${formatNumber(
            values.bealeMetqiDay
        )} (${mapWeekDaysToAmharic(values.bealeMetqiDayOfWeek)})`
    );
    updateResult(
        "mebajaHamer",
        `${mapMonthToAmharic(values.ninevehMonth)} ${formatNumber(values.mebajaHamer)}`
    );
    displayFastingDates(values.fastingDates);
}

function calculateCalendar() {
    const ethiopianYear = parseInt(document.getElementById("ethiopianYear").value);
    const values = computeCalendarValues(ethiopianYear);
    renderCalendar(values);
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

// Convert Arabic numerals to Geez numerals
function toGeez(num) {
    if (num === 0) return '0';
    const digits = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
    const tens   = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
    const hundred = '፻';
    const tenThousand = '፼';

    let result = '';
    let n = num;

    if (n >= 10000) {
        const t = Math.floor(n / 10000);
        result += toGeez(t) + tenThousand;
        n = n % 10000;
    }

    if (n >= 100) {
        const h = Math.floor(n / 100);
        if (h > 1) result += toGeez(h);
        result += hundred;
        n = n % 100;
    }

    if (n >= 10) {
        const t = Math.floor(n / 10);
        result += tens[t];
        n = n % 10;
    }

    if (n > 0) {
        result += digits[n];
    }

    return result;
}

function isGeezNumeral() {
    const select = document.getElementById('numeralSystem');
    return select && select.value === 'geez';
}

function formatNumber(num) {
    return isGeezNumeral() ? toGeez(num) : num;
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
        "Tahisas": 30,
        "Tirr": 30,
        "Yekatit": 30,
        "Megabit": 30,
        "Miazia": 30,
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
        dateCell.innerText = `${day.month} ${formatNumber(day.day)}`;
        row.appendChild(nameCell);
        row.appendChild(dateCell);
        fastingTable.appendChild(row);
    });
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

function generateEthiopianCalendar(year, month, day) {
    const container = document.getElementById('ethiopian-calendar');
    container.innerHTML = `<h4>${mapMonthToAmharic(month)} ${formatNumber(year)}</h4>`;

    const table = document.createElement('table');
    table.className = 'table table-bordered';

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
    const firstDay = getEthiopianDayOfWeek(window.firstDayOfYear, `${month} 1`);
    const dayIndex = {"Sunday":0,"Monday":1,"Tuesday":2,"Wednesday":3,"Thursday":4,"Friday":5,"Saturday":6};

    let row = document.createElement('tr');
    for (let i = 0; i < dayIndex[firstDay]; i++) {
        row.appendChild(document.createElement('td'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        if (row.children.length === 7) {
            tbody.appendChild(row);
            row = document.createElement('tr');
        }
        const cell = document.createElement('td');
        cell.innerText = formatNumber(d);
        if (d === day) {
            cell.classList.add('current-day');
        }
        row.appendChild(cell);
    }

    while (row.children.length && row.children.length < 7) {
        row.appendChild(document.createElement('td'));
    }
    tbody.appendChild(row);
    table.appendChild(tbody);
    container.appendChild(table);
}
