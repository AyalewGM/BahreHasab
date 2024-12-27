# Bahre Hasab

This project calculates various Ethiopian calendar dates and religious observances based on the Ethiopian year input. The calculations are based on traditional Ethiopian calendar rules and mathematica[...]

## Table of Contents

- [Overview](#overview)
- [Calculations](#calculations)
  - [Amete Alem](#amete-alem)
  - [Evangelist (Wengelawi)](#evangelist-wengelawi)
  - [Tinte Qemer](#tinte-qemer)
  - [Medeb and Wenber](#medeb-and-wenber)
  - [Abektie and Metqi](#abektie-and-metqi)
  - [Beale Metqi](#beale-metqi)
  - [Mebaja Hamer](#mebaja-hamer)
  - [Fasting and Holy Days](#fasting-and-holy-days)
- [Usage](#usage)

## Overview

The project calculates various dates and observances in the Ethiopian calendar based on the input Ethiopian year. The calculations include the Amete Alem, Evangelist, Tinte Qemer, Medeb, Wenber, Abekt[...]

## Calculations

### Amete Alem

The Amete Alem is calculated as:
Amete Alem = Years Before Christ + Ethiopian Year
where Years Before Christ is 5500.

### Evangelist (Wengelawi)

The Evangelist is determined by:
Wengelawi Index = Amete Alem % 4
The Evangelists are ["ዮሐንስ", "ማቴዎስ", "ማርቆስ", "ሉቃስ"].

### Tinte Qemer

The Tinte Qemer is calculated as:
Metene Rabiet = floor(Amete Alem / 4)
Tinte Qemer = (Metene Rabiet + Amete Alem) % 7

### Medeb and Wenber

The Medeb and Wenber are calculated as:
Medeb = Amete Alem % 19
If Medeb is 0, it is set to 19.
Wenber = Medeb - 1

### Abektie and Metqi

The Abektie and Metqi are calculated as:
Abektie = (Wenber * 11) % 30
Metqi = 30 - Abektie

### Beale Metqi

The Beale Metqi is determined by the Metqi value:
- If Metqi > 14, Beale Metqi is in Meskerem.
- Otherwise, Beale Metqi is in Tikimt.

### Mebaja Hamer

The Mebaja Hamer is calculated as:
Mebaja Hamer = Beale Metqi Day + Tewsak of Day
If Mebaja Hamer exceeds 30, it is adjusted to the next month.

### Fasting and Holy Days

Fasting and holy days are calculated based on the Mebaja Hamer date using predefined Tewsak values for each observance.

## Usage

1. Open the `index.html` file in a web browser.
2. Enter the Ethiopian year in the input field.
3. Click the "Calculate" button to display the calculated dates and observances.

## License

This project is licensed under the MIT License.
