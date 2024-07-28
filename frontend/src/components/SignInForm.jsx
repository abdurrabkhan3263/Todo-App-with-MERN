import React from "react";
import { Link } from "react-router-dom";
import FormLayout from "./FormLayout";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

function SignInForm() {
  const { register, setValue, handleSubmit } = useForm();
  const handleForm = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (data) => {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "avatar" && data[key][0] instanceof File) {
          formData.append(key, data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user/register`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    },
    onSuccess: () => {
      setValue("avatar", "");
      setValue("fullName", "");
      setValue("username", "");
      setValue("email", "");
      setValue("password", "");
      toast.success("User has been created successfully");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const formSubmit = (data) => {
    const { fullName, email, password, username } = data;
    if (!(data?.avatar[0] instanceof File))
      return toast.warning("Avatar image is requied");

    if (![fullName, email, password, username].every((items) => items.trim()))
      return toast.warning(
        "fullName , email , password and username is required",
      );
    handleForm.mutate(data);
  };
  return (
    <FormLayout>
      <form
        className="flex h-full w-full flex-col justify-between"
        onSubmit={handleSubmit(formSubmit)}
      >
        <div className="flex flex-col gap-y-3">
          <div>
            <h3 className="text-4xl font-bold">Create an Account</h3>
            <p className="pt-2">
              Enter your email below to create your account
            </p>
          </div>
          <Input
            placeholder="Name"
            type="file"
            {...register("avatar")}
            accept="image/*"
          />
          <Input placeholder="Name" {...register("fullName")} />
          <Input placeholder="Username" {...register("username")} />
          <Input placeholder="Email" type="email" {...register("email")} />
          <Input
            placeholder="Password"
            type="password"
            {...register("password")}
          />
        </div>
        <div>
          <Button type="submit">Create Account</Button>
          <p>
            Already have account?
            <span className="pl-2.5 underline-offset-1 hover:underline">
              <Link to={"/login"}>Login</Link>
            </span>
          </p>
        </div>
      </form>
    </FormLayout>
  );
}

export default SignInForm;
