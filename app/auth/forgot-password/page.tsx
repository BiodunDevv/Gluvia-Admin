import type { Metadata } from "next";
import { IconDroplet } from "@tabler/icons-react";

import { ForgotPasswordForm } from "@/components/Authentication/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Gluvia admin account password",
};

export default function ForgotPasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <IconDroplet className="size-4" />
            </div>
            Gluvia Admin
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop"
          alt="Healthy breakfast bowl with fruits and grains"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Don't Worry</h2>
          <p className="text-sm text-white/80">
            We'll help you get back to managing healthy nutrition in no time
          </p>
        </div>
      </div>
    </div>
  );
}
