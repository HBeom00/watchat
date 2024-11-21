export type Option = {
  value: string | number; // value는 문자열 또는 숫자
  label: string; // label은 문자열
};

export type CustomSelectProps = {
  options: Option[]; // Option 배열
  value: string | number; // 선택된 값
  onChange: (value: string | number) => void; // 값 변경 핸들러
};

//------------------------------------------------------------------------

export type ModalProps = {
  message: string;
  onClose: () => void;
};
