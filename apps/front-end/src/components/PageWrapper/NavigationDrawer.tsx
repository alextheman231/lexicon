import type { ReactNode } from "react";

import { NavigationDrawer as AlexNavigationDrawer } from "@alextheman/components/routing";
import { ThemeToggle } from "@alextheman/components/theme";
import Stack from "@mui/material/Stack";

import Banner from "src/components/PageWrapper/Banner";
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
      <Banner />
      {children}
    </AlexNavigationDrawer>
  );
}

export default NavigationDrawer;
