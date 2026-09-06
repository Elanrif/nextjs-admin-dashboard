import "server-only";

import apiClient from "@config/api.config";
import environment from "@config/environment.config";
import { getLogger } from "@/config/logger.config";
import {
  loginFormSchema,
  registerFormSchema,
  changePasswordSchema,
  resetPasswordSchema,
  UserSchema,
  deleteFormSchema,
  LoginFormValues,
  RegisterFormValues,
  ResetPwdFormValues,
  UserCreateFormValues,
  ChangePwdFormValues,
  DeleteFormValues,
} from "@lib/auth/schemas/auth";
import { User } from "@/lib/users/api/types";
import { Result } from "@/lib/shared/types";
import { ApiError, fromZodError } from "@/lib/shared/api-error";
import { cookies } from "next/headers";

const {
  api: {
    rest: {
      endpoints: {
        auth: {
          deleteMyAccount: deleteMyAccountUrl,
          login: loginUrl,
          register: registerUrl,
          editMyAccount: editMyAccountUrl,
          changeMyPwd: changeMyPwdUrl,
          resetPassword: resetPasswordUrl,
        },
      },
    },
  },
} = environment;

const logger = getLogger("server");

export async function signIn(
  login: LoginFormValues,
): Promise<Result<User, ApiError>> {
  const parse = loginFormSchema.safeParse(login);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "signIn"),
    };
  }

  try {
    const response = await apiClient().post<User>(loginUrl, parse.data);
    // Spring renvoie le Set-Cookie ici — Axios ne le propage jamais tout seul
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      const cookieStore = await cookies();
      for (const rawCookie of setCookieHeader) {
        const [nameValue] = rawCookie.split(";");
        const [name, value] = nameValue.split("=");
        cookieStore.set(name.trim(), value, {
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          path: "/",
        });
      }
    }

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "User signed in",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "signIn"),
    };
  }
}

export async function signUp(
  registration: RegisterFormValues,
): Promise<Result<User, ApiError>> {
  const parse = registerFormSchema.safeParse(registration);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "signUp"),
    };
  }

  try {
    await apiClient().post(registerUrl, parse.data);
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "signUp"),
    };
  }

  const signInResult = await signIn({
    email: parse.data.email,
    password: parse.data.password,
  });

  if (!signInResult.ok) {
    logger.error(
      {
        context: "signUp",
        email: parse.data.email,
        error: signInResult.error,
      },
      "Automatic sign-in after registration failed",
    );

    throw new Error(signInResult.error.message);
  }

  logger.info(
    {
      id: signInResult.data.id,
      email: signInResult.data.email,
    },
    "User registered successfully",
  );

  return signInResult;
}

export async function resetPassword(
  data: ResetPwdFormValues,
): Promise<Result<User, ApiError>> {
  const parse = resetPasswordSchema.safeParse(data);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "resetPassword"),
    };
  }

  try {
    const response = await apiClient().patch<User>(
      resetPasswordUrl,
      parse.data,
    );

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "Password reset successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "resetPassword"),
    };
  }
}

export async function updateMyAccount(
  data: UserCreateFormValues,
): Promise<Result<User, ApiError>> {
  const parse = UserSchema.safeParse(data);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "updateMyAccount"),
    };
  }

  try {
    const response = await apiClient(true).patch<User>(
      editMyAccountUrl,
      parse.data,
    );

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "Profile updated successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "updateMyAccount"),
    };
  }
}

export async function updateMyPassword(
  data: ChangePwdFormValues,
): Promise<Result<User, ApiError>> {
  const parse = changePasswordSchema.safeParse(data);

  // Zod validation error: directly create the ApiError.
  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "updateMyPassword"),
    };
  }

  try {
    const response = await apiClient(true).patch<User>(
      changeMyPwdUrl,
      parse.data,
    );

    logger.info(
      {
        id: response.data.id,
        email: response.data.email,
      },
      "Password updated successfully",
    );

    return {
      ok: true,
      data: response.data,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "updateMyPassword"),
    };
  }
}

export async function deleteMyAccount(
  data: DeleteFormValues,
): Promise<Result<void, ApiError>> {
  const parse = deleteFormSchema.safeParse(data);

  if (!parse.success) {
    return {
      ok: false,
      error: fromZodError(parse.error, "deleteMyAccount"),
    };
  }

  try {
    await apiClient(true).post(deleteMyAccountUrl, parse.data);

    logger.info(
      {
        email: parse.data.emailInput,
      },
      "Account deleted successfully",
    );

    return {
      ok: true,
      data: undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: ApiError(error, "deleteMyAccount"),
    };
  }
}
