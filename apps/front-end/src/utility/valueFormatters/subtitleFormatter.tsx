import type { ReactNode } from "react";

import Typography from "@mui/material/Typography";

function subtitleFormatter<ValueType extends ReactNode>(value: ValueType): ReactNode {
  return (
    <Typography variant="body2" color="text.secondary">
      {value}
    </Typography>
  );
}

export default subtitleFormatter;
