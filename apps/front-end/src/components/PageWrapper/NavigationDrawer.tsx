import type { ReactNode } from "react";

import { NavigationDrawer as AlexNavigationDrawer } from "@alextheman/components/routing";
import { ThemeToggle } from "@alextheman/components/v8/theme";
import Stack from "@mui/material/Stack";

import UserDropdown from "src/components/UserDropdown";
import LexiconLogoClosedBook from "src/icons/LexiconLogoClosedBook";
import LexiconLogoNoText from "src/icons/LexiconLogoNoText";

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
      openIcon={<LexiconLogoNoText style={{ height: 20, width: 20 }} />}
      closedIcon={<LexiconLogoClosedBook style={{ height: 20, width: 20 }} />}
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
