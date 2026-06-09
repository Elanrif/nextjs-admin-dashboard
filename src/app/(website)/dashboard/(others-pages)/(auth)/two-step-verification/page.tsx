import TwoStepVerificationForm from "@/lib/auth/components/two-step-verification-form";

export const metadata = {
  title: "Two-Step Verification",
  description: "Page de vérification en deux étapes",
};

export default function TwoStepVerificationPage() {
  return (
    <>
      <TwoStepVerificationForm />
    </>
  );
}
