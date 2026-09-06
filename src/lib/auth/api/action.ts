"use server";

import {
  deleteMyAccount,
  resetPassword,
  signIn as serverSignIn,
  signUp as serverSignUp,
  updateMyAccount,
  updateMyPassword,
} from "@/lib/auth/api/services/auth.server";
import { generateResetToken, sendPasswordResetEmail } from "@/lib/mail";
import environment from "@/config/environment.config";
import { ApiError } from "@/lib/shared/api-error";
import {
  DeleteFormValues,
  LoginFormValues,
  RegisterFormValues,
  ChangePwdFormValues,
  UserFormValues,
  ResetPwdFormValues,
} from "../schemas/auth";

export async function signInAction(credentials: LoginFormValues) {
  return serverSignIn(credentials);
}

export async function signUpAction(userData: RegisterFormValues) {
  return serverSignUp(userData);
}

export async function sendPasswordResetAction(
  email: string,
): Promise<{ success: boolean; message: string } | ApiError> {
  try {
    // Validate the email address before generating the reset token.
    if (!email || !email.includes("@")) {
      return {
        status: 400,
        error: "Bad Request",
        message: "Please provide a valid email address",
      };
    }

    // Generate the reset token and verification code.
    const { resetToken, code } = generateResetToken();

    const baseUrl = environment.app.url;

    const resetUrl =
      `${baseUrl}/reset-password` +
      `?token=${resetToken}` +
      `&code=${code}` +
      `&email=${encodeURIComponent(email)}`;

    // Send the password reset email.
    const emailSent = await sendPasswordResetEmail(email, resetToken, resetUrl);

    // Return a service-unavailable error if the email could not be sent.
    if (!emailSent) {
      return {
        status: 503,
        error: "Service Unavailable",
        message: "Failed to send reset email. Please try again later.",
      };
    }

    // Always return the same message to avoid revealing
    // whether an account exists for the provided email.
    return {
      success: true,
      message:
        "If an account exists with this email, you will receive password reset instructions.",
    };
  } catch (error: unknown) {
    // Backend/Axios error: normalize it through ApiError.
    return ApiError(error, "sendPasswordResetAction");
  }
}

export async function resetPasswordTokenAction(data: ResetPwdFormValues) {
  return resetPassword(data);
}

export async function updateMyAccountAction(data: UserFormValues) {
  return updateMyAccount(data);
}

export async function updateMyPasswordAction(data: ChangePwdFormValues) {
  return updateMyPassword(data);
}

export async function deleteMyAccountAction(data: DeleteFormValues) {
  return deleteMyAccount(data);
}
