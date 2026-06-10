import type { ReactNode } from "react";

import {
  NavigationBottom as AlexNavigationBottom,
  InternalLink,
} from "@alextheman/components/routing";
import { ThemeToggle } from "@alextheman/components/theme";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { MdHome, MdPerson } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";
import Banner from "src/components/PageWrapper/Banner";
import UserDropdown from "src/components/UserDropdown";

interface NavigationBottomProps {
  children: ReactNode;
}

function NavigationBottom({ children }: NavigationBottomProps) {
  const { currentUser } = useAuth();

  return (
    <Stack spacing={1}>
      <Card>
        <CardHeader
          title={
            <Button component={InternalLink} to="/">
              Lexicon
            </Button>
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
        <Banner />
        {children}
      </AlexNavigationBottom>
    </Stack>
  );
}

export default NavigationBottom;
