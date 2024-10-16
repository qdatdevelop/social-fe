import React from "react";
import { useMediaQuery } from "react-responsive";
export default function ChoosePrivacy({ name, onChange }) {
  const view1 = useMediaQuery({
    query: "(min-width: 539px)",
  });
  const view2 = useMediaQuery({
    query: "(min-width: 850px)",
  });
  const view3 = useMediaQuery({
    query: "(min-width: 1170px)",
  });
  return (
    <div className="reg_grid_privacy" style={{ marginBottom: "0"}}>
      <select name={name} onChange={onChange}>
        <option value="">Select Privacy</option>
        <option value="false">Private</option>
        <option value="true">Public</option>
      </select>
    </div>
  );
}
