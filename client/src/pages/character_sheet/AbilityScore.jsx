import React from 'react';
import NumBox from './NumBox';

function AbilityScore({
  stat,
  score,
  bonus,
  id,
  highlightField,
  setHighlightField,
}) {
  return (
    <div className="flex aspect-square flex-col justify-between overflow-hidden bg-n-light pb-3 outline outline-1 lg:aspect-[4/3] xl:aspect-[3/2]">
      <div className="mb-1 flex justify-between border-b-2 border-black">
        <h4 className="w-full bg-n-dark py-1">{stat}</h4>
        <p className="w-fit px-1 font-semibold">{score}</p>
      </div>
      <NumBox
        value={bonus}
        id={id}
        highlightField={highlightField}
        setHighlightField={setHighlightField}
      />
    </div>
  );
}

export default AbilityScore;
