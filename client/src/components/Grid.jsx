import React from "react";
import Slot from "./Slot";

function Grid() {
  const columnLabels = ["Column 1", "Column 2", "Column 3"];
  const rowLabels = ["Row 1", "Row 2", "Row 3"];
  const corners = [
    ["tl", "tr"],
    ["", ""],
    ["bl", "br"],
  ];

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <div></div>

        {columnLabels.map((label, index) => (
          <div key={`col-${index}`} className="sm:text-2xl text-center">
            {label}
          </div>
        ))}

        {rowLabels.map((label, index) => (
          <React.Fragment key={`row-${index}`}>
            <div key={`row-label-${index}`} className="sm:text-2xl text-center translate-y-[37.5%]">
              {label}
            </div>

            <Slot roundedCorner={corners[index][0]} />
            <Slot />
            <Slot roundedCorner={corners[index][1]} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Grid;