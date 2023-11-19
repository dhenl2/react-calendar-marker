import './App.css';
import * as React from 'react';
// import { ThemeProvider, createTheme } from '@mui/system';
import Calender, { AM_SHIFT, NIGHT_SHIFT, PM_SHIFT } from "./component/Datepicker/Calendar";
import ThemeProvider from "./ThemeProvider";
import { useRef, useState } from "react";

// const theme = createTheme({
//     palette: {
//         background: {
//             paper: '#fff',
//         },
//         text: {
//             primary: '#173A5E',
//             secondary: '#46505A',
//         },
//         action: {
//             active: '#001E3C',
//         },
//         success: {
//             dark: '#009688',
//         },
//     },
// });

function getStyle(styleType) {
    switch (styleType) {
        case "AM":
            return AM_SHIFT;
        case "PM":
            return PM_SHIFT;
        case "NIGHT":
            return NIGHT_SHIFT;
        default:
            throw new Error(`Unknown style type ${styleType}`);
    }
}

function addDate(newDate, shiftType, dates) {
    const newSet = [...dates];
    newSet.push([newDate, getStyle(shiftType.current)]);

    return newSet;
}

function modifyDate(index, epochDates, dates, shiftType) {
    const newDates = [];
    for (let i = 0; i < epochDates.current.length; i++) {
        if (i === index) {
            // Change color
            console.log("change color");
            newDates.push([
                new Date(epochDates.current[i]),
                getStyle(shiftType.current)
            ]);

        } else {
            newDates.push([
                new Date(epochDates.current[i]),
                dates[i][1]
            ]);
        }
    }

    return newDates;
}

function removeDate(newDate, epochDates, dates) {
    const newDates = [];
    const index = epochDates.current.indexOf(newDate.valueOf());
    for (let i = 0; i < epochDates.current.length; i++) {
        if (i === index) {
            continue;
        }
        newDates.push([
            new Date(epochDates.current[i]),
            dates[i][1]
        ]);
    }

    return newDates;
}

function App() {
    // https://stackoverflow.com/questions/46762199/material-ui-select-multiple-dates-with-calendar
    const [dates, setDates] = useState([])
    const epochDates = useRef([]);
    const shiftType = useRef(null);
    console.log("curr Dates", dates);

    function onSelect(newDate) {
        console.log("epochDates", epochDates.current);
        console.log("newDate", newDate.valueOf());
        console.log("dates", dates);
        const update = (newDates) => {
            setDates(newDates);
            epochDates.current = newDates.map(([date, style]) => date.valueOf());
        }

        if (shiftType.current === null) {
            if (epochDates.current.includes(newDate.valueOf())) {
                // remove item
                update(removeDate(newDate, epochDates, dates));
            } else {
                console.log("Nothing selected");
            }
            return;
        }

        if (epochDates.current.includes(newDate.valueOf())) {
            if (shiftType.current) {
                const index = epochDates.current.indexOf(newDate.valueOf());
                if (dates[index][1].background !== getStyle(shiftType.current).background) {
                    update(modifyDate(index, epochDates, dates, shiftType));
                } else {
                    update(removeDate(newDate, epochDates, dates));
                }
            } else {
                update(removeDate(newDate, epochDates, dates));
            }
        } else {
            update(addDate(newDate, shiftType, dates));
        }
    }

    return (
        <ThemeProvider>
            <Calender
                selectedDates={dates}
                onSelect={onSelect}
                shiftType={shiftType}
            />
        </ThemeProvider>
    );
}

export default App;
