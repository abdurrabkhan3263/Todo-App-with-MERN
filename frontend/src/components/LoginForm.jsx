/* eslint-disable no-useless-catch */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import FormLayout from "./FormLayout";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { base_url } from "@/conf";
import { toast } from "sonner";
import UserApi from "@/Api/User";
import useApp from "@/context/context";

function LoginForm() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { loginUser } = useApp();
  const formSubmitMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data) => {
      try {
        const response = await fetch(`${base_url}/user/login`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });
        let result = await response.json();
        if (!response.ok) {
          throw result.message;
        }
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: async ({ data }) => {
      navigate("/");
      loginUser(data);
      toast.success("User login successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const formSubmit = (data) => {
    if (!data?.email || !data?.password)
      return toast.warning("Email and password is required");
    formSubmitMutation.mutate(data);
  };
  return (
    <FormLayout>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <Input
            type="email"
            placeholder="Enter email"
            {...register("email")}
          />
          <Input
            type="password"
            placeholder="Enter password"
            {...register("password")}
          />
          <Button type="submit">Login</Button>
        </form>
      </div>
      <div>
        <p>LoginForm</p>
        <p>
          Already have not account?
          <span className="pl-2.5 underline-offset-1 hover:underline">
            <Link to={"/sign-in"}>Sign-in</Link>
          </span>
        </p>
      </div>
    </FormLayout>
  );
}

export default LoginForm;
