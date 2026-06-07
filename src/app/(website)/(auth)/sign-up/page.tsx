import SignUpForm from "@/lib/auth/components/sign-up-form";

export const metadata = {
  title: "Sign Up",
  description: "Page d'inscription",
};

export default function SignUpPage() {
  return (
    <>
      <SignUpForm />
    </>
  );
}
