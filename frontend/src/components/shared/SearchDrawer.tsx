"use client";

import { Drawer, Input, Checkbox, Button, Form, notification } from "antd";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import FormItem from "antd/es/form/FormItem";
import { useJobsSearch } from "@/services/jobs";
import useURLParams from "@/hooks/useURLParms";

export default function SearchDrawer() {
  const router = useRouter();
  const { params, deleteParam } = useURLParams();
  const [form] = Form.useForm();
  const postJobSearch = useJobsSearch();

  const open = params.get("drawer") === "open";

  const handleClose = () => deleteParam("drawer");

  const handleSearch = (values: { job_title: string; sources: string[] }) => {
    postJobSearch.mutate(values, {
      onSuccess: () => {
        notification.success({
          message: "Jobs ready",
          description: `Found matching jobs for "${values.job_title}"`,
        });
        handleClose();
        router.push(`/jobs?job_title=${values.job_title}`);
      },
      onError: (error: any) => {
        notification.error({
          message: "Job search failed",
          description: error.response?.data?.message ?? "Something went wrong. Please try again.",
        });
      },
    });
  };

  return (
    <Drawer
      title="Find Matching Jobs"
      open={open}
      onClose={handleClose}
      width={420}
      footer={
        <Button
          type="primary"
          size="large"
          block
          loading={postJobSearch.isPending}
          onClick={() => form.submit()}
        >
          Search Jobs
        </Button>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSearch}>
        <FormItem
          name="job_title"
          label="Job Title"
          rules={[{ required: true, message: "Please enter a job title" }]}
        >
          <Input
            size="large"
            placeholder="e.g. Software Engineer"
            prefix={<MagnifyingGlass size={16} />}
          />
        </FormItem>

        <FormItem
          name="sources"
          label="Sources"
          initialValue={["naukri", "internshala"]}
        >
          <Checkbox.Group>
            <Checkbox value="naukri">Naukri</Checkbox>
            <Checkbox value="internshala">Internshala</Checkbox>
          </Checkbox.Group>
        </FormItem>
      </Form>
    </Drawer>
  );
}
