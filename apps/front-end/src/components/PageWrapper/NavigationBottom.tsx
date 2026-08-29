import type { ReactNode } from "react";

import { NavigationBottom as AlexNavigationBottom } from "@alextheman/components/routing";
import { ThemeToggle } from "@alextheman/components/v8/theme";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { MdHome, MdPerson } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";
import UserDropdown from "src/components/UserDropdown";
import useLocation from "src/hooks/useLocation";
import LexiconLogoClosedBook from "src/icons/LexiconLogoClosedBook";
import LexiconLogoNoText from "src/icons/LexiconLogoNoText";

interface NavigationBottomProps {
  children: ReactNode;
}

function NavigationBottom({ children }: NavigationBottomProps) {
  const { currentUser } = useAuth();
  const [location, setLocation] = useLocation();

  return (
    <Stack spacing={1}>
      <Card>
        <CardHeader
          title={
            location === "/" ? (
              <LexiconLogoNoText style={{ height: 20, width: 20 }} />
            ) : (
              // Unfortunately component={InternalLink} doesn't work here so we must do this instead...
              <IconButton
                onClick={() => {
                  setLocation("/");
                }}
              >
                <LexiconLogoClosedBook style={{ height: 20, width: 20 }} />
              </IconButton>
            )
          }
          action={
            <Stack direction="row" spacing={2}>
              <ThemeToggle />
              <UserDropdown />
            </Stack>
          }
        />
      </Card>
      <AlexNavigationBottom
        navItems={[
          {
            label: "Homepage",
            icon: <MdHome />,
            to: "/",
          },
          {
            label: "Profile",
            icon: <MdPerson />,
            to: currentUser === null ? "/sign-in" : `/users/${currentUser?.id}`,
          },
        ]}
      >
        {children}
      </AlexNavigationBottom>
    </Stack>
  );
}

export default NavigationBottom;
