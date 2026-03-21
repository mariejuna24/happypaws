import React, { useState } from "react";
import { addService } from "../services/api"; // ← Firebase
import { useNavigate } from "react-router-dom";

const AdminAddService = () => {
  const navigate = useNavigate();

  const [service, setService] = useState({
    title: "",
    desc: "",
    price: "",
    image: "",
    fullDescription: ""
  });

  const handleChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newService = {
      ...service,
      price: Number(service.price),
      hygieneIncludes: [],
      notes: [],
      cancellationPolicy: ""
    };

    await addService(newService); // ← Firebase

    alert("Service Added Successfully!");
    navigate("/admin/admin-services");
  };

  return (
    <div className="container mt-4">
      <h3>Add New Service</h3>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Service Title"
          className="form-control mb-2" onChange={handleChange} required />
        <input type="text" name="desc" placeholder="Short Description"
          className="form-control mb-2" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price"
          className="form-control mb-2" onChange={handleChange} required />
        <input type="text" name="image" placeholder="Image URL"
          className="form-control mb-2" onChange={handleChange} required />
        <textarea name="fullDescription" placeholder="Full Description"
          className="form-control mb-2" onChange={handleChange} required />
        <button className="btn btn-primary">Add Service</button>
      </form>
    </div>
  );
};

export default AdminAddService;