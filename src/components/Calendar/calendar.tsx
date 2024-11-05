import { Dispatch, SetStateAction } from 'react';
import DatePicker from 'react-datepicker';
import { getMonth } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale/ko';

// import Left from '../../../public/arrow_left.svg'
// import Right from '../../../public/arrow_right.svg'

interface Props {
  selectedDate: Date | null;
  setSelectedDate: Dispatch<SetStateAction<Date | null>>;
}


const MONTHS = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

const Calendar = ({ selectedDate, setSelectedDate }: Props) => {
  return (
    <div className="flex flex-col">
      <DatePicker
        locale={ko}
        dateFormat='yyyy.MM.dd'
        formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 1)}
        showYearDropdown
        scrollableYearDropdown
        shouldCloseOnSelect
        yearDropdownItemNumber={100}
        minDate={new Date()}
        selected={selectedDate}
        calendarClassName="bg-bg-color text-white" // 테일윈드 클래스
        dayClassName={(d) => {
            const selectedDay = selectedDate ? selectedDate.getDate() : null; // selectedDate가 null인지 확인
            return d.getDate() === selectedDay ? 'bg-orange-500 rounded-full' : 'text-white p-1 w-9 h-9';
          }}
        onChange={(date) => setSelectedDate(date)}
        className="flex items-center border border-gray-600 rounded bg-bg-color box-border w-full h-11 text-white text-center pr-3 focus:border-2 focus:border-orange-500"
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled
        }) => (
          <div className="flex justify-between items-center bg-bg-color h-full mt-2 px-6">
              <button
                type="button"
                onClick={decreaseMonth}
                className="w-8 h-8 p-1 rounded-full hover:bg-opacity-20"
                disabled={prevMonthButtonDisabled}
              >
                {/* <Left /> */} 좌
              </button>
              <div>
              <span className="text-lg font-medium">{MONTHS[getMonth(date)]}</span>
            </div>
              <button
                type="button"
                onClick={increaseMonth}
                className="w-8 h-8 p-1 rounded-full hover:bg-opacity-20"
                disabled={nextMonthButtonDisabled}
              >
                {/* <Right /> */} 우
              </button>
            </div>
          
        )}
      />
    </div>
  );
};

export default Calendar;
