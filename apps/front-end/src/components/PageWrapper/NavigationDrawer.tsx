import type { ReactNode } from "react";

import { NavigationDrawer as AlexNavigationDrawer } from "@alextheman/components/routing";
import { ThemeToggle } from "@alextheman/components/theme";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import UserDropdown from "src/components/UserDropdown";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import useMetadataQuery from "src/queries/useMetadataQuery";

interface NavigationDrawerProps {
  children: ReactNode;
}

function NavigationDrawer({ children }: NavigationDrawerProps) {
  const { data, isPending, error } = useMetadataQuery();
  const QueryBoundary = createObjectQueryBoundary({ query: { data, isLoading: isPending, error } });

  return (
    <AlexNavigationDrawer
      title="Lexicon"
      headerElements={
        <Stack direction="row" spacing={2}>
          <QueryBoundary.Data>
            {(metadata) => {
              return <Typography>Current SHA: {metadata.commitHash ?? "unknown"}</Typography>;
            }}
          </QueryBoundary.Data>
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
