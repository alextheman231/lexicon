import type { User } from "@lexicon/models";

import type { LexiconQueryBoundaryObjectComponents } from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

interface AboutUserProps {
  QueryBoundary: LexiconQueryBoundaryObjectComponents<User>;
}

function AboutUser({ QueryBoundary }: AboutUserProps) {
  return (
    <Card>
      <CardHeader title="Description" />
      <Divider />
      <CardContent>
        <QueryBoundary.Value propertyName="description" />
      </CardContent>
    </Card>
  );
}

export default AboutUser;
