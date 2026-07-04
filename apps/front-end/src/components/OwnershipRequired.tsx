import type { AuthRequiredProps } from "src/components/AuthRequired";

import AuthRequired from "src/components/AuthRequired";
import UnauthorisedPage from "src/pages/UnauthorisedPage";

interface OwnershipRequiredPropsWithData<DataType> extends AuthRequiredProps {
  data: DataType;
  ownerId: (data: DataType) => string | Array<string>;
}

interface OwnershipRequiredPropsNoData extends AuthRequiredProps {
  data?: never;
  ownerId: string | Array<string>;
}

interface OwnershipRequiredPropsWithUnauthorisedPage {
  hideUnauthorisedPage?: false;
  unauthorisedMessage?: string;
}

interface OwnershipRequiredPropsNoUnauthorisedPage {
  hideUnauthorisedPage: true;
  unauthorisedMessage?: never;
}

export type OwnershipRequiredProps<DataType> = (
  OwnershipRequiredPropsWithData<DataType> | OwnershipRequiredPropsNoData
) &
  (OwnershipRequiredPropsWithUnauthorisedPage | OwnershipRequiredPropsNoUnauthorisedPage);

function resolveOwnerId<DataType>(
  ownerIds: string | Array<string> | ((data: DataType) => string | Array<string>),
  data?: DataType,
): Array<string> | undefined {
  if (typeof ownerIds === "string") {
    return [ownerIds];
  }

  if (Array.isArray(ownerIds)) {
    return ownerIds;
  }

  if (typeof ownerIds === "function" && data !== undefined) {
    const resolvedOwnerIds = ownerIds(data);
    if (typeof resolvedOwnerIds === "string") {
      return [resolvedOwnerIds];
    }

    if (Array.isArray(resolvedOwnerIds)) {
      return resolvedOwnerIds;
    }
  }

  return undefined;
}

function OwnershipRequired<DataType>({
  ownerId,
  data,
  hideUnauthorisedPage,
  unauthorisedMessage,
  children,
}: OwnershipRequiredProps<DataType>) {
  return (
    <AuthRequired unauthorisedMessage={unauthorisedMessage}>
      {(currentUser) => {
        const resolvedOwnerIds = resolveOwnerId(ownerId, data);

        if (resolvedOwnerIds === undefined) {
          return hideUnauthorisedPage ? null : (
            <UnauthorisedPage unauthorisedMessage={unauthorisedMessage} />
          );
        }

        if (
          !resolvedOwnerIds.every((id) => {
            return id === currentUser.id;
          })
        ) {
          return hideUnauthorisedPage ? null : (
            <UnauthorisedPage unauthorisedMessage={unauthorisedMessage} />
          );
        }

        return typeof children === "function" ? children(currentUser) : children;
      }}
    </AuthRequired>
  );
}

export default OwnershipRequired;
