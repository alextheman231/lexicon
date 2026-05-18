import type { ReactNode } from "react";

import { ModeToggle } from "@alextheman/components";
import { NavigationDrawer as AlexNavigationDrawer } from "@alextheman/components/v7";
import Stack from "@mui/material/Stack";

import UserDropdown from "src/components/UserDropdown";

interface NavigationDrawerProps {
  children: ReactNode;
}

function NavigationDrawer({ children }: NavigationDrawerProps) {
  return (
    <AlexNavigationDrawer
      title="Lexicon"
      headerElements={
        <Stack direction="row" spacing={2}>
          <ModeToggle />
          <UserDropdown />
        </Stack>
      }
      navItems={[
        {
          category: "Main",
          options: [
            {
              label: "Homepage",
              to: "/",
            },
          ],
        },
      ]}
    >
      {children}
    </AlexNavigationDrawer>
  );
}

export default NavigationDrawer;
