import type { ReactNode } from "react";

import { ModeToggle } from "@alextheman/components";
import { NavigationDrawer } from "@alextheman/components/v7";
import Stack from "@mui/material/Stack";

import UserDropdown from "src/components/UserDropdown";

interface PageWrapperProps {
  children: ReactNode;
}

function PageWrapper({ children }: PageWrapperProps) {
  return (
    <NavigationDrawer
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
    </NavigationDrawer>
  );
}

export default PageWrapper;
