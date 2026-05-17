import type { JSX, ReactNode } from "react";

import type { TabContextValue } from "src/groups/Tab/TabProvider";

import TabItem from "src/groups/Tab/TabItem";
import TabList from "src/groups/Tab/TabList";
import TabPanel from "src/groups/Tab/TabPanel";
import TabProvider from "src/groups/Tab/TabProvider";

export interface TabComponents<TabState extends string = string> {
  Context: (props: { children: ReactNode }) => JSX.Element;
  List: typeof TabList;
  Item: typeof TabItem<TabState>;
  Panel: typeof TabPanel<TabState>;
}

function createTabGroup<TabState extends string = string>({
  tab,
  setTab,
}: TabContextValue<TabState>): TabComponents<TabState> {
  return {
    Context: ({ children }) => {
      return (
        <TabProvider tab={tab} setTab={setTab}>
          {children}
        </TabProvider>
      );
    },
    List: TabList,
    Item: TabItem,
    Panel: TabPanel,
  };
}

export default createTabGroup;
