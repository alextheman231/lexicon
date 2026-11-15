import type { User } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import { assertNotNull, az } from "@alextheman/utility";
import { UserState } from "@lexicon/models";
import z from "zod";

import insertUserStateHistory from "src/models/users/insertUserStateHistory";
import selectUser from "src/models/users/selectUser";
import updateUser from "src/models/users/updateUser";
import InvalidStateTransitionError from "src/utility/errors/InvalidStateTransition";

interface ChangeUserStateData {
  newState: UserState;
  updatedById: string | null;
}

async function changeUserState(
  connection: Transaction,
  userId: string,
  data: ChangeUserStateData,
): Promise<User | null> {
  const existingUser = await selectUser(connection, { userId });

  if (existingUser === null) {
    return null;
  }

  if (existingUser.state === data.newState) {
    return {
      ...existingUser,
      dateOfBirth: az.with(z.coerce.date().nullable()).parse(existingUser.dateOfBirth),
    };
  }

  const allowedStateTransitions: Record<UserState, Array<UserState>> = {
    [UserState.VERIFIED]: [UserState.UNVERIFIED],
    [UserState.UNVERIFIED]: [UserState.VERIFIED],
  };

  if (!allowedStateTransitions[existingUser.state].includes(data.newState)) {
    throw new InvalidStateTransitionError({
      currentState: existingUser.state,
      newState: data.newState,
    });
  }

  const updatedUser = await updateUser(connection, userId, { state: data.newState });
  assertNotNull(updatedUser);

  await insertUserStateHistory(connection, {
    state: updatedUser.state,
    updatedById: data.updatedById,
    updatedAt: new Date(),
    userId: updatedUser.id,
  });

  return {
    ...updatedUser,
    dateOfBirth: az.with(z.coerce.date().nullable()).parse(updatedUser.dateOfBirth),
  };
}

export default changeUserState;
