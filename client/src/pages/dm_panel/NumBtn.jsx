import React from 'react';

function NumBtn({ value, handleClick, highlightField }) {
  const defaultStyle =
    'w-fit self-center rounded-md bg-n-light p-2 py-1 text-center text-xl font-semibold outline outline-1 hover:bg-n-dark';

  const pingStyle =
    'w-fit self-center rounded-md bg-n-light p-2 py-1 text-center text-xl font-semibold shadow-inner shadow-blue-400 outline outline-blue-700 hover:bg-n-dark';

  const cubeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
    </svg>
  );

  return (
    <div
      className={highlightField === value ? pingStyle : defaultStyle}
      onClick={() => handleClick(value)}
    >
      {cubeIcon}
    </div>
  );
}

export default NumBtn;
