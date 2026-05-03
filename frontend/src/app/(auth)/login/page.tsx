"use client";

import { useState } from "react";
import { Button, Form, Input, Card, Alert } from "antd";
import { Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <Card className="w-full max-w-md shadow-md px-10">
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold text-on-surface mb-1"
            style={{ letterSpacing: "-0.02em" }}
          >
            AI Job Tracker
          </h2>
          <p className="text-sm text-on-surface-variant">
            Sign in to your account
          </p>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-6"
            closable
            onClose={() => setError(null)}
          />
        )}

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              prefix={<Mail size={15} className="text-on-surface-faint" />}
              placeholder="you@example.com"
              className="!rounded-sm"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              prefix={<Lock size={15} className="text-on-surface-faint" />}
              placeholder="Your password"
              className="!rounded-sm"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign In
            </Button>
          </Form.Item>

          <div className="text-center mt-4">
            <span className="text-sm text-on-surface-variant">
              Don&apos;t have an account?{" "}
            </span>
            <Link href="/signup" className="text-sm text-primary font-semibold">
              Sign up
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
