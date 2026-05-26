import { ErrorPage } from "@alextheman/components/routing";

interface UnauthorisedPageProps {
  unauthorisedMessage?: string;
}

function UnauthorisedPage({
  unauthorisedMessage = "You do not have permission to access this page.",
}: UnauthorisedPageProps) {
  return <ErrorPage title="Unauthorised">{unauthorisedMessage}</ErrorPage>;
}

export default UnauthorisedPage;
