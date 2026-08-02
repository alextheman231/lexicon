import type { ReactNode } from "react";

import { NavigationDrawer as AlexNavigationDrawer } from "@alextheman/components/routing";
import { ThemeToggle } from "@alextheman/components/v8/theme";
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
          <ThemeToggle />
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
