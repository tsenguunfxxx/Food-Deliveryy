"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email("Зөв имэйл оруулна уу"),
  password: z
    .string()
    .min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байна")
    .max(10, "Нууц үг 10-с ихгүй тэмдэгт байна"),
});

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("durmee dagsn bn ", data);

    await axios.post(" http://localhost:3001/User/signedIn", {
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left: form */}
      <div className="flex w-1/2 flex-col items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <Button variant="outline" size="icon" className="mb-4">
            <Link href="/admin/menu     ">
              {" "}
              <ChevronLeft />
            </Link>
          </Button>

          <h2 className="text-2xl font-bold">Log in</h2>
          <p className="mb-6 text-muted-foreground">
            Log in to enjoy your favorite dishes.
          </p>

          <form
            id="form-rhf-demo"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-email"
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
                    <FieldLabel htmlFor="form-rhf-demo-password">
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="form-rhf-demo-password"
                        type={showPassword ? "text" : "password"}
                        aria-invalid={fieldState.invalid}
                        placeholder="Password"
                        autoComplete="current-password"
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
                    <FieldDescription>
                      Must be between 6 and 10 characters.
                    </FieldDescription>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Field orientation="horizontal" className="mt-2">
              <Button type="submit">Let&apos;s Go</Button>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Field>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary underline">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right: image */}
      <div className="flex items-center justify-center">
        <div className="relative w-[856px] h-[904px]">
          <Image
            src="/image.png"
            alt="Delivery courier riding a bike through a city street"
            fill
            sizes="856px"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
