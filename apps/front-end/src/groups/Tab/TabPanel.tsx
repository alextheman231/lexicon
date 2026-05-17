import type { ReactNode } from "react";

import { useTabContext } from "src/groups/Tab/TabProvider";

export interface TabPanelProps<TabState extends string = string> {
  value: TabState;
  children: ReactNode;
}

function TabPanel<TabState extends string = string>({ value, children }: TabPanelProps<TabState>) {
  const { tab } = useTabContext();

  if (value === tab) {
    return <>{children}</>;
  }

  return null;
}

export default TabPanel;
