window.onload = function() {
    // Set default Ethiopian year to the current Ethiopian year (assuming current Gregorian year 2024 -> 2016 Ethiopian)
    const currentGregorianYear = new Date().getFullYear();
    const currentEthiopianYear = currentGregorianYear - 8;
    document.getElementById('ethiopianYear').value = currentEthiopianYear;
    calculateCalendar();
};

function calculateCalendar() {
    const ethiopianYear = parseInt(document.getElementById('ethiopianYear').value);
    
    // Step 1: Calculate Amete Alem
    const yearsBeforeChrist = 5500;
    const ameteAlem = yearsBeforeChrist + ethiopianYear;
    document.getElementById('ameteAlem').innerText = ameteAlem;

    // Step 2: Calculate Evangelist (Wengelawi)
    const evangelists = ["Yohannes (John)", "Mathewos (Matthew)", "Markos (Mark)", "Lukas (Luke)"];
    const wengelawiIndex = ameteAlem % 4;
    const wengelawi = evangelists[wengelawiIndex];
    document.getElementById('wengelawi').innerText = wengelawi;

    // Step 3: Calculate Metene Rabiet and Tinte Qemer (Day of New Year)
    const meteneRabiet = Math.floor(ameteAlem / 4);
    const tinteQemer = (ameteAlem + meteneRabiet) % 7;
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    document.getElementById('tinteQemer').innerText = daysOfWeek[tinteQemer];

    // Step 4: Calculate Medeb and Wenber
    const medeb = ameteAlem % 19;
    const wenber = medeb === 0 ? 18 : medeb - 1;
    document.getElementById('medeb').innerText = medeb;
    document.getElementById('wenber').innerText = wenber;

    // Step 5: Calculate Abektie and Metqi
    const abektie = (wenber * 11) % 30;
    const metqi = (wenber * 19) % 30;
    document.getElementById('abektie').innerText = abektie;
    document.getElementById('metqi').innerText = metqi;

    // Step 6: Calculate Beale Metqi
    const bealeMetqi = metqi > 14 ? metqi : metqi + 30;
    document.getElementById('bealeMetqi').innerText = bealeMetqi;

    // Step 7: Calculate Mebaja Hamer (Nineveh)
    const tewsakOfDay = 8; // Assuming Beale Metqi falls on a Saturday, its Tewsak is 8.
    const mebajaHamer = (bealeMetqi + tewsakOfDay) % 30;
    const nineveh = `Meskerem ${mebajaHamer}`;  // Nineveh is always in Meskerem.
    document.getElementById('mebajaHamer').innerText = nineveh;

    // Step 8: Calculate fasting and holy days based on Nineveh
    const fastingDates = calculateFastingDates(mebajaHamer);
    displayFastingDates(fastingDates);
}

// Helper function to calculate dates of fasting and holy days based on Nineveh
function calculateFastingDates(ninevehDay) {
    const fastingAndHolyDays = [
        { name: "Abiy Tsome", tewsak: 14 },
        { name: "Debre Zeit", tewsak: 41 },
        { name: "Hosanna", tewsak: 62 },
        { name: "Good Friday (Siklet)", tewsak: 67 },
        { name: "Tinsaye (Resurrection)", tewsak: 69 },
        { name: "Rkbe Kahnat", tewsak: 93 },
        { name: "Ascension", tewsak: 108 },
        { name: "Paraclete", tewsak: 118 },
        { name: "Fast of the Holy Apostles", tewsak: 119 },
        { name: "Weekly Fast (Wednesday and Friday)", tewsak: 121 }
    ];

    const results = fastingAndHolyDays.map(day => {
        const totalDays = ninevehDay + day.tewsak;
        const [month, dayOfMonth] = addDaysToEthiopianDate("Meskerem", ninevehDay, day.tewsak);
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
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = '';  // Clear previous results
    fastingDates.forEach(day => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.innerText = day.name;
        const dateCell = document.createElement('td');
        dateCell.innerText = `${day.month} ${day.day}`;
        row.appendChild(nameCell);
        row.appendChild(dateCell);
        resultTable.appendChild(row);
    });
}