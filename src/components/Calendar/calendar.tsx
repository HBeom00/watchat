import { Dispatch, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import { getMonth, getYear } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import {Left} from '../../public/arrow_left.svg';
import Right from '../../public/arrow_right.svg';

interface Props {
  selectedDate: Date | null;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
}

const YEARS = Array.from({ length: getYear(new Date()) + 1 - 2000 }, (_, i) => getYear(new Date()) - i);
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Calendar = ({ selectedDate, setSelectedDate }: Props) => {
  return (
    <div className="flex flex-col">
      <DatePicker
        dateFormat='yyyy.MM.dd'
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
        showYearDropdown
        scrollableYearDropdown
        shouldCloseOnSelect
        yearDropdownItemNumber={100}
        minDate={new Date('2000-01-01')}
        maxDate={new Date()}
        selected={selectedDate}
        calendarClassName="bg-bg-color text-white" // 테일윈드 클래스
        dayClassName={(d) => (d.getDate() === selectedDate!.getDate() ? 'bg-orange-500 rounded-full' : 'text-white p-1 w-9 h-9')}
        onChange={(date) => setSelectedDate(date)}
        className="flex items-center border border-gray-600 rounded bg-bg-color box-border w-full h-11 text-white text-center pr-3 focus:border-2 focus:border-orange-500"
        renderCustomHeader={({
          date,
          changeYear,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="flex justify-between items-center bg-bg-color h-full mt-2 px-6">
            <div>
              <span className="text-lg font-medium">{MONTHS[getMonth(date)]}</span>
              <select
                value={getYear(date)}
                className="bg-bg-color text-white border-0 text-lg font-medium pr-1 cursor-pointer"
                onChange={({ target: { value } }) => changeYear(+value)}
              >
                {YEARS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type='button'
                onClick={decreaseMonth}
                className="w-8 h-8 p-1 rounded-full hover:bg-opacity-20"
                disabled={prevMonthButtonDisabled}
              >
                <Left />
              </button>
              <button
                type='button'
                onClick={increaseMonth}
                className="w-8 h-8 p-1 rounded-full hover:bg-opacity-20"
                disabled={nextMonthButtonDisabled}
              >
                <Right />
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Calendar;
