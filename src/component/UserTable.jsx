import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "antd";

const UserTable = () => {
  const columns = [
    {
      title: "Row Num",
      dataIndex: "row_num",
      key: "row_num",
      sorter: (a, b) => a.row_num - b.row_num,
      ellipsis: true,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sorter: (a, b) => a.location.localeCompare(b.location),
      ellipsis: true,
    },
    {
      title: "CGPA",
      dataIndex: "cgpa",
      key: "cgpa",
      sorter: (a, b) => a.cgpa - b.cgpa,
      ellipsis: true,
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <button onClick={() => handleDelete(record.row_num)}>Delete</button>
          <button onClick={() => handleEdit(record)}>Edit</button>
        </>
      ),
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [row_num, setRow_num] = useState(1);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [cgpa, setCgpa] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleAdd = (event) => {
    event.preventDefault();

    const newUserEntry = {
      name,
      location,
      cgpa,
    };

    if (isEditing) {
      // Perform update logic
      fetch(`http://localhost:4000/user/update/${row_num}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          ...newUserEntry,
          row_num,
        }),
      })
        .then((res) => res.json())
        .then((userData) => {
          setData(userData.data);
        });
    } else {
      // Perform add logic
      fetch("http://localhost:4000/user/add", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(newUserEntry),
      })
        .then((res) => res.json())
        .then((userData) => {
          setData(userData.data);
        });
    }

    setIsModalOpen(false);
    setName("");
    setLocation("");
    setCgpa("");
    setIsEditing(false); // Reset to add mode
  };

  const handleDelete = (row_num) => {
    fetch(`http://localhost:4000/user/delete/${row_num}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((userData) => {
        setData(userData.data);
      });
  };

  const handleEdit = (user) => {
    setIsEditing(true);
    setIsModalOpen(true);
    setRow_num(user.row_num);
    setName(user.name);
    setLocation(user.location);
    setCgpa(user.cgpa);
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    fetch("http://localhost:4000/user/list")
      .then((response) => response.json())
      .then((userData) => {
        setData(userData);
      });
  };

  return (
    <>
      <Table
        rowKey="row_num"
        columns={columns}
        dataSource={[...data]}
        pagination={false}
      />
      <Button className="addbtn" type="primary" onClick={showModal}>
        Add
      </Button>

      <Modal
        title={isEditing ? "Edit Entry" : "Add New Entry"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleAdd} className="addnewdata">
          <input
            required
            value={name}
            placeholder="Name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            required
            value={location}
            placeholder="Location"
            type="text"
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            required
            value={cgpa}
            placeholder="CGPA"
            type="number"
            onChange={(e) => setCgpa(e.target.value)}
          />
          <button type="submit">{isEditing ? "Save" : "Add"}</button>
        </form>
      </Modal>
    </>
  );
};
export default UserTable;
