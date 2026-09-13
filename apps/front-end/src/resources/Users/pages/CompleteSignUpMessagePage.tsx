import { Page } from "@alextheman/components";
import { createItemQueryBoundary } from "@alextheman/components/QueryBoundary";

import useUserInfoQuery from "src/resources/Users/queries/useUserInfoQuery";

interface SignUpConfirmationProps {
  userId: string;
}

function CompleteSignUpMessagePage({ userId }: SignUpConfirmationProps) {
  const { data, isPending, error } = useUserInfoQuery(userId);
  const QueryBoundary = createItemQueryBoundary({ query: { data, isLoading: isPending, error } });

  return (
    <Page title="Complete Sign-up">
      <QueryBoundary.Data>
        {(user) => {
          return `We have sent an email to ${user.email}. Please follow the instructions in the email to complete sign-up.`;
        }}
      </QueryBoundary.Data>
    </Page>
  );
}

export default CompleteSignUpMessagePage;
