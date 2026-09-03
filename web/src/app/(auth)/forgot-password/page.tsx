"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, MailCheck } from "lucide-react";

import { api, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Зөв имэйл оруулна уу"),
});

const Page = () => {
  const [sentTo, setSentTo] = useState("");
  const [serverError, setServerError] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setServerError("");
    try {
      await api.post("/user/forgot-password", { email: data.email });
      setSentTo(data.email);
    } catch (error) {
      setServerError(getErrorMessage(error, "Илгээхэд алдаа гарлаа"));
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 sm:px-8 md:w-1/2">
        <div className="w-full max-w-sm">
          <Button variant="outline" size="icon" className="mb-4" asChild>
            <Link href="/signedIn">
              <ChevronLeft />
            </Link>
          </Button>

          {sentTo ? (
            <div className="flex flex-col gap-4">
              <MailCheck className="size-10 text-[#ef4444]" />
              <h2 className="text-2xl font-bold">Please verify your Email</h2>
              <p className="text-muted-foreground">
                We sent a link to <strong>{sentTo}</strong>. Click the link
                inside to get started.
              </p>
              <p className="text-sm text-muted-foreground">
                Холбоос 1 цаг хүчинтэй. Ирээгүй бол spam хавтсаа шалгаад дахин
                илгээнэ үү.
              </p>
              <Button
                variant="outline"
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Илгээж байна..."
                  : "Resend link"}
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Reset your password</h2>
              <p className="mb-6 text-muted-foreground">
                Enter your email to receive a password reset link.
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
                        <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                        <Input
                          {...field}
                          id="forgot-email"
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
                </FieldGroup>

                {serverError && (
                  <p className="text-sm text-destructive">{serverError}</p>
                )}

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Илгээж байна..."
                    : "Send link"}
                </Button>
              </form>
            </>
          )}

          <p className="mt-6 text-sm text-muted-foreground">
            Remembered it?{" "}
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
