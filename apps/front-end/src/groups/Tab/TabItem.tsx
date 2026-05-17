import type { TabProps } from "@mui/material/Tab";

import Tab from "@mui/material/Tab";

export interface TabItemProps<TabState extends string = string> extends Omit<TabProps, "value"> {
  value: TabState;
}

function TabItem<TabState extends string = string>({
  label,
  value,
  ...tabProps
}: TabItemProps<TabState>) {
  return <Tab label={label ?? value} value={value} {...tabProps} />;
}

export default TabItem;
