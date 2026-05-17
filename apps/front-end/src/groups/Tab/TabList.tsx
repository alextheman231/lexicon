import type { TabsProps } from "@mui/material/Tabs";
import type { ReactNode } from "react";

import Tabs from "@mui/material/Tabs";

import { useTabContext } from "src/groups/Tab/TabProvider";

interface TabListProps extends Omit<TabsProps, "value"> {
  children: ReactNode;
}

function TabList({ children, onChange, ...tabListProps }: TabListProps) {
  const { tab, setTab } = useTabContext();

  return (
    <Tabs
      value={tab}
      onChange={(event, value) => {
        if (onChange) {
          onChange(event, value);
        }
        if (event.defaultPrevented) {
          return;
        }
        setTab(value);
      }}
      {...tabListProps}
    >
      {children}
    </Tabs>
  );
}

export default TabList;
