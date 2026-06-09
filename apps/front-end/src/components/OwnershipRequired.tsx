import type { AuthRequiredProps } from "src/components/AuthRequired";

import AuthRequired from "src/components/AuthRequired";
import UnauthorisedPage from "src/pages/UnauthorisedPage";

interface OwnershipRequiredPropsWithData<
  DataType extends object = Record<string, unknown>,
> extends AuthRequiredProps {
  data: DataType;
  ownerId: (data: DataType) => string;
}

interface OwnershipRequiredPropsNoData extends AuthRequiredProps {
  data?: never;
  ownerId: string;
}

export type OwnershipRequiredProps<DataType extends object = Record<string, unknown>> =
  | OwnershipRequiredPropsWithData<DataType>
  | OwnershipRequiredPropsNoData;

function OwnershipRequired<DataType extends object = Record<string, unknown>>({
  ownerId,
  data,
  unauthorisedMessage,
  children,
}: OwnershipRequiredProps<DataType>) {
  return (
    <AuthRequired unauthorisedMessage={unauthorisedMessage}>
      {(currentUser) => {
        const resolvedOwnerId =
          typeof ownerId === "string" ? ownerId : data ? ownerId(data) : undefined;

        if (resolvedOwnerId === undefined) {
          return <UnauthorisedPage unauthorisedMessage={unauthorisedMessage} />;
        }

        if (resolvedOwnerId !== currentUser.id) {
          return <UnauthorisedPage unauthorisedMessage={unauthorisedMessage} />;
        }

        return typeof children === "function" ? children(currentUser) : children;
      }}
    </AuthRequired>
  );
}

export default OwnershipRequired;
