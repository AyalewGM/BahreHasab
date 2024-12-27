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
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Amete Alem} = \text{Years Before Christ} + \text{Ethiopian Year}" /></p>
where Years Before Christ is 5500.

### Evangelist (Wengelawi)

The Evangelist is determined by:
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Wengelawi Index} = \text{Amete Alem} \% 4" /></p>
The Evangelists are ["ዮሐንስ", "ማቴዎስ", "ማርቆስ", "ሉቃስ"].

### Tinte Qemer

The Tinte Qemer is calculated as:
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Metene Rabiet} = \left\lfloor \frac{\text{Amete Alem}}{4} \right\rfloor" /></p>
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Tinte Qemer} = (\text{Metene Rabiet} + \text{Amete Alem}) \% 7" /></p>

### Medeb and Wenber

The Medeb and Wenber are calculated as:
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Medeb} = (\text{Amete Alem} \% 19)" /></p>
If Medeb is 0, it is set to 19.
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Wenber} = \text{Medeb} - 1" /></p>

### Abektie and Metqi

The Abektie and Metqi are calculated as:
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Abektie} = (\text{Wenber} \times 11) \% 30" /></p>
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Metqi} = 30 - \text{Abektie}" /></p>

### Beale Metqi

The Beale Metqi is determined by the Metqi value:
- If Metqi > 14, Beale Metqi is in Meskerem.
- Otherwise, Beale Metqi is in Tikimt.

### Mebaja Hamer

The Mebaja Hamer is calculated as:
<p align="center"><img src="https://latex.codecogs.com/svg.latex?\text{Mebaja Hamer} = \text{Beale Metqi Day} + \text{Tewsak of Day}" /></p>
If Mebaja Hamer exceeds 30, it is adjusted to the next month.

### Fasting and Holy Days

Fasting and holy days are calculated based on the Mebaja Hamer date using predefined Tewsak values for each observance.

## Usage

1. Open the `index.html` file in a web browser.
2. Enter the Ethiopian year in the input field.
3. Click the "Calculate" button to display the calculated dates and observances.

## License

This project is licensed under the MIT License.
