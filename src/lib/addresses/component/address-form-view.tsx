"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { userAddressesByIdQueryOptions } from "../api/queries/queries.client";
import { Address } from "../api/types";
import AddressForm from "./ui/address-form";
import { AddressesQueryProps } from "./addresses";
import { ErrorState } from "@/lib/shared/ui/error-state";

type TAddressViewPageProps = {
  addressId: string;
  onSaved?: () => void;
  hiddenFields: AddressesQueryProps["queryParams"];
};

export default function AddressFormView({
  addressId,
  hiddenFields: { userId } = {},
  onSaved,
}: TAddressViewPageProps) {
  if (addressId === "new") {
    return (
      <AddressForm
        initialData={null}
        pageTitle="Create New Address"
        hiddenFields={{ userId }}
        onSaved={onSaved}
      />
    );
  }

  const numericId = Number(userId);
  if (Number.isNaN(numericId)) {
    notFound();
    return null;
  }

  return (
    <EditAddressView
      addressId={Number(addressId)}
      hiddenFields={{ userId }}
      onSaved={onSaved}
    />
  );
}

function EditAddressView({
  addressId,
  onSaved,
  hiddenFields: { userId } = {},
}: {
  addressId: number;
  onSaved?: () => void;
  hiddenFields: AddressesQueryProps["queryParams"];
}) {
  const { data } = useSuspenseQuery(userAddressesByIdQueryOptions(addressId));

  if (!data.ok) {
    if (data.error.status === 404) {
      notFound();
      return null;
    }
    return <ErrorState error={data.error} />;
  }

  return (
    <AddressForm
      initialData={data.data as Address}
      pageTitle="Edit Address"
      hiddenFields={{ userId }}
      onSaved={onSaved}
    />
  );
}
