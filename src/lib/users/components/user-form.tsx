"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  userCreateSchema,
  userUpdateSchema,
  type UserFormValues,
  type UserUpdateFormValues,
} from "../schemas/user";
import { User, UserRole, type UserCreate, type UserUpdate } from "../api/types";
import { createUserMutation, updateUserMutation } from "../api/mutations";
import Label from "@/components/form/Label";
import ComponentCard from "@/components/common/ComponentCard";
import Select from "@/components/form/Select";
import {
  ChevronDownIcon,
  EnvelopeIcon,
  EyeCloseIcon,
  EyeIcon,
  PlusIcon,
} from "@/icons";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Switch from "@/components/form/switch/Switch";
import { useImageDraft } from "@/lib/_/cloudinary/hooks/use-image-draft";
import { ImageUpload } from "@/lib/_/cloudinary/components/image-upload";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";

interface UserFormProps {
  initialData: User | null;
  pageTitle: string;
}

const options = [
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "User" },
];

const countries = [
  { code: "KM", label: "+269" },
  { code: "MA", label: "+212" },
  { code: "US", label: "+1" },
  { code: "GB", label: "+44" },
  { code: "CA", label: "+1" },
  { code: "AU", label: "+61" },
];

export function UserForm({ initialData }: UserFormProps) {
  const router = useRouter();
  const isEdit = !!initialData;
  const formSchema = isEdit ? userUpdateSchema : userCreateSchema;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // react-hook-form avec validation Zod
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues | UserUpdateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phoneNumber: initialData.phoneNumber,
          role: initialData.role,
          isActive: initialData.isActive,
          avatarUrl: initialData?.avatarUrl ?? "",
        }
      : {
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          role: UserRole.USER,
          isActive: false,
          password: "",
          confirmPassword: "",
        },
  });
  useEffect(() => {
    if (initialData?.role) {
      setValue("role", initialData.role);
    }
  }, [initialData, setValue]);

  // Mutation création
  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to create user");
        return;
      }
      toast.success("User created successfully");
      router.push("/dashboard/users");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to create user");
    },
  });

  // Mutation modification
  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: (result) => {
      if (!result.ok) {
        toast.error(result.error?.detail || "Failed to update user");
        return;
      }
      toast.success("User updated successfully");
      router.push("/dashboard/users");
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to update user");
    },
  });

  const onSubmit = (values: UserFormValues | UserUpdateFormValues) => {
    if (isEdit) {
      const updateValues = values as UserUpdateFormValues;
      const payload: UserUpdate = {
        firstName: updateValues.firstName,
        lastName: updateValues.lastName,
        email: updateValues.email,
        phoneNumber: updateValues.phoneNumber,
        role: updateValues.role ?? UserRole.USER,
        isActive: updateValues.isActive,
        avatarUrl: updateValues.avatarUrl,
      };
      // Solution : Ne pas inclure les champs vides dans le payload
      if (updateValues.password && updateValues.password.trim() !== "") {
        payload.password = updateValues.password;
        payload.confirmPassword = updateValues.confirmPassword;
      }
      updateMutation.mutate({
        id: initialData.id,
        values: payload,
      });
      handleImageRemove();
    } else {
      const createValues = values as UserFormValues;
      const payload: UserCreate = {
        firstName: createValues.firstName,
        lastName: createValues.lastName,
        email: createValues.email,
        phoneNumber: createValues.phoneNumber,
        role: createValues.role,
        password: createValues.password,
        confirmPassword: createValues.confirmPassword,
      };
      createMutation.mutate(payload);
      reset();
      handleImageRemove();
    }
  };

  const handleRoleChange = (value: string) => {
    setValue("role", value as UserRole, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue("phoneNumber", phoneNumber, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    console.log("Switch is now:", checked ? "ON" : "OFF");
  };

  const image = useImageDraft({
    storageKey: "post:image",
    initialUrl: undefined,
  });

  function handleImageChange(url: string, publicId: string) {
    image.handleChange(url, publicId);
    setValue("avatarUrl", url);
  }

  function handleImageRemove() {
    image.handleRemove();
    setValue("avatarUrl", "");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {Object.keys(errors).length > 0 && (
        <ComponentCard>
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-red-700">
                Impossible de soumettre le formulaire
              </h4>
              <p className="mt-1 text-sm text-red-600">
                Certains champs contiennent des erreurs. Veuillez les corriger
                avant de réessayer.
              </p>
            </div>
          </div>
        </ComponentCard>
      )}
      <ComponentCard title={isEdit ? "Edit User Details" : "Create New User"}>
        <div className="grid grid-cols-1 md:grid-cols-2 space-y-6 gap-4">
          <div>
            <Label required>First Name</Label>
            <Input
              type="text"
              {...register("firstName")}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-error-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <Label required>Last Name</Label>
            <Input
              type="text"
              {...register("lastName")}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-error-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div>
            <Label required>Email</Label>
            <div className="relative">
              <Input
                type="email"
                {...register("email")}
                placeholder="Enter email"
                className="pl-[62px]"
              />
              <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                <EnvelopeIcon />
              </span>
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-error-500">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label required>Role</Label>
            <div className="relative">
              <Select
                options={options}
                placeholder="Select an option"
                defaultValue={initialData?.role ?? UserRole.USER}
                onChange={handleRoleChange}
                className="dark:bg-dark-900"
              />
              <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                <ChevronDownIcon />
              </span>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-error-500">
                {errors.role.message}
              </p>
            )}
          </div>
          <div>
            <Label required>Phone</Label>
            <PhoneInput
              {...register("phoneNumber")}
              selectPosition="start"
              countries={countries}
              placeholder="+1 (555) 000-0000"
              onChange={handlePhoneNumberChange}
              value={initialData?.phoneNumber}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-error-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>{" "}
          <Switch
            label="Activé / Désactivé"
            defaultChecked={initialData?.isActive ?? false}
            {...register("isActive")}
            onChange={handleSwitchChange}
          />
        </div>
      </ComponentCard>

      <ComponentCard title={isEdit ? "Change Password" : "Set Password"}>
        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 space-y-6 gap-4">
          <div>
            <Label required={isEdit ? false : true}>Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-error-500">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label required={isEdit ? false : true}>Confirm Password</Label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-error-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Choose a profile picture">
        {/* Display the initial profile picture if available */}
        {initialData?.avatarUrl && (
          <div className="mb-6 flex flex-col items-center rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
            <div className="relative">
              <Image
                src={initialData.avatarUrl}
                alt="Current profile picture"
                width={120}
                height={120}
                className="h-30 w-30 rounded-full border-4 border-white object-cover shadow-lg dark:border-gray-800"
              />

              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white shadow">
                Current
              </span>
            </div>

            <p className="mt-5 text-sm text-gray-500 dark:text-gray-400">
              This is your current profile picture.
            </p>
          </div>
        )}
        <ImageUpload
          value={image.url}
          //imageClassName="h-30 w-30 rounded-full"
          publicId={image.publicId}
          onChange={handleImageChange}
          onRemove={handleImageRemove}
          variant="light"
        />
      </ComponentCard>
      <Button
        type="submit"
        size="sm"
        variant="primary"
        startIcon={<PlusIcon size={16} />}
        disabled={
          isSubmitting || createMutation.isPending || updateMutation.isPending
        }
      >
        {isEdit ? "Edit user" : "Create user"}{" "}
        {isSubmitting ? <LoaderIcon className="animate-spin" /> : ""}
      </Button>
    </form>
  );
}
