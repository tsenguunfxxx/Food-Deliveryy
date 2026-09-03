"use client";

import { Suspense, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import { api, getErrorMessage } from "@/lib/api";
import { PASSWORD_HINT, passwordSchema } from "@/lib/password";
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
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Нууц үг таарахгүй байна",
    path: ["confirmPassword"],
  });

const ResetForm = () => {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError("");
    try {
      await api.post("/user/reset-password", {
        token,
        password: data.password,
      });
      setDone(true);
      setTimeout(() => router.push("/signedIn"), 1500);
    } catch (error) {
      setServerError(getErrorMessage(error, "Шинэчлэхэд алдаа гарлаа"));
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Холбоос буруу байна</h2>
        <p className="text-muted-foreground">
          Сэргээх холбоос дутуу байна. Дахин хүсэлт илгээнэ үү.
        </p>
        <Button asChild>
          <Link href="/forgot-password">Reset your password</Link>
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Нууц үг шинэчлэгдлээ</h2>
        <p className="text-muted-foreground">
          Нэвтрэх хуудас руу шилжүүлж байна...
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold">Create a strong password</h2>
      <p className="mb-6 text-muted-foreground">
        Create a strong password with letters, numbers.
      </p>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="reset-password">Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    id="reset-password"
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
                <FieldLabel htmlFor="reset-confirm">
                  Confirm password
                </FieldLabel>
                <Input
                  {...field}
                  id="reset-confirm"
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
    </>
  );
};

const Page = () => (
  <div className="flex h-screen w-full">
    <div className="flex w-full flex-col items-center justify-center px-8 md:w-1/2">
      <div className="w-full max-w-sm">
        <Suspense fallback={<p className="text-muted-foreground">Ачаалж байна...</p>}>
          <ResetForm />
        </Suspense>
      </div>
    </div>

    <div className="hidden items-center justify-center md:flex md:w-1/2">
      <div className="relative h-full w-full">
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

export default Page;
