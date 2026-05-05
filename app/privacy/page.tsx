"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ShieldCheck,
  Home01Icon,
  ArrowLeft01Icon,
  UserIcon,
  DatabaseIcon,
  LockIcon,
  EyeIcon,
  ShareKnowledgeIcon,
  Delete01Icon,
  Mail01Icon,
  Clock01Icon,
  MobileNavigator01Icon,
  AnalyticsIcon,
  SecurityLockIcon,
  CookieIcon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";

const getFormattedDate = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const LAST_UPDATED = getFormattedDate();
const EFFECTIVE_DATE = getFormattedDate();
const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "muhammedabiodun42@gmail.com";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Gluvia AI";
const COMPANY = process.env.NEXT_PUBLIC_COMPANY || "Gluvia Inc.";

interface SectionProps {
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
  title: string;
  badge?: string;
  children: React.ReactNode;
}

function Section({ icon, title, badge, children }: SectionProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <HugeiconsIcon
                icon={icon}
                strokeWidth={1.8}
                className="h-5 w-5 text-primary"
              />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {badge && (
            <Badge variant="secondary" className="shrink-0">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
        {children}
      </CardContent>
    </Card>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            strokeWidth={2}
            className="h-4 w-4 text-primary mt-0.5 shrink-0"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header — mirrors 404 card hero */}
      <div className="relative w-full overflow-hidden bg-linear-to-br from-muted/50 to-muted">
        <div className="bg-primary absolute inset-0 z-10 opacity-20 mix-blend-color" />
        <div className="relative z-20 mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-background/80 shadow-lg backdrop-blur-sm mb-6">
            <HugeiconsIcon
              icon={ShieldCheck}
              strokeWidth={1.5}
              className="h-10 w-10 text-primary"
            />
          </div>
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground text-base">
            {APP_NAME} is committed to protecting your personal health data with
            transparency, security, and care.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Clock01Icon}
                strokeWidth={2}
                className="h-3.5 w-3.5"
              />
              Last updated: {LAST_UPDATED}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                strokeWidth={2}
                className="h-3.5 w-3.5"
              />
              Effective: {EFFECTIVE_DATE}
            </span>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={MobileNavigator01Icon}
                strokeWidth={2}
                className="h-3.5 w-3.5"
              />
              Applies to: {APP_NAME} Mobile App
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 space-y-6">
        {/* Intro card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <HugeiconsIcon
                icon={InformationCircleIcon}
                strokeWidth={2}
                className="h-5 w-5 text-primary mt-0.5 shrink-0"
              />
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="font-medium text-foreground mb-1">Summary</p>
                <p>
                  {APP_NAME} is an AI-powered nutrition and health assistant. We
                  collect only what is necessary to deliver personalized meal
                  plans, glucose tracking, and health insights. We never sell
                  your data. Your health information stays yours.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 1. Who We Are */}
        <Section icon={UserIcon} title="1. Who We Are" badge="Identity">
          <p>
            {APP_NAME} ("{COMPANY}", "we", "us", or "our") is a mobile
            application that provides AI-powered nutrition management,
            personalized meal planning, glucose tracking, and health insights to
            users.
          </p>
          <p>
            This Privacy Policy applies to all users of the {APP_NAME} mobile
            application (package:{" "}
            <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              com.biodun42.gluviaai
            </span>
            ) and any associated services.
          </p>
          <p>
            By using the app, you agree to the collection and use of information
            as described in this policy. If you do not agree, please discontinue
            use of the application.
          </p>
        </Section>

        {/* 2. Information We Collect */}
        <Section
          icon={DatabaseIcon}
          title="2. Information We Collect"
          badge="Data"
        >
          <p className="font-medium text-foreground">
            Account & Profile Information
          </p>
          <BulletList
            items={[
              "Name and email address used to create your account",
              "Profile photo (if you choose to upload one — requires camera or gallery access)",
              "Age, gender, height, and weight for nutritional calculations",
              "Dietary preferences, restrictions, and health goals",
            ]}
          />

          <p className="font-medium text-foreground mt-4">
            Health & Nutrition Data
          </p>
          <BulletList
            items={[
              "Blood glucose readings you log manually",
              "Meal logs, food intake records, and calorie tracking",
              "AI-generated meal plans and dietary recommendations",
              "Glucose trend history and pattern analysis",
              "Reminders and notification preferences",
            ]}
          />

          <p className="font-medium text-foreground mt-4">
            Device & Technical Data
          </p>
          <BulletList
            items={[
              "Device type, operating system version, and app version",
              "Crash reports and performance diagnostics (anonymized)",
              "App usage patterns to improve features",
              "Push notification tokens for reminders and alerts",
            ]}
          />
        </Section>

        {/* 3. Camera & Photo Library */}
        <Section
          icon={EyeIcon}
          title="3. Camera & Photo Library Access"
          badge="Permissions"
        >
          <p>
            {APP_NAME} requests access to your device camera and photo library
            solely to allow you to upload a profile photo. This is an optional
            feature.
          </p>
          <BulletList
            items={[
              "Camera access is used only when you explicitly choose to take a profile photo",
              "Photo library access is used only when you select an existing image for your profile",
              "No photos are captured, stored, or transmitted without your direct action",
              "Images are uploaded securely to our servers and associated only with your account",
              "You can revoke camera/photo access at any time in your device Settings",
            ]}
          />
          <p className="mt-2">
            We do not use your camera for surveillance, background access, or
            any purpose other than profile image upload.
          </p>
        </Section>

        {/* 4. Push Notifications */}
        <Section
          icon={MobileNavigator01Icon}
          title="4. Push Notifications"
          badge="Permissions"
        >
          <p>
            {APP_NAME} requests permission to send push notifications to support
            your health journey.
          </p>
          <BulletList
            items={[
              "Meal reminders and glucose check-in prompts",
              "AI-generated health insights and weekly summaries",
              "Admin updates and important account notifications",
              "Glucose level alerts based on your logged readings",
            ]}
          />
          <p>
            You can manage or disable notifications at any time through your
            device's notification settings or within the app. Disabling
            notifications will not affect core app functionality.
          </p>
        </Section>

        {/* 5. How We Use Your Information */}
        <Section
          icon={AnalyticsIcon}
          title="5. How We Use Your Information"
          badge="Usage"
        >
          <BulletList
            items={[
              "Provide and personalize your AI-generated meal plans and nutrition recommendations",
              "Track and visualize your glucose readings and health trends over time",
              "Send relevant reminders, alerts, and health insights via push notifications",
              "Improve the accuracy of our AI models and app performance (using anonymized data only)",
              "Authenticate your account and protect it from unauthorized access",
              "Respond to support requests and resolve technical issues",
              "Comply with applicable laws and legal obligations",
            ]}
          />
          <p className="mt-2">
            We do not use your personal health data for advertising, profiling
            for third parties, or any purpose inconsistent with providing the{" "}
            {APP_NAME} service.
          </p>
        </Section>

        {/* 6. Data Sharing */}
        <Section
          icon={ShareKnowledgeIcon}
          title="6. Data Sharing & Disclosure"
          badge="Third Parties"
        >
          <p className="font-medium text-foreground">
            We do not sell your personal data. Period.
          </p>
          <p className="mt-2">
            We may share limited data only in these circumstances:
          </p>
          <BulletList
            items={[
              "Service providers: trusted vendors who help us operate the app (e.g., cloud hosting, push notification services) under strict data processing agreements",
              "AI processing: anonymized and aggregated nutritional data may be used to improve our AI recommendations",
              "Legal compliance: when required by law, court order, or to protect the safety of our users",
              "Business transfers: in the event of a merger or acquisition, with prior notice to users",
            ]}
          />
          <p className="mt-2">
            All third-party service providers are contractually required to
            protect your data and may not use it for their own purposes.
          </p>
        </Section>

        {/* 7. Data Retention */}
        <Section icon={Clock01Icon} title="7. Data Retention" badge="Storage">
          <BulletList
            items={[
              "Account data is retained for as long as your account is active",
              "Health and nutrition logs are retained to provide long-term trend analysis",
              "You may request deletion of your account and all associated data at any time",
              "Upon account deletion, personal data is permanently removed within 30 days",
              "Anonymized, aggregated data may be retained indefinitely for service improvement",
              "Crash logs and diagnostics are automatically purged after 90 days",
            ]}
          />
        </Section>

        {/* 8. Data Security */}
        <Section
          icon={SecurityLockIcon}
          title="8. Data Security"
          badge="Protection"
        >
          <p>
            We implement industry-standard security measures to protect your
            personal and health data:
          </p>
          <BulletList
            items={[
              "All data is transmitted over encrypted HTTPS/TLS connections",
              "Health data is stored on secure, access-controlled cloud infrastructure",
              "Account authentication uses secure token-based sessions",
              "We regularly review and update our security practices",
              "Access to your data is restricted to authorized personnel only",
            ]}
          />
          <p className="mt-2">
            While we take every reasonable precaution, no system is completely
            immune to risk. We will notify you promptly in the event of a data
            breach that affects your personal information.
          </p>
        </Section>

        {/* 9. Your Rights */}
        <Section
          icon={LockIcon}
          title="9. Your Rights & Choices"
          badge="Control"
        >
          <p>You have full control over your personal data. You may:</p>
          <BulletList
            items={[
              "Access: request a copy of all personal data we hold about you",
              "Correct: update inaccurate profile or health information at any time within the app",
              "Delete: request permanent deletion of your account and all associated data",
              "Export: request an export of your nutrition and health data in a portable format",
              "Opt out: unsubscribe from non-essential notifications and communications",
              "Withdraw consent: revoke camera, photo library, or notification permissions via device Settings",
            ]}
          />
          <p className="mt-2">
            To exercise any of these rights, contact us at{" "}
            <span className="font-medium text-foreground">{CONTACT_EMAIL}</span>
            . We will respond within 30 days.
          </p>
        </Section>

        {/* 10. Cookies */}
        <Section
          icon={CookieIcon}
          title="10. Cookies & Tracking"
          badge="Tracking"
        >
          <p>
            The {APP_NAME} mobile application does not use browser cookies. We
            may use the following limited tracking mechanisms:
          </p>
          <BulletList
            items={[
              "Anonymous analytics to understand feature usage and improve the app (no personally identifiable information)",
              "Session tokens stored securely on your device to keep you logged in",
              "Push notification device tokens to deliver your reminders",
            ]}
          />
          <p>
            We do not use cross-app tracking, advertising identifiers, or
            third-party analytics networks that profile you across other apps or
            websites.
          </p>
        </Section>

        {/* 11. Children */}
        <Section icon={UserIcon} title="11. Children's Privacy" badge="Age">
          <p>
            {APP_NAME} is not intended for use by children under the age of 13.
            We do not knowingly collect personal information from children under
            13.
          </p>
          <p>
            If you are a parent or guardian and believe your child has provided
            us with personal information, please contact us immediately at{" "}
            <span className="font-medium text-foreground">{CONTACT_EMAIL}</span>{" "}
            and we will take steps to delete that information.
          </p>
        </Section>

        {/* 12. Changes */}
        <Section
          icon={InformationCircleIcon}
          title="12. Changes to This Policy"
          badge="Updates"
        >
          <p>
            We may update this Privacy Policy from time to time. When we do, we
            will:
          </p>
          <BulletList
            items={[
              'Update the "Last updated" date at the top of this page',
              "Notify you via push notification or email for material changes",
              "Provide at least 7 days notice before significant changes take effect",
            ]}
          />
          <p>
            Continued use of {APP_NAME} after changes are posted constitutes
            your acceptance of the updated policy. We encourage you to review
            this page periodically.
          </p>
        </Section>

        {/* 13. Contact */}
        <Section icon={Mail01Icon} title="13. Contact Us" badge="Support">
          <p>
            If you have questions, concerns, or requests regarding this Privacy
            Policy or how we handle your data, please reach out:
          </p>
          <div className="rounded-lg border bg-muted/50 p-4 mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={Mail01Icon}
                strokeWidth={2}
                className="h-4 w-4 text-muted-foreground shrink-0"
              />
              <span className="font-medium text-foreground">
                {CONTACT_EMAIL}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={MobileNavigator01Icon}
                strokeWidth={2}
                className="h-4 w-4 text-muted-foreground shrink-0"
              />
              <span>
                {APP_NAME} Mobile App —{" "}
                <span className="font-mono text-xs">com.biodun42.gluviaai</span>
              </span>
            </div>
          </div>
          <p className="mt-2">
            We take every privacy concern seriously and aim to respond within 5
            business days.
          </p>
        </Section>

        {/* Delete account note */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <HugeiconsIcon
                  icon={Delete01Icon}
                  strokeWidth={2}
                  className="h-5 w-5 text-destructive"
                />
              </div>
              <CardTitle className="text-lg">Account & Data Deletion</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              You can delete your {APP_NAME} account and all associated health
              data at any time using either method below. Deletion is permanent
              and irreversible.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Method 1 — in-app */}
              <div className="rounded-lg border border-destructive/20 bg-background/60 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={MobileNavigator01Icon}
                    strokeWidth={2}
                    className="h-4 w-4 text-destructive shrink-0"
                  />
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider">
                    Option 1 — In the app
                  </p>
                </div>
                <p className="text-muted-foreground">
                  Open {APP_NAME} →{" "}
                  <span className="font-medium text-foreground">
                    Profile → Settings → Delete Account
                  </span>
                  . You will be asked to confirm before your data is removed.
                </p>
              </div>

              {/* Method 2 — web form */}
              <div className="rounded-lg border border-destructive/20 bg-background/60 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Delete01Icon}
                    strokeWidth={2}
                    className="h-4 w-4 text-destructive shrink-0"
                  />
                  <p className="font-medium text-foreground text-xs uppercase tracking-wider">
                    Option 2 — Web form
                  </p>
                </div>
                <p className="text-muted-foreground">
                  Submit a deletion request online at{" "}
                  <Link
                    href="/delete-account"
                    className="font-medium text-foreground underline underline-offset-4 hover:text-destructive"
                  >
                    gluvia.vercel.app/delete-account
                  </Link>
                  . You will receive a verification code by email and can track
                  or cancel your request at any time.
                </p>
              </div>
            </div>

            <p className="text-muted-foreground text-xs">
              Need help? Email us at{" "}
              <span className="font-medium text-foreground">{CONTACT_EMAIL}</span>.
              We will respond within 5 business days.
            </p>
          </CardContent>
        </Card>

        {/* Footer nav — mirrors 404 footer */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              <HugeiconsIcon
                icon={Home01Icon}
                strokeWidth={2}
                data-icon="inline-start"
              />
              Go to Dashboard
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              data-icon="inline-start"
            />
            Go Back
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground pb-8">
          © {new Date().getFullYear()} {COMPANY}. All rights reserved.
          &nbsp;·&nbsp; This policy is effective as of {EFFECTIVE_DATE}.
        </p>
      </div>
    </div>
  );
}
