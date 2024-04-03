import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const { Option } = Select;

const AdminAnnouncementForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());

      await axios.post("/api/announcement", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      message.success("Announcement created successfully");
      form.resetFields();
    } catch (error) {
      message.error("Failed to create announcement");
      console.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="announcement-form m-3"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please input the content!" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="targetRoles"
          label="Target Roles"
          rules={[{ required: true, message: "Please select target roles!" }]}
        >
          <Select
            mode="multiple"
            allowClear
            placeholder="Select target roles"
          >
            <Option value="admin">Admin</Option>
            <Option value="employee">Employee</Option>
            <Option value="general">General</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create Announcement
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAnnouncementForm;
