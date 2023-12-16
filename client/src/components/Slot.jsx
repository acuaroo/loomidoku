import React from "react";

function Slot({ roundedCorner }) {
  const corners = {
    'tl': 'rounded-tl-xl',
    'tr': 'rounded-tr-xl',
    'bl': 'rounded-bl-xl',
    'br': 'rounded-br-xl',
  };

  const getRoundedCornersClass = () => {
    return corners[roundedCorner] || '';
  };

  return (
    <div className={`bg-zinc-600 aspect-square overflow-hidden ${getRoundedCornersClass()}`}>
      
    </div>
  );
}

export default Slot;