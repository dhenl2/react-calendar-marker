import React, { useRef, useCallback, useState, useEffect } from 'react'
import WeekHeader from './WeekHeader'
import Month from './Month'
import { defaultUtils as utils } from './dateUtils'
import CalendarToolbar from './CalendarToolbar'
import Button from '@mui/material/Button';
import DownloadIcon from '@mui/icons-material/Download';
// import CalendarButtons from './CalendarButtons'
// import DateDisplay from './DateDisplay'
import { Badge, Box, IconButton } from '@mui/material'
import Circle from "./Circle";

export const AM_SHIFT = {
    background: "#81d4fa",
    borderColor: "#b3e5fc",
    color: "white",
    fontWeight: 700,
    ":hover": {
        background: "#b3e5fc",
        borderColor: "#81d4fa",
        color: "black"
    }
};
export const PM_SHIFT = {
    background: "#f06292",
    borderColor: "#f48fb1",
    color: "white",
    fontWeight: 700,
    ":hover": {
        background: "#f48fb1",
        borderColor: "#f06292",
        color: "black"
    }
};
export const NIGHT_SHIFT = {
    background: "#7e57c2",
    borderColor: "#b39ddb",
    color: "white",
    fontWeight: 700,
    ":hover": {
        background: "#b39ddb",
        borderColor: "#7e57c2"
    }
};

const Calendar = ({
                      initialDate,
                      maxDate,
                      minDate,
                      selectedDates,
                      disabledDates,
                      onSelect,
                      onCancel,
                      onOk,
                      readOnly,
                      onRemoveAtIndex,
                      cancelButtonText,
                      submitButtonText,
                      selectedDatesTitle,
                      shiftType
                  }) => {
    const calendar = useRef(null)

    const [displayDate, setDisplayDate] = useState(() =>
        utils.getFirstDayOfMonth(initialDate || new Date())
    );

    const handleMonthChange = useCallback(
        months => {
            setDisplayDate(displayDate => utils.addMonths(displayDate, months))
        },
        [setDisplayDate]
    );

    const setShiftType = (newType) => {
        if (shiftType.current === newType) {
            shiftType.current = null;
        } else {
            shiftType.current = newType;
        }
    }

    useEffect(
        () => {
            setDisplayDate(utils.getFirstDayOfMonth(initialDate || new Date()))
        },
        [initialDate]
    )

    maxDate = maxDate || utils.addYears(new Date(), 100)
    minDate = minDate || utils.addYears(new Date(), -100)

    const toolbarInteractions = {
        prevMonth: utils.monthDiff(displayDate, minDate) > 0,
        nextMonth: utils.monthDiff(displayDate, maxDate) < 0
    }

    const getBadgeCount = () => {
        const counts = [0, 0, 0];
        const styleKeys = [AM_SHIFT, PM_SHIFT, NIGHT_SHIFT];
        for (const [date, style] of selectedDates) {
            if (style.background === AM_SHIFT.background) {
                counts[0]++;
            } else if (style.background === PM_SHIFT.background) {
                counts[1]++;
            } else if (style.background ===NIGHT_SHIFT.background) {
                counts[2]++;
            }
        }

        const badgeContent = [];
        for (let i = 0; i < counts.length; i++) {
            if (counts[i] > 0) {
                badgeContent.push(
                    <Circle
                        onCheck={() => {}}
                        checked={false}
                        label={counts[i]}
                        sx={{
                            ...styleKeys[i],
                            height: 20,
                            width: 20,
                            margin: "1px"
                        }}
                        textSx={{
                            fontSize: "0.75rem",
                            color: styleKeys[i].color
                    }}
                        disabled={true}
                    />
                );
            }
        }

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: `${((badgeContent.length + (badgeContent.length - 1)) * 5) }px`
            }}>
                {badgeContent}
            </Box>
        );
    }

    return (
        <Box
            flex='1'
            display='flex'
            maxHeight='100%'
            overflow='hidden'
            flexDirection={"column"}
            maxWidth={500}
        >
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='space-between'
            >
                <Box
                    display='flex'
                    justifyContent='space-between'
                    flexDirection='column'
                    px={1}
                >
                    <CalendarToolbar
                        displayDate={displayDate}
                        onMonthChange={handleMonthChange}
                        prevMonth={toolbarInteractions.prevMonth}
                        nextMonth={toolbarInteractions.nextMonth}
                    />
                    <WeekHeader/>
                    <Month
                        displayDate={displayDate}
                        key={displayDate.toDateString()}
                        selectedDates={selectedDates}
                        disabledDates={disabledDates}
                        minDate={minDate}
                        maxDate={maxDate}
                        onSelect={onSelect}
                        readOnly={readOnly}
                        ref={calendar}
                    />
                </Box>
                {/*<CalendarButtons*/}
                {/*  readOnly={readOnly}*/}
                {/*  onCancel={onCancel}*/}
                {/*  onOk={onOk}*/}
                {/*  cancelButtonText={cancelButtonText}*/}
                {/*  submitButtonText={submitButtonText}*/}
                {/*/>*/}
            </Box>
            <Box
                ml={2} mr={2} p={2}
                sx={{
                    maxWidth: 500,
                    // background: "red",
                    border: 1,
                    borderRadius: 5,
                    borderColor: "#bdbdbd",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row"
                    }}
                >
                    <Box pr={1}>
                        <Button
                            variant={"contained"}
                            sx={AM_SHIFT}
                            onClick={() => {
                                setShiftType("AM");
                            }}
                        >
                            AM
                        </Button>
                    </Box>
                    <Box pr={1} pl={1}>
                        <Button
                            variant={"contained"}
                            sx={PM_SHIFT}
                            onClick={() => {
                                setShiftType("PM");
                            }}
                        >
                            PM
                        </Button>
                    </Box>
                    <Box pl={1} pr={1}>
                        <Button
                            variant={"contained"}
                            sx={NIGHT_SHIFT}
                            onClick={() => {
                                setShiftType("NIGHT");
                            }}
                        >
                            NIGHT
                        </Button>
                    </Box>
                    <Box pl={1}>
                        <Badge badgeContent={getBadgeCount()}>
                            <IconButton>
                                <DownloadIcon/>
                            </IconButton>
                        </Badge>
                    </Box>
                </Box>
            </Box>
            {/*<DateDisplay*/}
            {/*  selectedDatesTitle={selectedDatesTitle}*/}
            {/*  selectedDates={selectedDates}*/}
            {/*  readOnly={readOnly}*/}
            {/*  onRemoveAtIndex={onRemoveAtIndex}*/}
            {/*/>*/}
        </Box>
    )
}

export default Calendar
