"use client";

import { useState } from "react";
import { Drawer, Input, Checkbox, Select, Button, Form, notification } from "antd";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import FormItem from "antd/es/form/FormItem";
import { useJobsSearch } from "@/services/jobs";
import useURLParams from "@/hooks/useURLParms";

interface SearchDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ open, onClose }: SearchDrawerProps) {
  const router = useRouter();
  const [form] = Form.useForm();


  const postJobSearch = useJobsSearch();
//   const jobTitle = params.get("job_title") || "";


  const handleSearch = (values: { job_title: string, sources: string[] }) => {
    console.log('values:', values)
    postJobSearch.mutate(values, {
      onSuccess: () => {
        router.push(`/jobs?job_title=${values.job_title}`);
      },
      onError: (error:any) => {
        console.log("error:", error);
        // show error toast/message to user
        notification.error({
          message: "Error",
          description: error.response?.data?.message,
        });
      },
    });
  };

  return (
    <Drawer
      title="Find Matching Jobs"
      open={open}
      onClose={onClose}
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

        {/* <FormItem name="pages" label="Pages to Scrape" initialValue={1}>
          <Select size="large" options={}>
            
          </Select>
        </FormItem> */}
      </Form>
    </Drawer>
  );
}
