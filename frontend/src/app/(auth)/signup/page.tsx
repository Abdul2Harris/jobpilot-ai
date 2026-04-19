"use client";

import { useState } from "react";
import { Form, Input, Button, Alert, Typography, Card } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const { Title, Text } = Typography;

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/onboarding");
    router.refresh();
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #eef0fb 0%, #f4f0ff 50%, #eef0fb 100%)",
      }}
    >
      {/* Main content — centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* App icon + branding above card */}
        {/* <div className="flex flex-col items-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "linear-gradient(135deg, #4648d4, #6063ee)" }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L9.5 9.5H2L7.5 13.5L5.5 21L12 16.5L18.5 21L16.5 13.5L22 9.5H14.5L12 2Z"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>
          <h1
            className="text-xl font-bold text-[#191c1d] mt-4"
            style={{ letterSpacing: "-0.02em" }}
          >
            AI Job Automation
          </h1>
          <p className="text-sm text-[#464554] mt-1">Craft your vision with precision</p>
        </div> */}

        {/* Card */}
        <Card className="w-full max-w-[420px] !p-8">
          {/* Card header */}
          <div className="mb-6">
            <h2
              className="text-2xl font-bold text-[#191c1d] mb-1"
              style={{ letterSpacing: "-0.02em" }}
            >
              Create your account
            </h2>
            <p className="text-sm text-[#464554]">
              Join the next generation of creative studios
            </p>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              className="mb-5"
              closable
              onClose={() => setError(null)}
            />
          )}

          <Form
            name="signup"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="name"
              label="FULL NAME"
              rules={[{ required: true, message: "Name is required" }]}
              className="!mb-4"
            >
              <Input placeholder="Evelyn Thorne" style={{ borderRadius: 8 }} />
            </Form.Item>

            <Form.Item
              name="email"
              label="EMAIL ADDRESS"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
              className="!mb-4"
            >
              <Input
                placeholder="evelyn@atelier.ai"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="PASSWORD"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Min 6 characters" },
              ]}
              className="!mb-6"
            >
              <Input.Password
                placeholder="••••••••"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              label="CONFIRM PASSWORD"
              // rules={[
              //   { required: true, message: "Password is required" },
              //   { min: 6, message: "Min 6 characters" },
              // ]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Does not match!"));
                  },
                }),
              ]}
              className="!mb-6"
            >
              <Input.Password
                placeholder="••••••••"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            {/* Submit button */}
            <Form.Item className="!my-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                // style={{ borderRadius: 8, height: 48, fontWeight: 600, fontSize: 15 }}
              >
                Create Account →
              </Button>
            </Form.Item>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-[#e1e3e4]" />
              <span className="text-xs font-medium tracking-widest text-[#9a9ba8]">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px bg-[#e1e3e4]" />
            </div>

            {/* Google button */}
            <Form.Item className="!mb-5">
              <Button
                block
                style={{
                  borderRadius: 8,
                  height: 44,
                  borderColor: "rgba(199,196,215,0.3)",
                  background: "#fff",
                  fontWeight: 500,
                  color: "#191c1d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {/* Google SVG logo */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </Form.Item>

            {/* Sign in link */}
            <div className="text-center">
              <Text type="secondary" style={{ fontSize: 13 }}>
                Already have an account?{" "}
              </Text>
              <Link
                href="/login"
                style={{ color: "#4648d4", fontWeight: 600, fontSize: 13 }}
              >
                Sign in
              </Link>
            </div>
          </Form>
        </Card>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#191c1d]">Atelier AI</span>
          <span className="text-sm text-[#9a9ba8]">
            © 2024 Atelier AI. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-sm text-[#464554] hover:text-[#191c1d]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-[#464554] hover:text-[#191c1d]"
          >
            Terms of Service
          </Link>
          <Link
            href="/security"
            className="text-sm text-[#464554] hover:text-[#191c1d]"
          >
            Security
          </Link>
        </div>
      </footer>
    </div>
  );
}
