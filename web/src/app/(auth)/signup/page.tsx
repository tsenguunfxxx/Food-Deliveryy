"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

import { getErrorMessage } from "@/lib/api";
import { PASSWORD_HINT, passwordSchema } from "@/lib/password";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    email: z.string().email("Зөв имэйл оруулна уу"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });

const Page = () => {
  const router = useRouter();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError("");
    try {
      await signUp(data.email, data.password);
      router.push("/");
    } catch (error) {
      setServerError(getErrorMessage(error, "Бүртгэл үүсгэхэд алдаа гарлаа"));
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 sm:px-8 md:w-1/2">
        <div className="w-full max-w-sm">
          <Button variant="outline" size="icon" className="mb-4" asChild>
            <Link href="/">
              <ChevronLeft />
            </Link>
          </Button>

          <h2 className="text-2xl font-bold">Create your account</h2>
          <p className="mb-6 text-muted-foreground">
            Sign up to explore your favorite dishes.
          </p>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="signup-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email address"
                      autoComplete="email"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Password"
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={-1}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <FieldDescription>{PASSWORD_HINT}</FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="signup-confirm">
                      Confirm password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="signup-confirm"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={fieldState.invalid}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {serverError && (
              <p className="text-sm text-destructive">{serverError}</p>
            )}

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Түр хүлээнэ үү..." : "Let's Go"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/signedIn"
              className="font-medium text-primary underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2">
        <div className="sticky top-0 h-screen w-full">
          <Image
            src="/image.png"
            alt="Delivery courier riding a bike through a city street"
            fill
            sizes="50vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
